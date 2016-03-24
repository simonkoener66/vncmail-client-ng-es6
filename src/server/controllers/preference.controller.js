var zimbra = require('../zimbra');
var cfg = require('../config');
var util = require('util');
var striptags = require('striptags');
var fs = require('fs');


/**
 * Import Contacts
 */
exports.importContacts = function(req, res, next) {

    if (!util.isNullOrUndefined(req.files)) {
        var destination = req.body.destination || 'Contacts';
        var email = req.body.email || '';
        var file = req.files.file;
        var tmpPath = file.path;
        var request = require('request');
        var headers = file.headers;
        console.log('uri', cfg.zimbraDomain + '/home/' + encodeURIComponent(email) + '/' + destination + '?fmt=csv&callback=&charset=UTF-8');

        var r = request({
                method: 'POST',
                uri: 'https://' + cfg.zimbraDomain + '/home/' + encodeURIComponent(email) + '/' + destination + '?fmt=csv&callback=&charset=UTF-8',
                strictSSL: false,
                headers: {
                    'Cookie': 'ZM_AUTH_TOKEN=' + req.cookies.ZM_AUTH_TOKEN
                },
                jar: true,
                json: true,
                timeout: 10000
            },
            function(err, resp, body) {
                if (!err) {
                    return res.status(200).send(body);
                }
                else {
                    util.log(err);
                    return res.status(404).send(err);
                }

            });

        var form = r.form();
        form.append('file', fs.createReadStream(tmpPath), {filename: file.originalFilename});
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': 'File is required'});
    }
};


/**
 * Export Contacts
 */
exports.exportContacts = function(req, res, next) {
    var contactType = req.query.contactType || 'Emailed%20Contacts';
    var format = req.query.format || 'outlook-2003-csv';
    var email = req.query.email;
    var filename = req.query.filename;
    var request = require('request');
    if (!util.isNullOrUndefined(req.cookies) && !util.isNullOrUndefined(req.cookies.ZM_AUTH_TOKEN)) {
        request({
                method: 'GET',
                uri: 'https://' + cfg.zimbraDomain + '/home/'  + req.cookies.email + '/' + contactType + '?fmt=csv&csvfmt=' + format + '&filename=' + filename + '&emptyname=No+Data+to+Export&charset=UTF-8',
                strictSSL: false,
                headers: {
                    'Cookie': 'ZM_AUTH_TOKEN=' + req.cookies.ZM_AUTH_TOKEN
                },
                jar: true,
                json: true,
                timeout: 10000
            }).pipe(res);
    }
    else {
        return res.status(400).send({'status': 'failed'});
    }
};

exports.createSignature = function(req, res, next) {
    var name = req.body.name || '';
    var content = req.body.content || '';
    var type = req.body.type || 'text/plain';
    var requestObject = {
        'CreateSignatureRequest': {
            '@': {
                'xmlns': 'urn:zimbraAccount'
            },
            'signature': {
                '@': {
                  'name': name
                },
                'content': {
                  '@': {
                      'type': type
                  },
                  '#': content
                }
              }

        }
    };

    zimbra.callZimbraAPI(cfg.zimbraDomain, requestObject, req.headers.authorization,
        function(err, data) {
            if(err) {
                util.log(err);
                return res.status(404).send(err);
            }
            else {
                if(data.fault && data.fault.reason && data.fault.reason.text){
                    return res.status(400).send({'status': 'failed', 'msg': data.fault.reason.text});
                }
                else {
                    return res.status(200).send(data.createsignatureresponse);

                }
            }
        });
};
