document.addEventListener('DOMContentLoaded', function() {
    if (!dw3IsLogged()) {
        return;
    }

    var listagem = document.getElementById('pastoListagem');
    var alertBox = document.getElementById('pastoAlert');

    if (!listagem) {
        return;
    }

    var servidorDw3 = listagem.dataset.servidorDw3;

    configurarOperacoesPasto(alertBox);
    carregarPasto(servidorDw3, alertBox);
});

async function carregarPasto(servidorDw3, alertBox) {
    try {
        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var token = localStorage.getItem('jwt') || localStorage.getItem('token');

        var response = await fetch(servidorDw3 + '/getAllPasto', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar a lista de pastos.');
        }

        var data = await response.json();

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        inicializarTabelaPasto(data.registro);
    } catch (error) {
        exibirErro(alertBox, error.message || 'Erro ao carregar pastos.');
        inicializarTabelaPasto([]);
    }
}

function inicializarTabelaPasto(pasto) {
    new DataTable('#tblPasto', {
        data: pasto,
        columns: [
            { data: 'idpasto', defaultContent: '' },
            { data: 'nomepasto', defaultContent: '' },
            { data: 'areatotal', defaultContent: '' },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, row) {
                    if (type !== 'display') {
                        return '';
                    }

                    var idPasto = escaparHtml(row.idpasto || '');

                    return [
                        '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes do Pasto">',
                        '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-id-pasto="' + idPasto + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></button>',
                        '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-id-pasto="' + idPasto + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></button>',
                        '<button class="btn btn-outline-danger" type="button" data-action="remover" data-id-pasto="' + idPasto + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></button>',
                        '</div>'
                    ].join('');
                }
            }
        ],
        language: {
            emptyTable: 'Nenhum pasto cadastrado.',
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

function configurarOperacoesPasto(alertBox) {
    var tabela = document.getElementById('tblPasto');

    if (!tabela) {
        return;
    }

    tabela.addEventListener('click', function(event) {
        var botao = event.target.closest('button[data-action][data-id-pasto]');

        if (!botao) {
            return;
        }

        var action = botao.dataset.action;
        var idPasto = botao.dataset.idPasto;

        if (action === 'visualizar') {
            window.location.href = '/pasto/form?oper=Re&idPasto=' + encodeURIComponent(idPasto);
            return;
        }

        if (action === 'atualizar') {
            window.location.href = '/pasto/form?oper=Up&idPasto=' + encodeURIComponent(idPasto);
            return;
        }

        if (action === 'remover') {
            window.location.href = '/pasto/form?oper=De&idPasto=' + encodeURIComponent(idPasto);
        }
    });
}

function exibirAviso(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }

    alertBox.textContent = mensagem;
    alertBox.classList.remove('alert-danger');
    alertBox.classList.add('alert-info');
    alertBox.classList.remove('d-none');
}

function escaparHtml(valor) {
    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function exibirErro(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }

    alertBox.textContent = mensagem;
    alertBox.classList.remove('alert-info');
    alertBox.classList.add('alert-danger');
    alertBox.classList.remove('d-none');
}