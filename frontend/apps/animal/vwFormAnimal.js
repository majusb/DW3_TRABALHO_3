document.addEventListener('DOMContentLoaded', async function() {
    if (!dw3IsLogged()) {
        return;
    }

    var form = document.getElementById('frmAnimal');
    if (!form) {
        return;
    }

    var parametros = new URLSearchParams(window.location.search);
    var oper = parametros.get('oper') || parametros.get('Oper');
    var btnInserir = document.getElementById('btnInserirAnimal');
    var btnAtualizar = document.getElementById('btnAtualizarAnimal');
    var btnRemover = document.getElementById('btnRemoverAnimal');

    if (oper === 'Cr') {
        if (btnInserir) {
            btnInserir.classList.remove('d-none');
        }
    }

    if (oper === 'Re') {
        await vwGetAnimalByID();
    }

    if (oper === 'Up') {
        if (btnAtualizar) {
            btnAtualizar.classList.remove('d-none');
            btnAtualizar.disabled = !(await vwGetAnimalByID());
            btnAtualizar.addEventListener('click', function() {
                vwUpdateAnimal();
            });
        }
    }

    if (oper === 'De') {
        if (btnRemover) {
            btnRemover.classList.remove('d-none');
            btnRemover.disabled = !(await vwGetAnimalByID());
            btnRemover.addEventListener('click', function() {
                vwDeleteAnimal();
            });
        }
    }

    if (btnInserir) {
        btnInserir.addEventListener('click', function() {
            vwInsertAnimal();
        });
    }
});

function montarAnimalFormulario() {
    return {
        idAnimal: document.getElementById('idAnimal').value,
        nome: document.getElementById('nome').value,
        datanasc: document.getElementById('datanasc').value,
        removido: document.getElementById('removido').value === 'true'
    };
}

async function vwInsertAnimal() {
    var form = document.getElementById('frmAnimal');
    var btnInserir = document.getElementById('btnInserirAnimal');

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

        var response = await fetch(servidorDw3 + '/insertAnimal', {
            method: 'POST',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(montarAnimalFormulario())
        });

        if (!response.ok) {
            throw new Error('Não foi possível inserir o animal.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível inserir o animal.');
        }

        window.location.href = '/animal';
    } catch (error) {
        alert(error.message || 'Erro ao inserir animal.');
    } finally {
        if (btnInserir) {
            btnInserir.disabled = false;
        }
    }
}

async function vwGetAnimalByID() {
    var form = document.getElementById('frmAnimal');

    try {
        var parametros = new URLSearchParams(window.location.search);
        var idAnimal = parametros.get('idAnimal');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idAnimal || !/^\d+$/.test(idAnimal) || Number(idAnimal) <= 0) {
            throw new Error('ID do animal inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var response = await fetch(servidorDw3 + '/getAnimalByID/' + encodeURIComponent(idAnimal), {
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            })
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar o animal.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        var animal = data.registro[0];

        if (!animal) {
            throw new Error('Animal não encontrado.');
        }

        document.getElementById('idAnimal').value = animal.animalid;
        document.getElementById('nome').value = animal.nome ?? '';
        document.getElementById('datanasc').value = animal.datanasc ?? '';
        document.getElementById('removido').value = String(animal.removido === true);

        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar animal.');
        return false;
    }
}

async function vwUpdateAnimal() {
    var form = document.getElementById('frmAnimal');
    var btnAtualizar = document.getElementById('btnAtualizarAnimal');

    if (btnAtualizar.disabled || !form.reportValidity()) {
        return;
    }

    try {
        var idAnimal = new URLSearchParams(window.location.search).get('idAnimal');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idAnimal || !/^\d+$/.test(idAnimal) || Number(idAnimal) <= 0) {
            throw new Error('ID do animal inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnAtualizar.disabled = true;

        var animal = montarAnimalFormulario();
        animal.idAnimal = Number(idAnimal);

        var response = await fetch(servidorDw3 + '/updateAnimal/' + encodeURIComponent(idAnimal), {
            method: 'PUT',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(animal)
        });

        if (!response.ok) {
            throw new Error('Não foi possível atualizar o animal.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível atualizar o animal.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhum animal foi atualizado.');
        }

        alert('Animal atualizado com sucesso.');
        window.location.href = '/animal';
    } catch (error) {
        alert(error.message || 'Erro ao atualizar animal.');
    } finally {
        btnAtualizar.disabled = false;
    }
}

async function vwDeleteAnimal() {
    var form = document.getElementById('frmAnimal');
    var btnRemover = document.getElementById('btnRemoverAnimal');

    if (btnRemover.disabled) {
        return;
    }

    if (!window.confirm('Confirma a remoção deste animal?')) {
        return;
    }

    try {
        var idAnimal = document.getElementById('idAnimal').value;
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idAnimal || !/^\d+$/.test(idAnimal) || Number(idAnimal) <= 0) {
            throw new Error('ID do animal inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnRemover.disabled = true;

        var response = await fetch(servidorDw3 + '/deleteAnimal/' + encodeURIComponent(idAnimal), {
            method: 'DELETE',
            headers: dw3MontarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Não foi possível remover o animal.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível remover o animal.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhum animal foi removido.');
        }

        window.location.href = '/animal';
    } catch (error) {
        alert(error.message || 'Erro ao remover animal.');
    } finally {
        btnRemover.disabled = false;
    }
}
