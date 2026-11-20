document.addEventListener('DOMContentLoaded', function() {
    if (!dw3IsLogged()) {
        return;
    }

    var listagem = document.getElementById('animalListagem');
    var alertBox = document.getElementById('animalAlert');

    if (!listagem) {
        return;
    }

    var servidorDw3 = listagem.dataset.servidorDw3;

    configurarOperacoesAnimal(alertBox);
    carregarAnimal(servidorDw3, alertBox);
});

async function carregarAnimal(servidorDw3, alertBox) {
    try {
        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var token = localStorage.getItem('token');

        var response = await fetch(servidorDw3 + '/getAllAnimais', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar a lista de animais.');
        }

        var data = await response.json();

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        inicializarTabelaAnimal(data.registro);
    } catch (error) {
        exibirErroAnimal(alertBox, error.message || 'Erro ao carregar animais.');
        inicializarTabelaAnimal([]);
    }
}

function inicializarTabelaAnimal(animal) {
    new DataTable('#tblAnimal', {
        data: animal,
        columns: [
            { data: 'animalid', defaultContent: '' },
            { data: 'nome', defaultContent: '' },
            { data: 'datanasc', defaultContent: '' },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, row) {
                    if (type !== 'display') {
                        return '';
                    }

                    var idAnimal = escaparHtmlAnimal(row.animalid || '');

                    return [
                        '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes do Animal">',
                        '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-id-animal="' + idAnimal + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></button>',
                        '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-id-animal="' + idAnimal + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></button>',
                        '<button class="btn btn-outline-danger" type="button" data-action="remover" data-id-animal="' + idAnimal + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></button>',
                        '</div>'
                    ].join('');
                }
            }
        ],
        language: {
            emptyTable: 'Nenhum animal cadastrado.',
            info: 'Mostrando _START_ até _END_ de _TOTAL_ registros',
            infoEmpty: 'Mostrando 0 até 0 de 0 registros',
            infoFiltered: '(filtrado de _MAX_ registros no total)',
            lengthMenu: 'Mostrar _MENU_ registros',
            loadingRecords: 'Carregando...',
            processing: 'Processando...',
            search: 'Pesquisar:',
            zeroRecords: 'Nenhum registro encontrado',
            paginate: {
                first: 'Primeiro',
                last: 'Último',
                next: 'Próximo',
                previous: 'Anterior'
            }
        }
    });
}

function configurarOperacoesAnimal(alertBox) {
    var tabela = document.getElementById('tblAnimal');

    if (!tabela) {
        return;
    }

    tabela.addEventListener('click', function(event) {
        var botao = event.target.closest('button[data-action][data-id-animal]');

        if (!botao) {
            return;
        }

        var action = botao.dataset.action;
        var idAnimal = botao.dataset.idAnimal;

        if (action === 'visualizar') {
            window.location.href = '/animal/form?oper=Re&idAnimal=' + encodeURIComponent(idAnimal);
            return;
        }

        if (action === 'atualizar') {
            window.location.href = '/animal/form?oper=Up&idAnimal=' + encodeURIComponent(idAnimal);
            return;
        }

        if (action === 'remover') {
            window.location.href = '/animal/form?oper=De&idAnimal=' + encodeURIComponent(idAnimal);
        }
    });
}

function escaparHtmlAnimal(valor) {
    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function exibirErroAnimal(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }

    alertBox.textContent = mensagem;
    alertBox.classList.add('alert-danger');
    alertBox.classList.remove('d-none');
}
