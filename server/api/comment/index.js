const express = require('express');
const router = express.Router();
const compose = require('composable-middleware');

var controller = require('./comment.controller');

var auth = require('../user/auth.service');

router.get('/all', controller.getAll);

router.post('/create/:id', compose()
    .use(auth.authentication)
    .use(auth.hasRole('user')),
    controller.create);

router.put('/edit/:id', compose()
    .use(auth.authentication)
    .use(auth.hasRole('user'))
    .use(auth.hasPer('comment')),
    controller.edit);

router.delete('/delete/:id', compose()
    .use(auth.authentication)
    .use(auth.hasRole('user'))
    .use(auth.hasPer('comment')),
    controller.delete);

module.exports = router;