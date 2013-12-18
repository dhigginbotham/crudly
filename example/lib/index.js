var mongoose = require('mongoose'),
    cfg = require('./db.json'),
    format = require('util').format;

mongoose.set('debug', cfg.db.debug);

var connection = format('mongodb://%s:%d/%s', cfg.db.host, cfg.db.port, cfg.db.model),
    db = mongoose.createConnection(connection, cfg.db.options);

module.exports = db;