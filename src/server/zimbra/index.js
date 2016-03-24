var request = require('request');
var js2xmlparser = require('js2xmlparser');
var ERR_UNKNOWN = "UNKNOWN";
var USER_AGENT = "zimbrasoap";
var xml2js = require('xml2js').parseString;
var processors = require('xml2js/lib/processors');
var parser_opts = {
                    tagNameProcessors: [processors.stripPrefix],
                    normalizeTags: true,
                    explicitArray: false
                };

function callZimbraAPI(hostName, requestObject, authToken, cb){
    var soapURL = getURL(hostName);
    var req = makeSOAP(requestObject, authToken);
    console.log(req);
        request({
            method: "POST",
            uri: soapURL,
            headers: {
                "Content-Type": "application/soap+xml; charset=utf-8"
            },
            body: req,
            strictSSL: false,
            jar: false,
            //timeout: 10000 when you call url of rss/atom feed it will take dynamic time
        },
        function(err, resp, body) {
            if(err != null) {
                return cb(err, null);
            } else {
                return xml2js(body, parser_opts, function(err, res) {
                    if (!err && res.envelope.body) {
                        return cb(null, res.envelope.body);
                    }else if(!err) {
                        return cb(err, res);
                    }
                    else {
                        return cb(err, null);
                    }
                });
            }
        });
}

function getAccountInfo(hostName, authToken, cb) {

    var requestObject = {
        "GetAccountInfoRequest": {
            "@": {
                "xmlns": "urn:zimbraAccount"

            },
            account: {'@':
                {'by': 'name' },
                '#': 'dhavald'

            }
        }
    };

    callZimbraAPI(hostName, requestObject, authToken, cb);
}

function getContacts(hostName, authToken, cb) {
    var soapURL = getURL(hostName);
    var requestObject = {
        "GetContactsRequest": {
            "@": {
                "xmlns": "urn:zimbraMail"

            }
        }
    };

    callZimbraAPI(hostName, requestObject, authToken, cb);
}

function getTag(hostName, authToken, cb) {
    var soapURL = getURL(hostName);
    var requestObject = {
        "GetTagRequest": {
            "@": {
                "xmlns": "urn:zimbraMail"

            }
        }
    };

    callZimbraAPI(hostName, requestObject, authToken, cb);
}

function getAuthToken(hostName, username, password, cb) {
    var soapURL = getURL(hostName);
    var authRequestObject = {
        "AuthRequest": {
            "@": {
                "xmlns": "urn:zimbraAccount"
            },
            account: username,
            password: password
        }
    };

    var req = makeSOAP(authRequestObject);
        request({
            method: "POST",
            uri: soapURL,
            headers: {
                "Content-Type": "application/soap+xml; charset=utf-8"
            },
            body: req,
            strictSSL: false,
            jar: false,
            timeout: 10000
        },
        function(err,resp,body) {
            if(err != null) {
                return cb(err, null);
            } else {
                var parser_opts = {
                    tagNameProcessors: [processors.stripPrefix],
                    normalizeTags: true,
                    explicitArray: false
                };

                return xml2js(body, parser_opts, function(err, res) {
                  if (!err) {
                    return cb(null, res.envelope.body);
                  } else {
                    return cb(err, null);
                  }
                });
            }

        });
}


function getURL(hostName) {
    return "https://" + hostName + "/service/soap";
}

function makeSOAP(body, authToken) {
      var data;
      data = {
        "@": {
          "xmlns:soap": "http://www.w3.org/2003/05/soap-envelope",
          "xmlns:zadmin": "urn:zimbraAdmin",
          "xmlns:zaccount": "urn:zimbraAccount",
          "xmlns:zmail": "urn:zimbraMail",
          "xmlns:zsync": "urn:zimbraSync",
          "xmlns:zvoice": "urn:zimbraVoice",
          "xmlns:zrepl": "urn:zimbraRepl"
        },
        "soap:Header": {
          "context": {
            "@": {
              "xmlns": "urn:zimbra"
            },
            "authToken": authToken
          }
        },
        "soap:Body": body
      };
      return js2xmlparser("soap:Envelope", data);
}


/**
 * All module exports are declared below this line
 */
exports.getAuthToken = getAuthToken;
exports.getContacts = getContacts;
exports.getTag = getTag;
exports.getAccountInfo = getAccountInfo;
exports.callZimbraAPI = callZimbraAPI;
