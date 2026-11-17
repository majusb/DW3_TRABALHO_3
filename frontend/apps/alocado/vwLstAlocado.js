document.addEventListener('DOMContentLoaded', function() {
    if (!dw3IsLogged()) {
        return;
    }

    var listagem = document.getElementById('alocadoListagem');
    var alertBox = document.getElementById('alocadoAlert');

    if (!listagem) {
        return;
    }

    var servidorDw3 = listagem.dataset.servidorDw3;

    configurarOperacoesAlocado(alertBox);
    carregarAlocado(servidorDw3, alertBox);
});

async function carregarAlocado(servidorDw3, alertBox) {
    try {
        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var alocados = await buscarListaAlocado(servidorDw3, '/getAllAlocado');

        // animal e piquete servem só para mostrar o nome no lugar do id
        var mapaAnimal = {};
        try {
            var animais = await buscarListaAlocado(servidorDw3, '/getAllAnimal');
            animais.forEach(function(a) {
                mapaAnimal[a.animalid] = a.nome;
            });
        } catch (e) {
            console.error('Não foi possível carregar os animais.', e);
        }

        var mapaPiquete = {};
        try {
            var piquetes = await buscarListaAlocado(servidorDw3, '/getAllPiquete');
            piquetes.forEach(function(p) {
                mapaPiquete[p.piqueteid] = p.descricao;
            });
        } catch (e) {
            console.error('Não foi possível carregar os piquetes.', e);
        }

        inicializarTabelaAlocado(alocados, mapaAnimal, mapaPiquete);
    } catch (error) {
        exibirErroAlocado(alertBox, error.message || 'Erro ao carregar alocados.');
        inicializarTabelaAlocado([], {}, {});
    }
}

async function buscarListaAlocado(servidorDw3, rota) {
    var token = localStorage.getItem('token');

    var response = await fetch(servidorDw3 + rota, {
        method: 'GET',
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

function inicializarTabelaAlocado(alocados, mapaAnimal, mapaPiquete) {
    new DataTable('#tblAlocado', {
        data: alocados,
        columns: [
            { data: 'alocadoid', defaultContent: '' },
            {
                data: 'animalidifk',
                render: function(data) {
                    return escaparHtmlAlocado(mapaAnimal[data] || ('#' + data));
                }
            },
            {
                data: 'piqueteidfk',
                render: function(data) {
                    return escaparHtmlAlocado(mapaPiquete[data] || ('#' + data));
                }
            },
            { data: 'datainicio', defaultContent: '' },
            { data: 'datafinal', defaultContent: '' },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, row) {
                    if (type !== 'display') {
                        return '';
                    }

                    var idAlocado = escaparHtmlAlocado(row.alocadoid || '');

                    return [
                        '<div class="btn-group btn-group-sm" role="group">',
                        '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-id-alocado="' + idAlocado + '" title="Visualizar"><i class="bi bi-eye"></i></button>',
                        '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-id-alocado="' + idAlocado + '" title="Atualizar"><i class="bi bi-pencil-square"></i></button>',
                        '<button class="btn btn-outline-danger" type="button" data-action="remover" data-id-alocado="' + idAlocado + '" title="Remover"><i class="bi bi-trash"></i></button>',
                        '</div>'
                    ].join('');
                }
            }
        ],
        language: {
            emptyTable: 'Nenhuma alocação cadastrada.',
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

function configurarOperacoesAlocado(alertBox) {
    var tabela = document.getElementById('tblAlocado');

    if (!tabela) {
        return;
    }

    tabela.addEventListener('click', function(event) {
        var botao = event.target.closest('button[data-action][data-id-alocado]');

        if (!botao) {
            return;
        }

        var action = botao.dataset.action;
        var idAlocado = botao.dataset.idAlocado;

        if (action === 'visualizar') {
            window.location.href = '/alocado/form?oper=Re&idAlocado=' + encodeURIComponent(idAlocado);
            return;
        }

        if (action === 'atualizar') {
            window.location.href = '/alocado/form?oper=Up&idAlocado=' + encodeURIComponent(idAlocado);
            return;
        }

        if (action === 'remover') {
            window.location.href = '/alocado/form?oper=De&idAlocado=' + encodeURIComponent(idAlocado);
        }
    });
}

function escaparHtmlAlocado(valor) {
    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function exibirErroAlocado(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }

    alertBox.textContent = mensagem;
    alertBox.classList.add('alert-danger');
    alertBox.classList.remove('d-none');
}
