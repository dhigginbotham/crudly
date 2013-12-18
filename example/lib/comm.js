var db = require('./');

var schema = require('mongoose').Schema;
var oid = schema.Types.ObjectId;

var Comms = new schema({
  body: Object,
  _extended: Object
});

var Comm = module.exports = db.model('Comm', Comms);