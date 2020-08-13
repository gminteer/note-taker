const express = require('express');

const {router: apiRoutes, isReady} = require('./routes/api');
const htmlRoutes = require('./routes/html');

const app = express();
app.isReady = isReady;
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

module.exports = app;
