var express = require('express'),
    app = express(),
    server = require('http').createServer(app);

app.set('port', 1338);
app.set('x-powered-by', false);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());

var Crudly = require('../lib'),
    Comm = require('./lib/comm');

var opts = {
  model: Comm
};

var crudly = new Crudly(opts);

crudly.mount(app);

server.listen(app.get('port'), function () {
  console.log('listening on port ' + app.get('port'));
});