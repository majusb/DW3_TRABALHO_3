document.addEventListener('DOMContentLoaded', async function() {
    if (!dw3IsLogged()) {
        return;
    }

    var form = document.getElementById('frmAlocado');

    if (!form) {
        return;
    }

    var servidorDw3 = form.dataset.servidorDw3;
    var parametros = new URLSearchParams(window.location.search);
    var oper = parametros.get('oper') || parametros.get('Oper');
    var btnInserir = document.getElementById('btnInserirAlocado');
    var btnAtualizar = document.getElementById('btnAtualizarAlocado');
    var btnRemover = document.getElementById('btnRemoverAlocado');

    await carregarSelects(servidorDw3);

    if (oper === 'Cr') {
        if (btnInserir) {
            btnInserir.classList.remove('d-none');
        }
    }

    if (oper === 'Re') {
        await vwGetAlocadoByID();
    }

    if (oper === 'Up') {
        if (btnAtualizar) {
            btnAtualizar.classList.remove('d-none');
            btnAtualizar.disabled = !(await vwGetAlocadoByID());
            btnAtualizar.addEventListener('click', function() {
                vwUpdateAlocado();
            });
        }
    }

    if (oper === 'De') {
        if (btnRemover) {
            btnRemover.classList.remove('d-none');
            btnRemover.disabled = !(await vwGetAlocadoByID());
            btnRemover.addEventListener('click', function() {
                vwDeleteAlocado();
            });
        }
    }

    if (btnInserir) {
        btnInserir.addEventListener('click', function() {
            vwInsertAlocado();
        });
    }
});

async function carregarSelects(servidorDw3) {
    if (!servidorDw3) {
        alert('Endereço do servidor backend não configurado.');
        return;
    }

    try {
        var animais = await buscarListaFormAlocado(servidorDw3, '/getAllAnimal');
        preencherSelectAlocado('animalidifk', animais, 'animalid', 'nome');
    } catch (error) {
        console.error('Não foi possível carregar os animais.', error);
    }

    try {
        var piquetes = await buscarListaFormAlocado(servidorDw3, '/getAllPiquete');
        preencherSelectAlocado('piqueteidfk', piquetes, 'piqueteid', 'descricao');
    } catch (error) {
        console.error('Não foi possível carregar os piquetes.', error);
    }
}

async function buscarListaFormAlocado(servidorDw3, rota) {
    var token = localStorage.getItem('token');

    var response = await fetch(servidorDw3 + rota, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        throw new Error('Não foi possível carregar os dados do servidor.');
    }

    var data = await response.json();

    if (data.status !== 'ok' || !Array.isArray(data.registro)) {
        throw new Error('Resposta inválida do servidor backend.');
    }

    return data.registro;
}

function preencherSelectAlocado(idSelect, lista, campoValor, campoTexto) {
    var select = document.getElementById(idSelect);

    if (!select) {
        return;
    }

    lista.forEach(function(item) {
        var opcao = document.createElement('option');
        opcao.value = item[campoValor];
        opcao.textContent = item[campoTexto];
        select.appendChild(opcao);
    });
}

function montarAlocadoFormulario() {
    return {
        idAlocado: document.getElementById('idAlocado').value,
        animalidifk: document.getElementById('animalidifk').value,
        piqueteidfk: document.getElementById('piqueteidfk').value,
        datainicio: document.getElementById('datainicio').value,
        datafinal: document.getElementById('datafinal').value,
        removido: document.getElementById('removido').value === 'true'
    };
}

async function vwInsertAlocado() {
    var form = document.getElementById('frmAlocado');
    var btnInserir = document.getElementById('btnInserirAlocado');

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

        var response = await fetch(servidorDw3 + '/insertAlocado', {
            method: 'POST',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(montarAlocadoFormulario())
        });

        if (!response.ok) {
            throw new Error('Não foi possível inserir a alocação.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível inserir a alocação.');
        }

        window.location.href = '/alocado';
    } catch (error) {
        alert(error.message || 'Erro ao inserir alocação.');
    } finally {
        if (btnInserir) {
            btnInserir.disabled = false;
        }
    }
}

async function vwGetAlocadoByID() {
    var form = document.getElementById('frmAlocado');

    try {
        var parametros = new URLSearchParams(window.location.search);
        var idAlocado = parametros.get('idAlocado');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idAlocado || !/^\d+$/.test(idAlocado) || Number(idAlocado) <= 0) {
            throw new Error('ID da alocação inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var response = await fetch(servidorDw3 + '/getAlocadoByID/' + encodeURIComponent(idAlocado), {
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            })
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar a alocação.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        var alocado = data.registro[0];

        if (!alocado) {
            throw new Error('Alocação não encontrada.');
        }

        document.getElementById('idAlocado').value = alocado.alocadoid;
        document.getElementById('animalidifk').value = alocado.animalidifk ?? '';
        document.getElementById('piqueteidfk').value = alocado.piqueteidfk ?? '';
        document.getElementById('datainicio').value = alocado.datainicio ?? '';
        document.getElementById('datafinal').value = alocado.datafinal ?? '';
        document.getElementById('removido').value = String(alocado.removido === true);

        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar alocação.');
        return false;
    }
}

async function vwUpdateAlocado() {
    var form = document.getElementById('frmAlocado');
    var btnAtualizar = document.getElementById('btnAtualizarAlocado');

    if (btnAtualizar.disabled || !form.reportValidity()) {
        return;
    }

    try {
        var idAlocado = new URLSearchParams(window.location.search).get('idAlocado');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idAlocado || !/^\d+$/.test(idAlocado) || Number(idAlocado) <= 0) {
            throw new Error('ID da alocação inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnAtualizar.disabled = true;

        var response = await fetch(servidorDw3 + '/updateAlocado/' + encodeURIComponent(idAlocado), {
            method: 'PUT',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(montarAlocadoFormulario())
        });

        if (!response.ok) {
            throw new Error('Não foi possível atualizar a alocação.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível atualizar a alocação.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhuma alocação foi atualizada.');
        }

        alert('Alocação atualizada com sucesso.');
        window.location.href = '/alocado';
    } catch (error) {
        alert(error.message || 'Erro ao atualizar alocação.');
    } finally {
        btnAtualizar.disabled = false;
    }
}

async function vwDeleteAlocado() {
    var form = document.getElementById('frmAlocado');
    var btnRemover = document.getElementById('btnRemoverAlocado');

    if (btnRemover.disabled) {
        return;
    }

    if (!window.confirm('Confirma a remoção desta alocação?')) {
        return;
    }

    try {
        var idAlocado = document.getElementById('idAlocado').value;
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idAlocado || !/^\d+$/.test(idAlocado) || Number(idAlocado) <= 0) {
            throw new Error('ID da alocação inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnRemover.disabled = true;

        var response = await fetch(servidorDw3 + '/deleteAlocado/' + encodeURIComponent(idAlocado), {
            method: 'DELETE',
            headers: dw3MontarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Não foi possível remover a alocação.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível remover a alocação.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhuma alocação foi removida.');
        }

        window.location.href = '/alocado';
    } catch (error) {
        alert(error.message || 'Erro ao remover alocação.');
    } finally {
        btnRemover.disabled = false;
    }
}
