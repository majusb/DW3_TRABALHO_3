document.addEventListener('DOMContentLoaded', async function() {
    if (!dw3IsLogged()) {
        return;
    }

    var form = document.getElementById('frmPiquete');
    if (!form) {
        return;
    }

    var parametros = new URLSearchParams(window.location.search);
    var oper = parametros.get('oper') || parametros.get('Oper');
    var servidorDw3 = form.dataset.servidorDw3;
    var btnInserir = document.getElementById('btnInserirPiquete');
    var btnAtualizar = document.getElementById('btnAtualizarPiquete');
    var btnRemover = document.getElementById('btnRemoverPiquete');

    await carregarComboPastos(servidorDw3);

    if (oper === 'Cr') {
        if (btnInserir) {
            btnInserir.classList.remove('d-none');
        }
    }

    if (oper === 'Re') {
        await vwGetPiqueteByID();
    }

    if (oper === 'Up') {
        if (btnAtualizar) {
            btnAtualizar.classList.remove('d-none');
            btnAtualizar.disabled = !(await vwGetPiqueteByID());
            btnAtualizar.addEventListener('click', function() {
                vwUpdatePiquete();
            });
        }
    }

    if (oper === 'De') {
        if (btnRemover) {
            btnRemover.classList.remove('d-none');
            btnRemover.disabled = !(await vwGetPiqueteByID());
            btnRemover.addEventListener('click', function() {
                vwDeletePiquete();
            });
        }
    }

    if (btnInserir) {
        btnInserir.addEventListener('click', function() {
            vwInsertPiquete();
        });
    }
});


async function carregarComboPastos(servidorDw3) {
    try {
        var selectPasto = document.getElementById('pastoidfk');
        if (!selectPasto) {
            return;
        }

        var response = await fetch(servidorDw3 + '/getAllPastos', {
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            })
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar a lista de pastos.');
        }

        var data = await response.json();

        if (data.status === 'ok' && Array.isArray(data.registro)) {
            selectPasto.innerHTML = '<option value="">Selecione um pasto...</option>';
            data.registro.forEach(function(pasto) {
                var option = document.createElement('option');
                option.value = pasto.pastoid;
                option.text = pasto.nomepasto;
                selectPasto.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar combo de pastos:', error);
    }
}

function montarPiqueteFormulario() {
    return {
        piqueteid: document.getElementById('idPiquete').value,
        descricao: document.getElementById('descricao').value,
        latitude: document.getElementById('latitude').value,
        longitude: document.getElementById('longitude').value,
        pastoidfk: document.getElementById('pastoidfk').value,
        removido: document.getElementById('removido').value === 'true'
    };
}

async function vwInsertPiquete() {
    var form = document.getElementById('frmPiquete');
    var btnInserir = document.getElementById('btnInserirPiquete');

    try {
        if (!form.reportValidity()) {
            return;
        }

        var latitude = parseFloat(document.getElementById('latitude').value);
        var longitude = parseFloat(document.getElementById('longitude').value);

        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            alert('A latitude deve ser um valor numérico entre -90 e 90.');
            document.getElementById('latitude').focus();
            return;
        }

        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            alert('A longitude deve ser um valor numérico entre -180 e 180.');
            document.getElementById('longitude').focus();
            return;
        }

        var servidorDw3 = form.dataset.servidorDw3;

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        if (btnInserir) {
            btnInserir.disabled = true;
        }

        var response = await fetch(servidorDw3 + '/insertPiquete', {
            method: 'POST',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(montarPiqueteFormulario())
        });

        if (!response.ok) {
            throw new Error('Não foi possível inserir o piquete.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível inserir o piquete.');
        }

        window.location.href = '/piquete';
    } catch (error) {
        alert(error.message || 'Erro ao inserir piquete.');
    } finally {
        if (btnInserir) {
            btnInserir.disabled = false;
        }
    }
}

async function vwGetPiqueteByID() {
    var form = document.getElementById('frmPiquete');

    try {
        var parametros = new URLSearchParams(window.location.search);
        var idPiquete = parametros.get('idPiquete');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idPiquete || !/^\d+$/.test(idPiquete) || Number(idPiquete) <= 0) {
            throw new Error('ID do piquete inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var response = await fetch(servidorDw3 + '/getPiqueteByID/' + encodeURIComponent(idPiquete), {
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            })
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar o piquete.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        var piquete = data.registro[0];

        if (!piquete) {
            throw new Error('Piquete não encontrado.');
        }

        document.getElementById('idPiquete').value = piquete.piqueteid;
        document.getElementById('descricao').value = piquete.descricao ?? '';
        document.getElementById('latitude').value = piquete.latitude ?? '';
        document.getElementById('longitude').value = piquete.longitude ?? '';
        document.getElementById('pastoidfk').value = piquete.pastoidfk ?? '';
        document.getElementById('removido').value = String(piquete.removido === true);

        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar piquete.');
        return false;
    }
}

async function vwUpdatePiquete() {
    var form = document.getElementById('frmPiquete');
    var btnAtualizar = document.getElementById('btnAtualizarPiquete');

    if (btnAtualizar.disabled || !form.reportValidity()) {
        return;
    }

    try {
        var latitude = parseFloat(document.getElementById('latitude').value);
        var longitude = parseFloat(document.getElementById('longitude').value);

        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            alert('A latitude deve ser um valor numérico entre -90 e 90.');
            document.getElementById('latitude').focus();
            return;
        }

        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            alert('A longitude deve ser um valor numérico entre -180 e 180.');
            document.getElementById('longitude').focus();
            return;
        }

        var idPiquete = new URLSearchParams(window.location.search).get('idPiquete');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idPiquete || !/^\d+$/.test(idPiquete) || Number(idPiquete) <= 0) {
            throw new Error('ID do piquete inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnAtualizar.disabled = true;

        var piquete = montarPiqueteFormulario();
        piquete.piqueteid = Number(idPiquete);

        var response = await fetch(servidorDw3 + '/updatePiquete/' + encodeURIComponent(idPiquete), {
            method: 'PUT',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(piquete)
        });

        if (!response.ok) {
            throw new Error('Não foi possível atualizar o piquete.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível atualizar o piquete.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhum piquete foi atualizado.');
        }

        alert('Piquete atualizado com sucesso.');
        window.location.href = '/piquete';
    } catch (error) {
        alert(error.message || 'Erro ao atualizar piquete.');
    } finally {
        btnAtualizar.disabled = false;
    }
}

async function vwDeletePiquete() {
    var form = document.getElementById('frmPiquete');
    var btnRemover = document.getElementById('btnRemoverPiquete');

    if (btnRemover.disabled) {
        return;
    }

    if (!window.confirm('Confirma a remoção deste piquete?')) {
        return;
    }

    try {
        var idPiquete = document.getElementById('idPiquete').value;
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idPiquete || !/^\d+$/.test(idPiquete) || Number(idPiquete) <= 0) {
            throw new Error('ID do piquete inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnRemover.disabled = true;

        var response = await fetch(servidorDw3 + '/deletePiquete/' + encodeURIComponent(idPiquete), {
            method: 'DELETE',
            headers: dw3MontarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Não foi possível remover o piquete.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível remover o piquete.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhum piquete foi removido.');
        }

        window.location.href = '/piquete';
    } catch (error) {
        alert(error.message || 'Erro ao remover piquete.');
    } finally {
        btnRemover.disabled = false;
    }
}