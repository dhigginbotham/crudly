var express = require('express'),
    app = express(),
    server = require('http').createServer(app);

app.set('port', 1338);
app.use(express.json());
app.use(express.urlencoded());

var Crudly = require('../lib'),
    Comm = require('./lib/comm');

var opts = {
  model: Comm
};

var crudly = new Crudly(opts);

server.listen(app.get('port'), function () {
  console.log('listening on port ' + app.get('port'));
});