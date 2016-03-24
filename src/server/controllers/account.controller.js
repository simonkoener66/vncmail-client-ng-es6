var zimbra = require('../zimbra');
var cfg = require('../config');
var util = require('util');
var fs = require('fs');

exports.getAuthToken = function(req, res, next){
	// username: dhavald@zuxfdev.vnc.biz
	// password: 123456
	if (req.body.username && req.body.password){
		zimbra.getAuthToken(cfg.zimbraDomain, req.body.username.trim(), req.body.password.trim(),
			function(err, data) {
				if(err) {
					res.status(404).send(err);
				}
				else {
					if(data.fault && data.fault.reason && data.fault.reason.text){
						return res.status(400).send({'status': 'failed', 'msg': data.fault.reason.text});

					}
					else {
						var authtoken = data.authresponse.authtoken;
						var requestObject = {
							"GetInfoRequest": {
								"@": {
									"xmlns": "urn:zimbraAccount"

								}
							}
						};

						zimbra.callZimbraAPI(cfg.zimbraDomain, requestObject, authtoken,
							function(err, data) {
								if(err) {
									res.status(404).send(err);
								}
								else {
									if(data.fault && data.fault.reason && data.fault.reason.text){
										return res.status(400).send({'status': 'failed', 'msg': data.fault.reason.text});
									}
									else {
										data = data.getinforesponse;
										data.authtoken = authtoken;
										return res.status(200).send(data);
									}
								}
							});
					}

				}

			});
	}
	else {
		res.status(404).send({'status': 'failed', 'msg': 'username and password are required'});
	}

};

exports.getInfo = function(req, res, next){
	var requestObject = {
		"GetInfoRequest": {
			"@": {
				"xmlns": "urn:zimbraAccount"

			}
		}
	};

	zimbra.callZimbraAPI(cfg.zimbraDomain, requestObject, req.headers.authorization,
		function(err, data) {
			if(err) {
				res.status(404).send(err);
			}
			else {
				if(data.fault && data.fault.reason && data.fault.reason.text){
					return res.status(400).send({'status': 'failed', 'msg': data.fault.reason.text});
				}
				else {
					return res.status(200).send(data.getinforesponse);
				}
			}
		});
};

exports.changePassword = function(req, res, next){
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var email = req.body.email;
    if (!util.isNullOrUndefined(oldPassword) && !util.isNullOrUndefined(newPassword) && !util.isNullOrUndefined(email)) {
		var requestObject = {
			"ChangePasswordRequest": {
				"@": {
					"xmlns": "urn:zimbraAccount"

				},
				"account": {
					"@": {
						"by": "name"
					},
					"#": email

				},
				"oldPassword": oldPassword,
				"password": newPassword //new password
			}
		};

		zimbra.callZimbraAPI(cfg.zimbraDomain, requestObject, req.headers.authorization,
			function(err, data) {
				if(err) {
					res.status(404).send(err);
				}
				else {
					if(data.fault && data.fault.reason && data.fault.reason.text){
						return res.status(400).send({'status': 'failed', 'msg': data.fault.reason.text});
					}
					else {
						return res.status(200).send(data.changepasswordresponse);
					}
				}
			});
	}
	else {
		return res.status(400).send({'status': 'failed', 'msg': 'oldPassword and newPassword are required'});
	}
};


exports.getAccountDistributionLists = function(req, res, next) {
    var ownerOf = req.body.ownerOf;
    var attrs = req.body.attrs;
    if (!util.isNullOrUndefined(attrs) && !util.isNullOrUndefined(ownerOf)) {
        var requestObject = {
            'GetAccountDistributionListsRequest': {
                '@': {
                    'xmlns': 'urn:zimbraAccount',
                    'ownerOf': ownerOf,
                    'attrs': attrs
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
                        return res.status(200).send(data.getaccountdistributionlistsresponse);
                    }
                }
            });
    } else {
        return res.status(400).send({'status': 'failed'});
    }
};



exports.getDistributionList = function(req, res, next) {
    var needOwners = req.body.needOwners; // 0|1
    var needRights = req.body.needRights; // return grants for the specified (comma-seperated) rights.
                                          //e.g. needRights="sendToDistList,viewDistList"
    var attrs = req.body.attrs ; // comma-seperated attributes to return.
    var dl = req.body.dl ; // Specify the distribution list

    var requestObject = {
        'GetDistributionListRequest': {
            '@': {
                'xmlns': 'urn:zimbraAccount'
            }
        }
    };

    if(!util.isNullOrUndefined(needOwners)){
        requestObject.GetDistributionListRequest['@'].needOwners = needOwners;
    }

    if(!util.isNullOrUndefined(needRights)){
        requestObject.GetDistributionListRequest['@'].needRights = needRights;
    }

    if(!util.isNullOrUndefined(attrs)){
        requestObject.GetDistributionListRequest.a = attrs;
    }

    if(!util.isNullOrUndefined(attrs)){
        requestObject.GetDistributionListRequest.dl = dl;
    }

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
                    return res.status(200).send(data.getdistributionlistsresponse);
                }
            }
    });
};



exports.getDistributionListMembers = function(req, res, next) {
    var limit = req.body.limit;
    var offset = req.body.offset;
    var dl = req.body.dl ; // The name of the distribution list

    if(!util.isNullOrUndefined(dl)){
        var requestObject = {
            'GetDistributionListMembersRequest': {
                '@': {
                    'xmlns': 'urn:zimbraAccount',
                    'limit': limit,
                    'offset': offset
                    },
                'dl': dl
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
                        return res.status(200).send(data.cetdistributionlistMemberseesponse);
                    }
                }
            });
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': 'The name of the distribution list is required'});
    }
};



exports.uploadAvatar = function(req, res, next) {
    var file = req.files.file;
    if (!util.isNullOrUndefined(file)) {
        var tmpPath = file.path;
        var request = require('request');
        var headers = file.headers;
        console.log(cfg.zimbraDomain);
        var r = request({
                        method: 'POST',
                        uri: 'https://' + cfg.zimbraDomain + '/service/upload?fmt=extended,raw&lbfums=',
                        strictSSL: false,
                        headers: {
                            'Cookie': 'ZM_AUTH_TOKEN=' + req.headers.authorization
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

exports.logout = function(req, res, next) {
    return res.status(200).send({'status': 'success'});

};

