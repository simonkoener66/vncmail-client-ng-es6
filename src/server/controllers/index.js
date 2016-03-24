var zimbra = require('../zimbra');
var cfg = require('../config');
var account = require('./account.controller');
var zimbraMail = require('./mail.controller');
var preference = require('./preference.controller');

exports.account = account;
exports.mail = zimbraMail;
exports.preference = preference;
