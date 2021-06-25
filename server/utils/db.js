const mongoose = require('mongoose');
const yapi = require('../yapi.js');
const autoIncrement = require('./mongoose-auto-increment');

function model(model, schema) {
  if (schema instanceof mongoose.Schema === false) {
    schema = new mongoose.Schema(schema);
  }

  schema.set('autoIndex', false);

  return mongoose.model(model, schema, model);
}

function connect(callback) {
  mongoose.Promise = global.Promise;
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);

  let config = yapi.WEBCONFIG;
  let options = {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true};

  if (config.db.user) {
    options.user = config.db.user;
    options.pass = config.db.pass;
  }

  if (config.db.reconnectTries) {
    options.reconnectTries = config.db.reconnectTries;
  }

  if (config.db.reconnectInterval) {
    options.reconnectInterval = config.db.reconnectInterval;
  }


  options = Object.assign({}, options, config.db.options)

  var connectString = '';

  if(config.db.connectString){
    connectString = config.db.connectString;
  }else{
    connectString = `mongodb://${config.db.servername}:${config.db.port}/${config.db.DATABASE}`;
    if (config.db.authSource) {
      connectString = connectString + `?authSource=${config.db.authSource}`;
    }
  }

  let db = mongoose.connect(
    connectString,
    options,
    function(err) {
      if (err) {
        yapi.commons.log(err + ', mongodb Authentication failed', 'error');
      }
    }
  );

  db.then(
    function() {
      yapi.commons.log('mongodb load success...');

      if (typeof callback === 'function') {
        callback.call(db);
      }
    },
    function(err) {
      yapi.commons.log(err + 'mongodb connect error', 'error');
    }
  );

  autoIncrement.initialize(db);
  return db;
}

yapi.db = model;

module.exports = {
  model: model,
  connect: connect
};
