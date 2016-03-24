var zimbra = require('../zimbra');
var cfg = require('../config');
var util = require('util');
var striptags = require('striptags');
var fs = require('fs');

exports.getContacts = function(req, res, next){
    zimbra.getContacts(cfg.zimbraDomain, req.headers.authorization,
        function(err, data) {
            if(err) {
                res.status(404).send(err);
            }
            else {
                if(data.fault && data.fault.reason && data.fault.reason.text){
                    return res.status(400).send({'status': 'failed', 'msg': data.fault.reason.text});
                }
                else {
                    return res.status(200).send(data.getcontactsresponse);
                }
            }
        });
};

exports.createTag = function(req, res, next){
    // Body: {
    // "tagName": "macanhhuy"
    // }

    // Response: {
    //     "$": {
    //         "xmlns": "urn:zimbraMail"
    //     },
    //     "tag": {
    //         "$": {
    //             "name": "macanhhuy",
    //             "id": "5440"
    //         }
    //     }
    // }

    if (req.body.tagName && req.body.tagName !== '') {
        var requestObject = {
            "CreateTagRequest": {
                "@": {
                    "xmlns": "urn:zimbraMail"

                },
                "tag": {
                    "@": {
                        "name": req.body.tagName.trim()
                    }

                }
            }
        };

        if(req.body.rgb && req.body.rgb !== ''){
            requestObject.CreateTagRequest.tag['@'].rgb = req.body.rgb;
        }

        if(req.body.color && req.body.color !== ''){
            requestObject.CreateTagRequest.tag['@'].color = req.body.color;
        }

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
                        return res.status(200).send(data.createtagresponse);
                    }
                }
            });
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': 'tagName is required'});
    }
};

exports.getTag = function(req, res, next){
    zimbra.getTag(cfg.zimbraDomain, req.headers.authorization,
        function(err, data) {
            if(err) {
                res.status(404).send(err);
            }
            else {
                return res.status(200).send(data);
            }
        });
};


exports.saveDraft = function (req, res, next) {
    // {
    //   "subject":"subject 2",
    //   "emailInfo": [
    //         {"t": "t", "a": "macanhhuydn@gmail.com", "p": "Mac Anh. Huy"},
    //         {"t": "c", "a": "macanh.huy@vnc.biz", "p": "Mac Anh. Huy"},
    //         {"t": "f", "a": "macanh.huy@vnc.biz", "p": "Mac Anh. Huy"}
    //       ],
    //   "content": "mac anh huy"
    // }
    if (!util.isNullOrUndefined(req.body.subject)) {
        var info = req.body.emailInfo;
        var content = req.body.content;
        var invite = req.body.invite;
        var subject = req.body.subject;
        var idnt = req.body.idnt;
        var id = req.body.id;
        var flag = req.body.f;
        var attach = req.body.attach;
        var requestObject = {
            'SaveDraftRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail'
                },
                // Message
                'm': {
                    '@': {
                    },
                    // Mime part information
                    'mp': {
                        '@': {
                            'ct': 'multipart/alternative'
                        },
                        'mp': [
                            {
                                'ct': 'text/plan',
                                'content': striptags(content)
                            },
                            {
                                'ct': 'text/html',
                                'content': content
                            }
                        ]
                     },
                    'su': subject,
                    'attach': {}

                }
            }
        };

    if (!util.isNullOrUndefined(idnt)) {
        requestObject.SaveDraftRequest.m.idnt = idnt;
    }

    if (!util.isNullOrUndefined(attach) && util.isObject(attach)) {
        requestObject.SaveDraftRequest.m.attach = attach;
    }

    if (!util.isNullOrUndefined(id)) {
        requestObject.SaveDraftRequest.m.id = id;
    }

      if (!util.isNullOrUndefined(flag)) {
        requestObject.SaveDraftRequest.m.f = flag;
    }

    if (!util.isNullOrUndefined(info)) {
        requestObject.SaveDraftRequest.m.e = info; // Email address information
    }

    if (!util.isNullOrUndefined(invite)) {
        requestObject.SaveDraftRequest.m['@'].inv = invite; // Invite information
    }

        zimbra.callZimbraAPI(cfg.zimbraDomain, requestObject, req.headers.authorization,
            function(err, data) {
                if(err) {
                    return res.status(404).send(err);
                }
                else {
                    if(data.fault && data.fault.reason && data.fault.reason.text){
                        return res.status(400).send({'status': 'failed', 'msg': data.fault.reason.text});
                    }
                    else {
                        return res.status(200).send(data.savedraftresponse);
                    }
                }
            });
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': 'subject is required'});
    }
};
exports.autocomplete = function(req, res, next) {
    var name = req.body.name;
    var type = req.body.type;
    var requestObject = {
        'AutoCompleteRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail',
                'needExp': 1,
                'name': name
            }

        }
    };

    if (!util.isNullOrUndefined(type)) {
        requestObject.AutoCompleteRequest['@'].t = type;
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
                    if (!util.isNullOrUndefined(data.autocompleteresponse.match)) {
                        return res.status(200).send(data.autocompleteresponse.match);
                    }
                    else {
                        return res.status(200).send([]);
                    }

                }
            }
        });
};

exports.searchRequest = function(req, res, next) {
    // Raw:
    // {
    //   "offset": 0,
    //   "limit": 1,
    //   "types": "conversation",
    //   "query":"in:inbox"
    // }
    var offset = !util.isNullOrUndefined(req.body.offset) && util.isNumber(req.body.offset)?req.body.offset:0;
    var limit = !util.isNullOrUndefined(req.body.limit) && util.isNumber(req.body.limit)?req.body.limit:100;
    var sortBy = req.body.sortBy;
    var query = req.body.query;
    var types = req.body.types;
    var recip = req.body.recip;
    var fullConversation = req.body.fullConversation;
    var needExp = req.body.needExp;
    var locale = req.body.locale;
    var tz = req.body.tz;
    var cursor = req.body.cursor;
    var allowableTaskStatus = req.body.allowableTaskStatus;

    var calExpandInstStart = req.body.calExpandInstStart;
    var calExpandInstEnd = req.body.calExpandInstEnd;

    var requestObject = {
        'SearchRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail',
                'sortBy': sortBy,
                'offset': offset,
                'limit': limit,
                'types': types
            }
        }
    };

    if ( !util.isNullOrUndefined(calExpandInstStart) && !util.isNullOrUndefined(calExpandInstEnd) ) {
        requestObject.SearchRequest['@'].calExpandInstStart = calExpandInstStart;
        requestObject.SearchRequest['@'].calExpandInstEnd = calExpandInstEnd;
    }

    if ( !util.isNullOrUndefined(query) ) {
        requestObject.SearchRequest.query = query;
    }

    if ( !util.isNullOrUndefined(locale) ) {
        requestObject.SearchRequest.locale = locale;
    }

    if ( !util.isNullOrUndefined(recip) ) {
        requestObject.SearchRequest.recip = recip;
    }

    if ( !util.isNullOrUndefined(tz) ) {
        requestObject.SearchRequest.tz = tz;
    }

    if ( !util.isNullOrUndefined(cursor) ) {
        requestObject.SearchRequest.cursor = {};
        requestObject.SearchRequest.cursor['@'] = cursor;
    }

    if ( !util.isNullOrUndefined(fullConversation) ) {
        requestObject.SearchRequest.fullConversation = fullConversation;
    }

    if ( !util.isNullOrUndefined(needExp) ) {
        requestObject.SearchRequest.needExp = needExp;
    }

    if ( !util.isNullOrUndefined(allowableTaskStatus) ) {
        requestObject.SearchRequest.allowableTaskStatus = allowableTaskStatus;
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
                    return res.status(200).send(data.searchresponse);
                }
            }
        });
};

exports.getFolderList = function(req, res, next) {
    var visible = !util.isNullOrUndefined(req.body.visible)?req.body.visible:1;
    var depth = !util.isNullOrUndefined(req.body.depth)?req.body.depth:-1;
    var folder = req.body.folder;

    var requestObject = {
        'GetFolderRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail',
                'visible': visible,
                'depth': depth
            },
            'folder': {}
        }
    };

    if(!util.isNullOrUndefined(req.body.view)){
      requestObject.GetFolderRequest['@'].view = req.body.view;
    }

    if (!util.isNullOrUndefined(folder)) {
        requestObject.GetFolderRequest.folder = folder;
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
                    return res.status(200).send(data.getfolderresponse);
                }
            }
        });
};

exports.searchConvRequest = function(req, res, next) {

    var offset = !util.isNullOrUndefined(req.body.offset) && util.isNumber(req.body.offset)?req.body.offset:0;
    var limit = !util.isNullOrUndefined(req.body.limit) && util.isNumber(req.body.limit)?req.body.limit:100;
    var sortBy = req.body.sortBy;
    var query = req.body.query;
    var types = req.body.types;
    var recip = req.body.recip;
    var fullConversation = req.body.fullConversation;
    var needExp = req.body.needExp;
    var cid = req.body.cid;
    var fetch = 'u!';
    var html = 1;
    var max = 250000;
    var read = 1;

    var calExpandInstStart = req.body.calExpandInstStart;
    var calExpandInstEnd = req.body.calExpandInstEnd;

    var requestObject = {
        'SearchConvRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail',
                'sortBy': sortBy,
                'offset': offset,
                'limit': limit,
                'cid': cid,
                'fetch': fetch,
                'html': html,
                'read': read,
                'max': max
            }
        }
    };

    if ( !util.isNullOrUndefined(calExpandInstStart) && !util.isNullOrUndefined(calExpandInstEnd) ) {
        requestObject.SearchConvRequest['@'].calExpandInstStart = calExpandInstStart;
        requestObject.SearchConvRequest['@'].calExpandInstEnd = calExpandInstEnd;
    }

    if ( !util.isNullOrUndefined(query) ) {
        requestObject.SearchConvRequest.query = query;
    }

    if ( !util.isNullOrUndefined(types) ) {
        requestObject.SearchConvRequest.types = types;
    }

    if ( !util.isNullOrUndefined(recip) ) {
        requestObject.SearchConvRequest.recip = recip;
    }
    else {
        requestObject.SearchConvRequest.recip = 2;
    }

    if ( !util.isNullOrUndefined(fullConversation) ) {
        requestObject.SearchConvRequest.fullConversation = fullConversation;
    }

    if ( !util.isNullOrUndefined(needExp) ) {
        requestObject.SearchConvRequest.needExp = needExp;
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
                    return res.status(200).send(data.searchconvresponse);
                }
            }
        });
};
/**
 * The service to send an email
 *
 * @param {array} emailInfo -
 * @param {string} subject   -
 * @param {string} content  -
 * @param {object} attach  -
 */
exports.sendEmail = function(req, res, next) {
    //  Raw:
    //  {
    // "emailInfo":[
    //        {
    //           "a":"macanhhuydn@gmail.com",
    //           "t":"t"
    //        },
    //        {
    //           "a":"dhavald@zuxfdev.vnc.biz",
    //           "t":"f"
    //        },
    //        {
    //           "a":"dhavald@zuxfdev.vnc.biz",
    //           "t":"c"
    //        }
    //     ],
    //     "subject":"huy test",
    //     "content":"my content"
    //  }
    var info = req.body.emailInfo;
    var content = req.body.content;
    var invite = req.body.invite;
    var subject = req.body.subject;
    var idnt = req.body.idnt;
    var attach = req.body.attach;
    var requestObject = {
        'SendMsgRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail'
            },
            // Message
            'm': {
                '@': {
                },
                // Mime part information
                'mp': {
                    '@': {
                        'ct': 'multipart/alternative'
                    },
                    'mp': [
                        {
                            'ct': 'text/plan',
                            'content': striptags(content)
                        },
                        {
                            'ct': 'text/html',
                            'content': content
                        }
                    ]
                },
                'su': subject,
                'attach': {}

            }
        }
    };

    if (!util.isNullOrUndefined(idnt)) {
        requestObject.SendMsgRequest.m.idnt = idnt;
    }

    if (!util.isNullOrUndefined(attach) && util.isObject(attach)) {
        requestObject.SendMsgRequest.m.attach = attach;
    }

    if (!util.isNullOrUndefined(info)) {
        requestObject.SendMsgRequest.m.e = info; // Email address information
    }

    if (!util.isNullOrUndefined(invite)) {
        requestObject.SendMsgRequest.m['@'].inv = invite; // Invite information
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
                    return res.status(200).send(data.sendmsgresponse);
                }
            }
        });
};


/**
 * The service to do the GetMsgRequest from Zimbra API
 *
 * @param {string} id - Message ID. Can contain a subpart identifier (e.g. "775-778") to return a message
 stored as a subpart of some other mail-item, specifically for Messages stored as
 part of Appointments
 */
exports.getMsgRequest = function(req, res, next) {
    var id = req.body.id;
    var needExp = 1;
    var html = 1;
    var max = 250000;

    var requestObject = {
        'GetMsgRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail'
            },
            'm': {
                '@': {
                    'id': id,
                    'html': html,
                    'max': max,
                    'needExp': needExp
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
                    return res.status(200).send(data.getmsgresponse);
                }
            }
        });
};

exports.contactAction = function(req, res, next) {
    var id = req.body.id;
    var op = req.body.op;
    var l = req.body.folderId;
    var tn = req.body.tn;

    var requestObject = {
        'ContactActionRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail'
            },
            // Message
            'action': {
                '@': {
                    'id': id,
                    'op': op
                }
            }
        }
    };

    if (!util.isNullOrUndefined(tn)) {
        requestObject.ContactActionRequest.action['@'].tn = tn;
    }

    if (!util.isNullOrUndefined(l)) {
      requestObject.ContactActionRequest.action['@'].l = l;
    }

    zimbra.callZimbraAPI(cfg.zimbraDomain, requestObject, req.headers.authorization,
        function(err, data) {
            if(err) {
                util.log(err);
                return res.status(404).send(err);
            }
            else {
                if(data.fault && data.fault.reason && data.fault.reason.text){
                    return res.status(400).send({'status': 'failed', 'msg': data.fault.reason.text });
                }
                else {
                    return res.status(200).send(data.contactactionresponse);
                }
            }
        });
};


exports.createFolder = function(req, res, next) {
    var color = req.body.color;
    var f = req.body.f || '#';
    var name = req.body.name;
    var view = req.body.view; // conversation|message|contact|etc
    var l = req.body.folderId || 10; // If "l" is unset, name is the full path of the new folder
    var url = req.body.url || null; // If "atom/rss" is unset, nothing to set for this
    var requestObject = {
        'CreateFolderRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail'
            },
            'folder': {
                '@': {
                    'color': color,
                    'name': name,
                    'l': l,
                    'f': f,
                    'view': view,
                    'url': url
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
                    return res.status(200).send(data.createfolderresponse);
                }
            }
        });
};

/** Create Contact
 *
 * @param {object} request
 * @param {number} request.folderId
 * @param {object} request.contactAttrs
 *
 */
exports.createContact = function(req, res, next) {
    //{
    //   "folderId":7,
    //   "contactAttrs":[
    //      {
    //         "key":"firstName",
    //         "value":"Mac"
    //      },
    //      {
    //         "key":"fullName",
    //         "value":"Mac Anh Huy"
    //      }
    //   ]
    //}
    var folderId = req.body.folderId;
    var contactAttrs = req.body.contactAttrs;
    var attr_list = [];
    for (var i = 0; i < contactAttrs.length; i++) {
        var attrs = contactAttrs[i];
        attr_list.push({
                        '@': {'n': attrs.key},
                        '#': attrs.value
                    });
    }
    var requestObject = {
        'CreateContactRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail'
            },
            'cn': {
                '@': {
                    'l': folderId
                },
                'a': attr_list,
                'm': []
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
                    return res.status(200).send(data.createcontactresponse);
                }
            }
        });
};

/** Modify Contact
 *
 * @param {object} request
 * @param {number} request.id
 * @param {object} request.contactAttrs
 *
 */
exports.modifyContact = function(req, res, next) {
    //{
    //   "id":7,
    //   "contactAttrs":[
    //      {
    //         "key":"firstName",
    //         "value":"Mac"
    //      },
    //      {
    //         "key":"fullName",
    //         "value":"Mac Anh Huy"
    //      }
    //   ]
    //}
    var id = req.body.id;
    var contactAttrs = req.body.contactAttrs;
    var attr_list = [];
    for (var i = 0; i < contactAttrs.length; i++) {
        var attrs = contactAttrs[i];
        attr_list.push({
                        '@': {'n': attrs.key},
                        '#': attrs.value
                    });
    }
    var requestObject = {
        'ModifyContactRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail'
            },
            'force': 1,
            'replace': 0,
            'cn': {
                'id': id,
                'a': attr_list,
                'm': []
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
                    return res.status(200).send(data.modifycontactresponse);
                }
            }
        });
};

/**
 * The service to call MsgAction request from Zimbra
 * @param {object} req      - Request
 * @param {string} req.id   - Comma separated list of item IDs to act on. Required except for TagActionRequest,
 *                         where the tags items can be specified using their tag names as an alternative.
 * @param {string} req.op   - Operation
 *                        For ItemAction - delete|dumpsterdelete|recover|read|flag|priority|tag|move|trash|rename
 *                        update|color|lock|unlock
 *                        For MsgAction - delete|read|flag|tag|move|update|spam|trash
 *                        For ConvAction - delete|read|flag|priority|tag|move|spam|trash
 *                        For FolderAction - read|delete|rename|move|trash|empty|color|[!]grant
 *                        revokeorphangrants|url|import
 *                        sync|fb|[!]check|update|[!]syncon|retentionpolicy|[!]disableactivesync|webofflinesyncdays
 *                        For TagAction - read|rename|color|delete|update|retentionpolicy
 *                        For ContactAction - move|delete|flag|trash|tag|update
 */
exports.messageAction = function(req, res, next) {
    var id = req.body.id;
    var op = req.body.op;
    var tn = req.body.tn;
    var l = req.body.l;

    if ( !util.isNullOrUndefined(id) && !util.isNullOrUndefined(op) ) {
        var requestObject = {
            'MsgActionRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail'
                },
                'action': {
                    'id': id,
                    'op': op
                }

            }
        };

        if (!util.isNullOrUndefined(tn)) {
            requestObject.MsgActionRequest.action.tn = tn;
        }

        if (!util.isNullOrUndefined(l)) {
            requestObject.MsgActionRequest.action.l = l;
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
                        return res.status(200).send(data.msgactionresponse);
                    }
                }
            });
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': 'id and op are required'});
    }
};

/**
 * Folder Action
 * @param {object} req      - Request
 * @param {string} req.id   - Comma separated list of item IDs to act on. Required except for TagActionRequest,
 */
exports.folderAction = function(req, res, next) {
    var id = req.body.id;
    var op = req.body.op;
    var name = req.body.name;
    var color = req.body.color;
    var l = req.body.l;
    var recursive = req.body.recursive;
    var emailInfo = req.body.emailInfo;
    var gt = req.body.gt;
    var d = req.body.d;
    var zid = req.body.zid;
    var perm = req.body.perm;
    var excludeFreeBusy = req.body.excludeFreeBusy;

    if ( !util.isNullOrUndefined(id) && !util.isNullOrUndefined(op) ) {
        var requestObject = {
            'FolderActionRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail'
                },
                'action': {
                    'id': id,
                    'zid': zid,
                    'op': op,
                    'grant': {
                      'gt': gt,
                      'd': d,
                      'perm': perm
                    }
                },
            }
        };

        if (!util.isNullOrUndefined(name)) {
            requestObject.FolderActionRequest.action.name = name;
        }

        if (!util.isNullOrUndefined(color)) {
            requestObject.FolderActionRequest.action.color = color;
        }

        if (!util.isNullOrUndefined(l)) {
            requestObject.FolderActionRequest.action.l = l;
        }

        if (!util.isNullOrUndefined(recursive)) {
          requestObject.FolderActionRequest.action.recursive = recursive;
        }

        if (!util.isNullOrUndefined(excludeFreeBusy)) {
            requestObject.FolderActionRequest.action.excludeFreeBusy = excludeFreeBusy;
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
                        return res.status(200).send(data.folderactionresponse);
                    }
                }
            });
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': 'id and op are required'});
    }
};

/**
 * Tag Action
 * @param {object} req      - Request
 * @param {string} req.id   - Comma separated list of item IDs to act on. Required except for TagActionRequest,
 * @param {string} req.name   - Name that have to replace. Required except for TagActionRequest,
 */
exports.tagAction = function(req, res, next) {
    var id = req.body.id;
    var op = req.body.op;
    var name = req.body.name;
    var color = req.body.color;
    var rgb = req.body.rgb;

    if ( !util.isNullOrUndefined(id) && !util.isNullOrUndefined(op) ) {
        var requestObject = {
            'TagActionRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail'
                },
                'action': {
                    'id': id,
                    'op': op
                }

            }
        };

      if (!util.isNullOrUndefined(name)) {
        requestObject.TagActionRequest.action.name = name;
      }

      if (!util.isNullOrUndefined(color)) {
        requestObject.TagActionRequest.action.color = color;
      }

      if (!util.isNullOrUndefined(rgb)) {
        requestObject.TagActionRequest.action.rgb = rgb;
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
                        return res.status(200).send(data.tagactionresponse);
                    }
                }
            });
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': 'id and op are required'});
    }
};

/**
 * Get Attachment by aid
 */
exports.getAttachment = function(req, res, next) {
    var id = req.query.id;
    var part = req.query.part;
    var disp = req.query.disp;
    var uri = 'https://' + cfg.zimbraDomain + '/service/home/~/?auth=co&loc=en_US&id=' + id + '&part=' + part;
    disp && (uri += ('&disp=' + disp));
    var request = require('request');
    if (!util.isNullOrUndefined(req.cookies) && !util.isNullOrUndefined(req.cookies.ZM_AUTH_TOKEN)) {

        request({
                method: 'GET',
                uri: uri,
                //uri: 'https://' + cfg.zimbraDomain + '/service/content/proxy?aid=' + aid,
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



/**
 * Get User Avatar
 */
exports.getAvatar = function(req, res, next) {
    var user_id = req.query.user_id;
    var request = require('request');
    if (!util.isNullOrUndefined(req.cookies) && !util.isNullOrUndefined(req.cookies.ZM_AUTH_TOKEN)) {
        request({
            method: 'GET',
            uri: 'https://' + cfg.zimbraDomain + '/service/home/~/?id=' + user_id + '&part=1&max_width=48&max_height=48',
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


exports.noOp = function(req, res, next) {

    var requestObject = {
        'NoOpRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail'
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
                    return res.status(200).send(data.noopresponse);
                }
            }
        });
};

exports.getItem = function(req, res, next) {

    var requestObject = {
        'GetItemRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail'
            },
            'item': req.body
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
                    return res.status(200).send(data.getitemresponse);
                }
            }
        });
};

exports.upload = function(req, res, next) {
    var file = req.files.file;
    if (!util.isNullOrUndefined(file)) {
        var tmpPath = file.path;
        var request = require('request');
        var headers = file.headers;
        var r = request({
                method: 'POST',
                uri: 'https://' + cfg.zimbraDomain + '/service/upload?fmt=extended,raw',
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


/** Create Task
 *
 * @param {object} request
 * @param {object} request.mp
 * @param {string} request.su
 * @param {object} request.inv
 * @param {number} request.l
 * @param {array}  request.e
 *
 */
exports.createTask = function(req, res, next) {
    var mp = req.body.mp || {};
    var su = req.body.su;
    var inv = req.body.inv || {};
    var l = req.body.l || 15;
    var e = req.body.e || [];
    var attach = req.body.attach || {};
    var requestObject = {
        'CreateTaskRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail'
            },
            'm': {
              'e': e,
              'inv': inv,
              'l': l,
              'mp': mp,
              'su': su,
              'attach': attach
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
                    return res.status(200).send(data.createtaskresponse);
                }
            }
        });
};


exports.modifyTask = function(req, res, next) {
    var mp = req.body.mp || {};
    var su = req.body.su;
    var id = req.body.id;
    var inv = req.body.inv || {};
    var l = req.body.l || 15;
    var e = req.body.e || [];
    var attach = req.body.attach || {};
    var requestObject = {
        'ModifyTaskRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail'
            },
            'comp': 0,
            'id': id,
            'm': {
              'e': e,
              'inv': inv,
              'l': l,
              'mp': mp,
              'su': su,
              'attach': attach
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
                    return res.status(200).send(data.modifytaskresponse);
                }
            }
        });
};

exports.cancelTask = function(req, res, next) {
    var id = req.body.id || '';
    var requestObject = {
        'CancelTaskRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail'
            },
            'comp': 0,
            'id': id
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
                    return res.status(200).send(data.canceltaskresponse);
                }
            }
        });
};

exports.itemAction = function(req, res, next) {
    var op = req.body.op;
    var tn = req.body.tn;
    var t = req.body.t;
    var id = req.body.id;
    var l = req.body.l;

    var requestObject = {
        'ItemActionRequest': {
            '@': {
                'xmlns': 'urn:zimbraMail'
            },
            'action': {
              'op': op,
              'id': id
            }
        }
    };

    if (!util.isNullOrUndefined(tn)){
      requestObject.ItemActionRequest.action.tn = tn;
    }

    if (!util.isNullOrUndefined(t)){
      requestObject.ItemActionRequest.action.t = t;
    }

    if (!util.isNullOrUndefined(l)){
      requestObject.ItemActionRequest.action.l = l;
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
                    return res.status(200).send(data.itemactionresponse);
                }
            }
        });
};



/**
 * The service to create new appointment
 *
 * @param {string} subject   - Subject
 * @param {array} emailInfo   - Email address information
 * @param {array} inviteInfo   - Invite information
 * @param {object} mp   - Mime part information
 * @param {number} folderId   - Folder Id
 * @param {object} attach   - attach
 * @param {object} invAttrs   - invAttrs
 */
exports.createAppointment = function(req, res, next) {
    var subject = req.body.subject;
    var e = req.body.emailInfo; // Email address information
    var comp = req.body.inviteInfo; // Invite information
    var mp = req.body.mp; // Mime part information
    var l = req.body.folderId;
    var attach = req.body.attach;
    var invAttrs = req.body.invAttrs || {};
    if ( !util.isNullOrUndefined(subject) && !util.isNullOrUndefined(e) &&
       !util.isNullOrUndefined(comp) && !util.isNullOrUndefined(mp) && !util.isNullOrUndefined(l)) {
        var requestObject = {
            'CreateAppointmentRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail',
                    'echo': 1,

                },
                'm': {

                    'e': e,
                    'inv': {
                        '@': invAttrs,
                        'comp': comp
                    },
                    'mp': mp,
                    '@': {
                        'l': l,
                        'su': subject
                        }
                }


            }
        };

        if ( !util.isNullOrUndefined(attach) ) {
          requestObject.CreateAppointmentRequest.m.attach = attach;
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
                        return res.status(200).send(data.createappointmentresponse);
                    }
                }
            });
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': 'Please input all required params'});
    }
};


/**
 * The service to modify an appointment
 * @param {object} request
 * @param {string} request.id   - Id
 * @param {string} request.uid   - UID
 * @param {string} request.subject   - Subject
 * @param {array}  request.emailInfo   - Email address information
 * @param {array}  request.inviteInfo   - Invite information
 * @param {object} request.mp   - Mime part information
 * @param {number} request.folderId   - Folder Id
 * @param {object} request.attach   - attachment
 */
exports.modifyAppointment = function(req, res, next) {
    var id = req.body.id;
    var uid = req.body.uid;
    var subject = req.body.subject;
    var e = req.body.emailInfo; // Email address information
    var comp = req.body.inviteInfo; // Invite information
    var mp = req.body.mp; // Mime part information
    var l = req.body.folderId;
    var attach = req.body.attach;
    if ( !util.isNullOrUndefined(id) && !util.isNullOrUndefined(subject) && !util.isNullOrUndefined(e) &&
       !util.isNullOrUndefined(comp) && !util.isNullOrUndefined(mp) && !util.isNullOrUndefined(l)) {
        var requestObject = {
            'ModifyAppointmentRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail'
                },
                'id': id,
                'm': {
                    'e': e,
                    'inv': {
                        'uid': uid,
                        'comp': comp
                    },
                    'mp': mp,
                    'l': l,
                    'su': subject
                }


            }
        };

        if ( !util.isNullOrUndefined(attach) ) {
          requestObject.ModifyAppointmentRequest.m.attach = attach;
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
                        return res.status(200).send(data.modifyappointmentresponse);
                    }
                }
            });
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': 'Please input all required params'});
    }
};



/** Get Free/Busy information.
 *  For accounts listed using uid,id or name attributes, f/b search will be done for all calendar folders.
 *  To view free/busy for a single folder in a particular account, use <usr>
 *  @param {object} request -
 *  @param {number} request.startTime - Range start in milliseconds
 *  @param {number} request.endTime - Range end in milliseconds
 *  @param {string} request.uid - Comma-separated list of Zimbra IDs or emails.
 *  Each value can be a Zimbra ID or an email.
 */
exports.getFreeBusy = function(req, res, next) {
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var uid = req.body.uid;

    if(!util.isNullOrUndefined(startTime) && !util.isNullOrUndefined(endTime) && !util.isNullOrUndefined(uid)){
        var requestObject = {
            'GetFreeBusyRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail',
                    's': startTime,
                    'e': endTime,
                    'uid': uid,
                    'excludeUid': -1
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
                        return res.status(200).send(data.getfreebusyresponse);
                    }
                }
            });
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': ''});
    }
};

/** Working hours are indicated as free, non-working hours as unavailable/out of office
 *  @param {object} request -
 *  @param {number} request.startTime - Range start in milliseconds
 *  @param {number} request.endTime - Range end in milliseconds
 *  @param {string} request.name - Comma-separated list of email addresses
 */
exports.getWorkingHours = function(req, res, next) {
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var name = req.body.name;

    if(!util.isNullOrUndefined(startTime) && !util.isNullOrUndefined(endTime) && !util.isNullOrUndefined(name)){
        var requestObject = {
            'GetWorkingHoursRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail',
                    's': startTime,
                    'e': endTime,
                    'name': name
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
                        return res.status(200).send(data.getworkinghoursresponse);
                    }
                }
            });
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': ''});
    }
};

/**
 * The service to call ConvAction request from Zimbra
 *
 * @param {string} id   - Comma separated list of item IDs to act on. Required except for TagActionRequest,
 *                         where the tags items can be specified using their tag names as an alternative.
 * @param {string} op   - Operation
 *                        For ItemAction - delete|dumpsterdelete|recover|read|flag|priority|tag|move|trash|rename
 *                        update|color|lock|unlock
 *                        For MsgAction - delete|read|flag|tag|move|update|spam|trash
 *                        For ConvAction - delete|read|flag|priority|tag|move|spam|trash
 *                        For FolderAction - read|delete|rename|move|trash|empty|color|[!]grant
 *                        revokeorphangrants|url|import
 *                        sync|fb|[!]check|update|[!]syncon|retentionpolicy|[!]disableactivesync|webofflinesyncdays
 *                        For TagAction - read|rename|color|delete|update|retentionpolicy
 *                        For ContactAction - move|delete|flag|trash|tag|update
 * @param {string} tags   - Comma-separated list of tag names
 * @param {string} folderId    - Folder ID
 */
exports.convAction = function(req, res, next) {
    var id = req.body.id;
    var op = req.body.op;
    var tn = req.body.tn;
    var tcon = req.body.tcon;
    var l = req.body.folderId || req.body.l;


    if ( !util.isNullOrUndefined(id) && !util.isNullOrUndefined(op) ) {
        var requestObject = {
            'ConvActionRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail'
                },
                'action': {
                    'id': id,
                    'op': op
                }

            }
        };

        if (!util.isNullOrUndefined(tn)) {
            requestObject.ConvActionRequest.action.tn = tn;
        }

        if (!util.isNullOrUndefined(tcon)) {
            requestObject.ConvActionRequest.action.tcon = tcon;
        }

        if (!util.isNullOrUndefined(l)) {
            requestObject.ConvActionRequest.action.l = l;
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
                        return res.status(200).send(data.convactionresponse);
                    }
                }
            });
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': 'id and op are required'});
    }
};

/**
 * This method will use to cancelAppointment
 * @param   {string} id  - Id of invite-id
 * @param   {string} emailInfo  - Component number of default invite
 * @param   {number} instance -  One instance of a repeating appointment
 */
this.cancelAppointment = function (req, res, next) {
    var id = req.body.id;
    var emailInfo = req.body.emailInfo;

    var instance = req.body.inst;
    var startDateTime = req.body.s;

    if ( !util.isNullOrUndefined(id) ) {
        var requestObject = {
            'CancelAppointmentRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail',
                    'id': id,
                    'comp': 0
                }

            }
        };

        if (!util.isNullOrUndefined(emailInfo)) {
            requestObject.CancelAppointmentRequest.m = emailInfo;
        }

        // For cancel only one instance of a repeating appointment
        if (!util.isNullOrUndefined(instance)) {
            requestObject.CancelAppointmentRequest.inst = instance;
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
                        return res.status(200).send(data.cancelappointmentresponse);
                    }
                }
            });
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': 'id is required'});
    }
};

/**
 * SetMailboxMetadataRequest
 * @param   {string} attrs  - Key value pairs
 * @param   {string} emailInfo  - Component number of default invite
 */
this.setMailboxMetadata = function (req, res, next) {
    var archivedFolderID = req.body.archivedFolderID;

    if ( !util.isNullOrUndefined(archivedFolderID) ) {
        var requestObject = {
            'SetMailboxMetadataRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail'
                },
                'meta': {
                  '@': {
                    'section': 'zwc:archiveZimlet'
                  },
                  'a': [
                  {
                    '@': {
                      'n' : 'archivedFolder',
                      '#': archivedFolderID
                    }
                  },
                   {
                    '@': {
                      'n' : 'showSendAndArchive',
                      '#': 'false'
                    }
                  },
                   {
                    '@': {
                      'n' : 'hideDeleteButton',
                      '#': 'false'
                    }
                  }
                  ]
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
                        return res.status(200).send(data.setmailboxmetadataresponse);
                    }
                }
            });
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': 'archivedFolderID is required'});
    }
};

/**
 * The service to do the GetMsgRequest from Zimbra API
 *
 * @param {string} id - Unique ID of the invite (and component therein) you are replying to
 * @param {string} idnt - Identity ID to use to send reply
 * @param {string} compNum - component number of the invite
 * @param {string} verb - Verb - ACCEPT, DECLINE, TENTATIVE
 * @param {string} updateOrganizer - Update organizer. Set by default. if unset then only make the update locally.
                                    This parameter has no effect if an <m> element is present.
 */
exports.sendInviteReply = function(req, res, next) {
    var id = req.body.id;
    var compNum = !util.isNullOrUndefined(req.body.compNum)?req.body.compNum:0;
    var verb = req.body.verb;
    var idnt = req.body.idnt;
    var updateOrganizer = req.body.updateOrganizer;
    var m = req.body.emailInfo;

    var requestObject = {
            'SendInviteReplyRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail',
                    'id': id,
                    'compNum': compNum,
                    'verb': verb
                }
            }
        };

    if (!util.isNullOrUndefined(updateOrganizer)) {
        requestObject.SendInviteReplyRequest['@'].updateOrganizer = updateOrganizer;
    }
    if (!util.isNullOrUndefined(m)) {
        requestObject.SendInviteReplyRequest.m = m;
    }
    if (!util.isNullOrUndefined(idnt)) {
        requestObject.SendInviteReplyRequest['@'].idnt = idnt;
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
                    return res.status(200).send(data.sendinvitereplyresponse);
                }
            }
        });
};


/**
 * Get Spell Dictionaries
 *
 */
exports.getSpellDictionaries = function(req, res, next) {

    var requestObject = {
            'GetSpellDictionariesRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail'
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
                    return res.status(200).send(data.getspelldictionariesresponse);
                }
            }
        });
};

/**
 * Check Spelling
 *
 * @param {string} re.word - Word
 */
exports.checkSpelling = function(req, res, next) {
    var word = req.body.word || '';

    var requestObject = {
            'CheckSpellingRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail'
                },
                '#': word
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
                    return res.status(200).send(data.checkspellingresponse);
                }
            }
        });
};

/**
 * Get Prefs
 *
 * @param {object} re.word - Word
 */
exports.getPrefs = function(req, res, next) {
    var prefName = req.body.prefName;

    var requestObject = {
            'GetPrefsRequest': {
                '@': {
                    'xmlns': 'urn:zimbraAccount'
                }
            }
        };

    if (!util.isNullOrUndefined(prefName)) {
        requestObject.GetPrefsRequest['pref'] = {};
        requestObject.GetPrefsRequest['pref']['@'] = {};
        requestObject.GetPrefsRequest['pref']['@'].name = prefName;
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
                    return res.status(200).send(data.getprefsresponse);
                }
            }
        });
};

/**
 * The service to send share notification request
 *
 * @param {object} request
 * @param {string} request.id - Item ID
 * @param {object} request.emailInfo - Email to receive the notification (e: Email address,
 * t: Optional Address type - (f)rom, (t)o, (c)c, (b)cc, (r)eply-to, (s)ender, read-receipt (n)otification, (rf) resent-from
 * p: The comment/name part of an address
 * @param {string} request.notes - Notes
 */
exports.sendShareNotification = function(req, res, next) {
    var id = req.body.id;
    var action = req.body.action || 'edit';
    var email = req.body.emailInfo;
    var notes = req.body.notes || '';

    var requestObject = {
            'SendShareNotificationRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail',
                     'action': action,
                },
                'item': {
                  '@': {
                    'id': id
                  }
                },
                'e': {
                  '@': {
                    'a': email
                  }
                },
                'notes': notes

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
                    return res.status(200).send(data.sendsharenotificationresponse);
                }
            }
        });
};


exports.batchRequest = function(req, res, next) {
    var BatchRequest = req.body || {};

    BatchRequest['@'] = {};
    BatchRequest['@'].xmlns = 'urn:zimbra';
    BatchRequest['@'].onerror = 'continue';
    var requestObject = {
      'BatchRequest': BatchRequest
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
                    return res.status(200).send(data.batchresponse);
                }
            }
        });
};

/**
 * BounceMsgRequest
 *
 * @param {object} request
 * @param {string} request.id - Id of msg to resend
 * @param {array} request.e - Email Info
 */
exports.bounceMsg = function(req, res, next) {
    var id = req.body.id || 0;
    var e = req.body.e || [];

    var requestObject = {
            'BounceMsgRequest': {
                '@': {
                    'xmlns': 'urn:zimbraMail',
                },
                'm': {
                  '@': {
                    'id': id
                  },
                  'e': e
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
                    return res.status(200).send(data.bouncemsgresponse);
                }
            }
        });
};

/**
 * Print Contact
 */
exports.printContact = function(req, res, next) {
    var request = require('request');
    if (!util.isNullOrUndefined(req.query.id)) {
        var id = req.query;
        var r = request({
                method: 'POST',
                uri: 'https://' + cfg.zimbraDomain + '/h/printcontacts?id=' + req.query.id,
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
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': 'Contact Id is required'});
    }
};

/**
 * Print Task
 */
exports.printTask = function(req, res, next) {
    var request = require('request');
    if (!util.isNullOrUndefined(req.query.id)) {
        var id = req.query;
        var r = request({
                method: 'POST',
                uri: 'https://' + cfg.zimbraDomain + '/h/printtasks?id=' + req.query.id,
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
    }
    else {
        return res.status(400).send({'status': 'failed', 'msg': 'Task Id is required'});
    }
};

 /**
  * Print Conversation
  */
 exports.printMessage = function(req, res, next) {
     var request = require('request');
     if (!util.isNullOrUndefined(req.query.id)) {
         var id = req.query;
         var r = request({
                 method: 'GET',
                 uri: 'https://' +  cfg.zimbraDomain  + '/h/printmessage?id=C:' + req.query.id,
                 strictSSL: false,
                 headers: {
                     'Cookie': 'ZM_AUTH_TOKEN='  + req.cookies.ZM_AUTH_TOKEN
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
     }
     else {
         return res.status(400).send({'status': 'failed', 'msg': 'Conversation Id is required'});
     }
 };
