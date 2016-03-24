let mailHandleService = function( mailFilterByDateService, mailService, logger, tagService,
                                  vncConstant, sidebarService, $rootScope, $mdToast, $state ){

  this._getMessageDetail = ( detail, key, parentIndex, index, e, cb ) => {
    e.stopPropagation();
    let vm = this;

    let getEmailDetailRequest = {
      'id': detail.$.id
    };
    mailService.getEmailDetailByMessageId(getEmailDetailRequest, (messagesDetail) => {

      angular.isArray(messagesDetail) || (messagesDetail = [messagesDetail]);
      cb(messagesDetail);

    }).catch((error) => {
      logger.error(error.msg, 'error', error.title);
    });
  };

  this._getEmailDetail = ( mail, cb ) => {
    let vm = this;
    let getEmailDetailRequest = {
      'cid': mail.cid,
      'fullConversation': 1
    };
    mailService.getEmailDetail(getEmailDetailRequest, (messagesDetail) => {

      cb(messagesDetail);

    }).catch((error) => {
      logger.error(error.msg, 'error', error.title);
    });

  };

  this._getEmailConversationDetail = (cid, cb) => {
    let getEmailDetailRequest = {
      cid: cid,
      fetch: "0",
      html: 1,
      limit: 250,
      locale: {_content: "en"},
      max: 250000,
      offset: 0,
      query: "in:inbox",
      recip: "2",
      sortBy: "dateDesc"
    };

    mailService.getEmailDetail(getEmailDetailRequest, (messageDetail) => {
      for(let i in messageDetail){
        let tempMessageDetail = {};
        if(messageDetail[i].e){
          angular.isArray(messageDetail[i].e) || (messageDetail[i].e = [messageDetail[i].e]);
          for(let j in messageDetail[i].e){
            if(messageDetail[i].e[j].$.t == "f") {
              tempMessageDetail = messageDetail[i].e[j];
              break;
            }
          }
          messageDetail[i].e = tempMessageDetail;
        }
      }
      cb(messageDetail);
    }).catch((error) => {
      logger.error(error, error, 'VNC Get mail error');
    });
  };

  this._normalizeUnreadEmails = (rawEmails) => {
    // Handles the returned emails list. Makes it contain meaningful property-names
    let normalizedEmailList = [];

    if (rawEmails && rawEmails.length > 0) {
      let isApptInvite = false;

      for (let i = 0; i < rawEmails.length; i++) {
        let mail = rawEmails[i];
        let date = new Date(Number(mail.$.d));
        let sender = {};
        let from = [];
        let tos = [];
        let ccs = [];
        let bccs = [];
        if (mail.e) {
          angular.isArray(mail.e) || (mail.e = [mail.e]);
          for (let j = 0; j < mail.e.length; j++) {
            let info = mail.e[j];
            switch (info.$.t) {
              case 'f':
                sender = {
                  email: info.$.a,

                  displayName: info.$.p || info.$.d,
                  /**
                   * (f)rom, (t)o, (c)c, (b)cc, (r)eply-to, (s)ender,
                   * read-receipt (n)otification, (rf) resent-from
                   */
                  addressType: info.$.t
                };
                from.push({
                  email: info.$.a,

                  displayName: info.$.p || info.$.d,
                  /**
                   * (f)rom, (t)o, (c)c, (b)cc, (r)eply-to, (s)ender,
                   * read-receipt (n)otification, (rf) resent-from
                   */
                  addressType: info.$.t
                });
                break;

              case 't':
                tos.push({
                  email: info.$.a,

                  displayName: info.$.p || info.$.d,
                  /**
                   * (f)rom, (t)o, (c)c, (b)cc, (r)eply-to, (s)ender,
                   * read-receipt (n)otification, (rf) resent-from
                   */
                  addressType: info.$.t,
                  fullName: info.$.p
                });
                break;
              case 'c':
                ccs.push({
                  email: info.$.a,
                  fullName: info.$.p,
                  displayName: info.$.d
                });
                break;
              case 'b':
                bccs.push({
                  email: info.$.a,
                  fullName: info.$.p,
                  displayName: info.$.d
                });
                break;

              default:
              // resent
            }
          }
        }
        if(mail.m){
          angular.isArray(mail.m) || (mail.m = [mail.m]);
        }
        //TODO: isApptInvite = this._checkIfEmailIsApptInvitation(mail.inv, mail.$.cid);
        normalizedEmailList.push({
          cid: mail.$.id,
          flag: mail.$.f || '', // Eg. u is un-read.
          tags: tagService._splitTags(mail.$.tn),// all tags name
          noOfUnread: Number(mail.$.u), // Eg. u is un-read.
          time: mail.$.d, // Long - Date (secs since epoch) of most recent message in the converstation.
          date: date.toDateString(), // Long - Date (secs since epoch) of most recent message in the converstation.
          subject: mail.su || '<No Subject>', // First few words of the message.
          content: mail.fr, // First few words of the message.
          plainContent: mail.fr || 'The message has no text content.', // First few words of the message.
          messages: [],
          m: mail.m,
          mailTos: tos,
          mailCcTos: ccs,
          mailBccTos: bccs,
          sender: sender,
          sentDate: mail.$.d,
          resentDate: mail.$.rd,
          totalMessages: mail.$.n, // total messages available in conversation
          from: from,
          active: false, // set backgorund color for selected mail
          isCollapse: false, // toggle conversation of mail
          //TODO: isApptInvite: isApptInvite
          selected : false // for initialize checkbox
        });
      }
    }
    return normalizedEmailList;
  };

  this._publishEvents = (eventName) => {
    $rootScope.$broadcast(eventName);
  };

  this._undoMail = (key, index, email, message, folderID) => {
    let vm = this;
    $mdToast.show({
      template: `<md-toast> ${ message } <md-button ng-click="toast.undoFromJunk()" class="md-warn">Undo</md-button></md-toast>`,
      controller: [function () {
        let self = this;
        self.undoFromJunk = function(){
           vm._undoSpamEmail(key, index, email, folderID);
        }
      }],
      controllerAs: 'toast',
      hideDelay: 6000
    });
  };

  this._undoMessage = (index, messages, message, folderID) => {
    let vm = this;
    $mdToast.show({
      template: `<md-toast> ${ message } <md-button ng-click="toast.undoFromJunk()" class="md-warn">Undo</md-button></md-toast>`,
      controller: [function () {
        let self = this;
        self.undoFromJunk = function(){
          vm._undoSpamMessage(index, messages, folderID);
        }
      }],
      controllerAs: 'toast',
      hideDelay: 6000
    });
  };

  this._undoDeletedMail = (key, index, email, message, folderID) => {
    let vm = this;
    $mdToast.show({
      template: `<md-toast> ${ message } <md-button ng-click="toast.undoFromJunk()" class="md-warn">Undo</md-button></md-toast>`,
      controller: [function () {
        let self = this;
        self.undoFromJunk = function(){
          vm._undoTrashEmail(key, index, email, folderID);
        }
      }],
      controllerAs: 'toast',
      hideDelay: 6000
    });
  };

  this._undoSpamMessage = (index, messages, folderID) => {
    let vm = this;
    mailService.moveMessage(messages[index].id, folderID,
      function(res, err){
        if(res){
          $mdToast.hide();
          vm._publishEvents('event:updateNoOfMails');
          // logger.success('1 Messages moved to "' + $state.current.title + '"');
          messages[index].move = false;
        }
        else logger.error(err);
      });
  };

  this._undoSpamEmail = (key, index, email, folderID) => {
    let vm = this;
    mailService.moveEmail(email.emails[key][index].cid, folderID,
      function(res, err){
        if(res){
          $mdToast.hide();
          vm._publishEvents('event:updateNoOfMails');
          // logger.success('1 Conversation moved to "' + $state.current.title + '"');
          // logger.success(email.emails[key][index].totalMessages + ' Messages moved to "' + $state.current.title + '"');
          email.emails[key][index].move = false;
        }
        else logger.error(err);
      });
  };

  this._undoTrashEmail = (key, index, email, folderID) => {
    let vm = this;
    mailService.undoEmailFromTrash(email.emails[key][index].cid, folderID,
      function(res, err){
        if(res){
          $mdToast.hide();
          vm._publishEvents('event:updateNoOfMails');
          // logger.success('1 Conversation moved to "' + $state.current.title + '"');
          // logger.success(email.emails[key][index].totalMessages + ' Messages moved to "' + $state.current.title + '"');
          email.emails[key][index].move = false;
        }
        else vm.logger.error(err);
      });
  };
};

mailHandleService.$inject = ['mailFilterByDateService','mailService','logger', 'tagService', 'vncConstant', 'sidebarService', '$rootScope', '$mdToast', '$state'];
/*@ngInject*/

export default mailHandleService;
