document.addEventListener('DOMContentLoaded', async function() {
    if (!dw3IsLogged()) {
        return;
    }

    var form = document.getElementById('frmPasto');
    if (!form) {
        return;
    }

    var parametros = new URLSearchParams(window.location.search);
    var oper = parametros.get('oper') || parametros.get('Oper');
    var servidorDw3 = form.dataset.servidorDw3;
    var btnInserir = document.getElementById('btnInserirPasto');
    var btnAtualizar = document.getElementById('btnAtualizarPasto');
    var btnRemover = document.getElementById('btnRemoverPasto');

    if (oper === 'Cr') {
        if (btnInserir) {
            btnInserir.classList.remove('d-none');
        }
    }

    if (oper === 'Re') {
        await vwGetPastoByID();
    }

    if (oper === 'Up') {
        if (btnAtualizar) {
            btnAtualizar.classList.remove('d-none');
            btnAtualizar.disabled = !(await vwGetPastoByID());
            btnAtualizar.addEventListener('click', function() {
                vwUpdatePasto();
            });
        }
    }

    if (oper === 'De') {
        if (btnRemover) {
            btnRemover.classList.remove('d-none');
            btnRemover.disabled = !(await vwGetPastoByID());
            btnRemover.addEventListener('click', function() {
                vwDeletePasto();
            });
        }
    }

    if (btnInserir) {
        btnInserir.addEventListener('click', function() {
            vwInsertPasto();
        });
    }
});

function montarPastoFormulario() {
    return {
        idPasto: document.getElementById('idPasto').value,
        nomePasto: document.getElementById('nomePasto').value,
        descricao: document.getElementById('descricao').value,
        area: document.getElementById('area').value,
        deleted: document.getElementById('deleted').value === 'true'
    };
}


async function vwInsertPasto() {
    var form = document.getElementById('frmPasto');
    var btnInserir = document.getElementById('btnInserirPasto');

    try {
        if (!form.reportValidity()) {
            return;
        }

        var servidorDw3 = form.dataset.servidorDw3;

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        if (btnInserir) {
            btnInserir.disabled = true;
        }

        var response = await fetch(servidorDw3 + '/insertPasto', {
            method: 'POST',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(montarPastoFormulario())
        });

        if (!response.ok) {
            throw new Error('Não foi possível inserir o pasto.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível inserir o pasto.');
        }

        window.location.href = '/pasto';
    } catch (error) {
        alert(error.message || 'Erro ao inserir pasto.');
    } finally {
        if (btnInserir) {
            btnInserir.disabled = false;
        }
    }
}

async function vwGetPastoByID() {
    var form = document.getElementById('frmPasto');

    try {
        var parametros = new URLSearchParams(window.location.search);
        var idPasto = parametros.get('idPasto');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idPasto || !/^\d+$/.test(idPasto) || Number(idPasto) <= 0) {
            throw new Error('ID do pasto inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var response = await fetch(servidorDw3 + '/getPastoByID/' + encodeURIComponent(idPasto), {
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            })
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar o pasto.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        var pasto = data.registro[0];

        if (!pasto) {
            throw new Error('Pasto não encontrado.');
        }

        // Ajustado para capturar as propriedades em minúsculas retornadas pelo Postgres, igual ao paciente
        document.getElementById('idPasto').value = pasto.idpasto;
        document.getElementById('nomePasto').value = pasto.nomepasto ?? '';
        document.getElementById('localizacao').value = pasto.localizacao ?? '';
        document.getElementById('telefone').value = pasto.telefone ?? '';
        document.getElementById('deleted').value = String(pasto.deleted === true);

        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar pasto.');
        return false;
    }
}

async function vwUpdatePasto() {
    var form = document.getElementById('frmPasto');
    var btnAtualizar = document.getElementById('btnAtualizarPasto');

    if (btnAtualizar.disabled || !form.reportValidity()) {
        return;
    }

    try {
        var idPasto = new URLSearchParams(window.location.search).get('idPasto');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idPasto || !/^\d+$/.test(idPasto) || Number(idPasto) <= 0) {
            throw new Error('ID do pasto inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnAtualizar.disabled = true;

        var pasto = montarPastoFormulario();
        pasto.idPasto = Number(idPasto);

        var response = await fetch(servidorDw3 + '/updatePasto/' + encodeURIComponent(idPasto), {
            method: 'PUT',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(pasto)
        });

        if (!response.ok) {
            throw new Error('Não foi possível atualizar o pasto.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível atualizar o pasto.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhum pasto foi atualizado.');
        }

        alert('Pasto atualizado com sucesso.');
        window.location.href = '/pasto';
    } catch (error) {
        alert(error.message || 'Erro ao atualizar pasto.');
    } finally {
        btnAtualizar.disabled = false;
    }
}

async function vwDeletePasto() {
    var form = document.getElementById('frmPasto');
    var btnRemover = document.getElementById('btnRemoverPasto');

    if (btnRemover.disabled) {
        return;
    }

    if (!window.confirm('Confirma a remoção deste pasto?')) {
        return;
    }

    try {
        var idPasto = document.getElementById('idPasto').value;
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idPasto || !/^\d+$/.test(idPasto) || Number(idPasto) <= 0) {
            throw new Error('ID do pasto inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnRemover.disabled = true;

        var response = await fetch(servidorDw3 + '/deletePasto/' + encodeURIComponent(idPasto), {
            method: 'DELETE',
            headers: dw3MontarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Não foi possível remover o pasto.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível remover o pasto.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhum pasto foi removido.');
        }

        window.location.href = '/pasto';
    } catch (error) {
        alert(error.message || 'Erro ao remover pasto.');
    } finally {
        btnRemover.disabled = false;
    }
}