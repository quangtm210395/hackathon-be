const express = require('express');
const bodyParser = require('body-parser');

module.exports = {
    port : 6969,
    mongoUrl : 'mongodb://127.0.0.1/web5',
    settingExpress : (app) => {
        app.use(bodyParser.urlencoded({ extended : false}));

        app.use(bodyParser.json());
    },
    secret: 'quangtm',
    roles : ['guess', 'user', 'admin'],
    permissions: ['view', 'edit', 'create', 'delete']
}