// Conteúdo do arquivo routes/rtAnimal.js
var express = require('express');
var router = express.Router();

//-- /animal -> a tela da tabela
router.get('/', function(req, res) {
    res.render('animal/vwLstAnimal', {
        title: 'Animal',
        showNavbar: true,
        activeMenu: 'Animal',
        servidorTrabalho: process.env.SERVIDOR_DW3 // É necessário, pois o front em html não tem acesso ao .env
    });
});

//-- /animal/form -> a tela de cadastro
router.get('/form', function(req, res) {
    res.render('animal/vwFormAnimal', {
        title: 'Formulário de animais',
        showNavbar: true,
        activeMenu: 'Animal',
        servidorTrabalho: process.env.SERVIDOR_DW3
    });
});

module.exports = router;
