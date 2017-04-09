const express = require('express');
const config = require('./configs');
const mongoose = require('mongoose');

const app = express();
config.settingExpress(app);

const routes = require('./routes')(app);

mongoose.connect(config.mongoUrl, { server: { reconnectTries: Number.MAX_VALUE } });


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Mongodb connected at localhost/web5')
});

const port = config.port;

app.listen(port, () => {
    console.log(`Server is running at localhost:${port}`);
})