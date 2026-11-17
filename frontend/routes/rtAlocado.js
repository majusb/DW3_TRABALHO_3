// Conteúdo do arquivo routes/rtAlocado.js
var express = require('express');
var router = express.Router();

//-- /alocado -> a tela da tabela
router.get('/', function(req, res) {
    res.render('alocado/vwLstAlocado', {
        title: 'Alocação',
        showNavbar: true,
        activeMenu: 'Alocado',
        servidorTrabalho: process.env.SERVIDOR_DW3
    });
});

//-- /alocado/form -> a tela de cadastro
router.get('/form', function(req, res) {
    res.render('alocado/vwFormAlocado', {
        title: 'Formulário de alocações',
        showNavbar: true,
        activeMenu: 'Alocado',
        servidorTrabalho: process.env.SERVIDOR_DW3
    });
});

module.exports = router;
