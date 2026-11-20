var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pasto/vwLstPasto', {
        title: 'Pasto',
        showNavbar: true,
        activeMenu: 'Pasto',
        servidorTrabalho: process.env.SERVIDOR_DW3
    });
});

router.get('/form', function(req, res) {
    res.render('pasto/vwFormPasto', {
        title: 'Formulário de pastos',
        showNavbar: true,
        activeMenu: 'Pasto',
        servidorTrabalho: process.env.SERVIDOR_DW3
    });
});

module.exports = router;