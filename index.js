const express = require('express');

const apiRoutes = require('./routes/api');
const htmlRoutes = require('./routes/html');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.listen(port, () => {
  console.info(`listening on port ${port}...`);
});
