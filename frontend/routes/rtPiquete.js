var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('piquete/vwLstPiquete', {
        title: 'Piquete',
        showNavbar: true,
        activeMenu: 'Piquete',
        servidorTrabalho: process.env.SERVIDOR_DW3
    });
});

router.get('/form', function(req, res) {
    res.render('piquete/vwFormPiquete', {
        title: 'Formulário de piquetes',
        showNavbar: true,
        activeMenu: 'Piquete',
        servidorTrabalho: process.env.SERVIDOR_DW3
    });
});

module.exports = router;
