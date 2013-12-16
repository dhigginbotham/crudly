var express = require('express'),
    app = express();

app.set('port', 1338);
app.use(express.json());
app.use(express.urlencoded());

var Crudly = require('../lib');
