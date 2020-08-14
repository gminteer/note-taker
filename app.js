const express = require('express');
const path = require('path');

const app = express();

const Notes = require('./lib/notes');
const PersistentArray = require('./lib/persistent-array');
const notes = new Notes(PersistentArray.build(path.join(__dirname, './db/db.json')));

const apiRoutes = require('./routes/api')(notes);
const htmlRoutes = require('./routes/html');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

module.exports = app;
