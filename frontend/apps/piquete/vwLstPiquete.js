document.addEventListener('DOMContentLoaded', function() {
    if (!dw3IsLogged()) {
        return;
    }

    var listagem = document.getElementById('piqueteListagem');
    var alertBox = document.getElementById('piqueteAlert');

    if (!listagem) {
        return;
    }

    var servidorDw3 = listagem.dataset.servidorDw3;

    configurarOperacoesPiquete(alertBox);
    carregarPiquete(servidorDw3, alertBox);
});

async function carregarPiquete(servidorDw3, alertBox) {
    try {
        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var token = localStorage.getItem('jwt') || localStorage.getItem('token');

        var response = await fetch(servidorDw3 + '/getAllPiquetes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar a lista de piquetes.');
        }

        var data = await response.json();

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        inicializarTabelaPiquete(data.registro);
    } catch (error) {
        exibirErro(alertBox, error.message || 'Erro ao carregar piquetes.');
        inicializarTabelaPiquete([]);
    }
}

function inicializarTabelaPiquete(piquete) {
    new DataTable('#tblPiquete', {
        data: piquete,
        columns: [
            { data: 'piqueteid', defaultContent: '' },
            { data: 'descricao', defaultContent: '' },
            { data: 'latitude', defaultContent: '' },
            { data: 'longitude', defaultContent: '' },
            { data: 'pastoidfk', defaultContent: '' },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, row) {
                    if (type !== 'display') {
                        return '';
                    }

                    var idPiquete = escaparHtml(row.piqueteid || '');

                    return [
                        '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes do Piquete">',
                        '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-id-piquete="' + idPiquete + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></button>',
                        '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-id-piquete="' + idPiquete + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></button>',
                        '<button class="btn btn-outline-danger" type="button" data-action="remover" data-id-piquete="' + idPiquete + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></button>',
                        '</div>'
                    ].join('');
                }
            }
        ],
        language: {
            emptyTable: 'Nenhum piquete cadastrado.',
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

function configurarOperacoesPiquete(alertBox) {
    var tabela = document.getElementById('tblPiquete');

    if (!tabela) {
        return;
    }

    tabela.addEventListener('click', function(event) {
        var botao = event.target.closest('button[data-action][data-id-piquete]');

        if (!botao) {
            return;
        }

        var action = botao.dataset.action;
        var idPiquete = botao.dataset.idPiquete;

        if (action === 'visualizar') {
            window.location.href = '/piquete/form?oper=Re&idPiquete=' + encodeURIComponent(idPiquete);
            return;
        }

        if (action === 'atualizar') {
            window.location.href = '/piquete/form?oper=Up&idPiquete=' + encodeURIComponent(idPiquete);
            return;
        }

        if (action === 'remover') {
            window.location.href = '/piquete/form?oper=De&idPiquete=' + encodeURIComponent(idPiquete);
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