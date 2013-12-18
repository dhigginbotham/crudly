var _ = require('lodash');

var crudly = function (opts) {

  this.filter = [];
  
  this.key = null;

  this.methods = ['delete','get','post','put'];
  
  this.middleware = [];

  this.model = null;

  this.path = null;

  this.prefix = 'api';

  if (opts) _.merge(this, opts);

  var self = this;

  this.route = function (req, res) {
    res.json(req[self.key]);
  };

  this.router = function (req, res, next) {

    if (req.body) console.log(req.body);

    var method = req.method.toLowerCase();

    if (!~self.methods.indexOf(method)) {
      return next(JSON.stringify({error: 'Method unsupported.'}));
    };

    switch(method) {

      case 'delete':
        self.remove(req, function (err, resp) {
          if (err) return fn(err, null);
          req[self.key] = resp;
          next();
        });
      break;

      case 'post':
        self.post(req, function (err, resp) {
          if (err) return fn(err, null);
          req[self.key] = resp;
          next();
        });
      break;

      case 'put':
        self.put(req, function (err, resp) {
          if (err) return fn(err, null);
          req[self.key] = resp;
          next();
        });
      break;

      case 'get':
        self.get(req, function (err, resp) {
          if (err) return fn(err, null);
          req[self.key] = resp;
          next();
        });
      break;
    };

  };

  if (!this.path) this.path = this.model.modelName.toLowerCase();

  if (!this.key) this.key = this.path;  

  return this;

};

crudly.prototype.remove = function (req, fn) {

  var id = (req.params.id) ? {_id: req.params.id} : {};

  this.model.remove(id, function (err, docs) {

    if (err) return fn(err, null);

    return fn(null, docs);

  });

};

crudly.prototype.get = function (req, fn) {

  var id = (req.params.id) ? {_id: req.params.id} : {};

  this.model.find(id, function (err, docs) {

    if (err) return fn(err, null);

    return fn(null, docs);

  });

};

crudly.prototype.post = function (req, fn) {

  if (req.params.id) {
    
    this.update(req, function (err, docs) {

      if (err) return fn(err, null);

      return fn(null, docs);

    });

  } else {

    this.save(req, function (err, docs) {

      if (err) return fn(err, null);

      return fn(null, docs);

    });

  };

};

crudly.prototype.put = function (req, fn) {

  if (req.params.id) {
    
    this.update(req, function (err, docs) {

      if (err) return fn(err, null);

      return fn(null, docs);

    });

  } else {

    return fn(JSON.stringify({error: 'You must provide an \'/:id\' param'}), null);

  }

};

crudly.prototype.save = function (req, fn) {

  var self = this,
      newCollection = new this.model(req.body);
  
  newCollection.save(function (err, docs) {

    if (err) return fn(err, null);

    return fn(null, docs);

  });

};

crudly.prototype.update = function (req, fn) {

  var self = this,
      id = {_id: req.params.id},
      update = _.omit(req.body, '_id');

  this.model.update(id, update, {upsert: true}, function (err, docs) {

    if (err) return fn(err, null);

    var out = {
      updated: docs
    };

    _.merge(out, req.body);

    return fn(null, out);

  });

};

crudly.prototype.mount = function (app) {

  this.app = app;
  
  var uri = '/' + this.prefix + '/' + this.path + '/:id?';

  return app.all(uri, this.middleware, this.router, this.filter, this.route);

};

module.exports = crudly;