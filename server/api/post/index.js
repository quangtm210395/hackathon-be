const express = require('express');
const router = express.Router();
const compose = require('composable-middleware');

var controller = require('./post.controller');

var auth = require('../user/auth.service');

router.get('/all', controller.getAll);

router.get('/id/:id', compose()
    .use(auth.authentication)
    .use(auth.hasRole('user')),
    controller.getPost);

router.get('/:index', compose()
    .use(auth.authentication)
    .use(auth.hasRole('user')),
    controller.getPostsByIndex);

router.post('/create', compose()
    .use(auth.authentication)
    .use(auth.hasRole('user')), 
    controller.create);

router.post('/sida', controller.sida);

router.put('/like/:id', compose()
    .use(auth.authentication)
    .use(auth.hasRole('user')),
    controller.like);

router.put('/unlike/:id', compose()
    .use(auth.authentication)
    .use(auth.hasRole('user')),
    controller.unlike);

router.put('/edit/:id', compose()
    .use(auth.authentication)
    .use(auth.hasRole('user'))
    .use(auth.hasPer('post')),
    controller.edit);

router.delete('/delete/:id', compose()
    .use(auth.authentication)
    .use(auth.hasRole('user'))
    .use(auth.hasPer('post')),
    controller.delete);

module.exports = router;