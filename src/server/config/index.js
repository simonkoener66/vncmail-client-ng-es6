var env = process.env.NODE_ENV || 'development';
var resolve = require('path').resolve;

// env specific config
var cfg = require('./env/'+env);
cfg.env = env;

module.exports = cfg;
