const express = require('express');
const router = express.Router();
const compose = require('composable-middleware');

var controller = require('./category.controller');

var auth = require('../user/auth.service');

router.get('/all', controller.getAll);

router.post('/create', compose()
    .use(auth.authentication)
    .use(auth.hasRole('admin')),
    controller.create);

router.post('/sida', controller.sida);

module.exports = router;