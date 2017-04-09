const express = require('express');
const router = express.Router();
const compose = require('composable-middleware');

var controller = require('./user.controller');

var auth = require('../user/auth.service');

router.get('/all', compose()
    .use(auth.authentication)
    .use(auth.hasRole('admin')),
    controller.getAll);

router.get('/:username', compose()
    .use(auth.authentication)
    .use(auth.hasRole('admin')),
    controller.getUserByUsername);

router.post('/sida', controller.sida);

router.post('/create', compose()
    .use(auth.authentication)
    .use(auth.hasRole('admin')), 
    controller.create);

router.post('/login', controller.login);

router.put('/edit', compose()
    .use(auth.authentication)
    .use(auth.hasRole('admin')),
    controller.edit);

router.delete('/delete/:username', compose()
    .use(auth.authentication)
    .use(auth.hasRole('admin')),
    controller.delete);

module.exports = router;