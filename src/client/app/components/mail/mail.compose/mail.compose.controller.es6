const LOGGER = new WeakMap();
const ROOTSCOPE = new WeakMap();
const SCE = new WeakMap();
const SCOPE = new WeakMap();
const MDDIALOG = new WeakMap();
const MDTOAST = new WeakMap();

class MailComposeController {
  /* @ngInject */
  constructor($mdDialog, $rootScope, $sce, $scope, auth, data, logger, mailService, moment, $mdToast, $document, vncConstant, hotkeys) {
    LOGGER.set(this, logger);
    ROOTSCOPE.set(this, $rootScope);
    SCE.set(this, $sce);
    SCOPE.set(this, $scope);
    MDDIALOG.set(this, $mdDialog);
    MDTOAST.set(this, $mdToast);

    this.auth = auth;
    this.fromEmail = auth.userEmail;
    this.mailService = mailService;
    this.moment = moment;
    this.$document = $document;

    this.actionType = '';
    this.newAttachments = [];
    this.newAttachmentIds = [];
    this.attachmentsFromDraftOrSentEmail = [];
    this.bccEmails = [];
    this.ccEmails = [];
    this.content = '';
    this.emailData = {};
    this.emailDraftId = null;
    this.isBccVisible = false;
    this.firstOpen = true;
    this.mailComposeConstant = {};
    this.subject = '';
    this.title = 'New mail';
    this.reqPending = false;
    this.priorities = [{icon: 'vertical_align_top', value: 'High'},{icon: 'remove', value: 'Normal'},{icon: 'vertical_align_bottom', value: 'Low'}];
    this.selectedPriority = '';
    this.signature = '';
    this.selectedPriorities = {
      High : '!',
      Low : '?',
      Normal : '+'
    };
    this.toEmails = [];
    this.readReceipt = false;

    var vm = this;

    mailService.getDataSources(function(res){

      if ( angular.isDefined(res.pop3) ) {

        if ( angular.isDefined(res.pop3.$) ) {
          vm.pop3 = [res.pop3.$];
        }
        else {
          console.log(res.pop3);
          vm.pop3 = _.map(res.pop3, function(data){
            return data.$;
          })
        }
      }
    });

    mailService.getSignatures(function(res){

      if ( angular.isDefined(res.getsignaturesresponse) && angular.isDefined(res.getsignaturesresponse.signature) && angular.isDefined(res.getsignaturesresponse.signature.content) ) {
        vm.signature = res.getsignaturesresponse.signature.content._;
        vm.content = vm.content + '<br><br><br>' + vm.signature;
      }

    });

    this._activate(data);

    $scope.$on('CLOSE_MAIL_COMPOSE', (e, data) => {
      this._closeModal($mdDialog);
    });

   /////////////////////////////////////  add hotkeys  //////////////////////////////////////////////////////////
    hotkeys.add({
      combo: ['enter','ctrl+enter'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function( ) {
        vm.checkSend();
      }
    });
    hotkeys.add({
      combo: ['ctrl+enter'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function( ) {
        vm.checkSend();
      }
    });
    hotkeys.add({
      combo: ['esc'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(event) {
          vm.cancel()
      }
    });
    hotkeys.add({
      combo: ['ctrl+s'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(event) {
        event.preventDefault();
        vm.savedEmailAsDraft('userSave');
        vm.dialogHide = 'Close'
      }
    });

    hotkeys.add({
      combo: ['ctrl+m'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function( ) {
        angular.element('#fileAttachmentId').trigger('click');
      }
    });

    hotkeys.add({
      combo: ['ctrl+g'],
      allowIn: ['INPUT'],
      callback: function(event) {
        //do your stuff for Searching addresses here
      }
    });
    hotkeys.add({
      combo: ['ctrl+h'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(event) {
        //event.preventDefault();
        //do your stuff for HTML/text format here
      }
    });
    hotkeys.add({
      combo: ['ctrl+x'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(event) {
        event.preventDefault();
        $('body').attr("spellcheck",true);
      }
    });

    hotkeys.add({
      combo: ['y'],
      callback: function( ) {
          yes()
      }
    });
    hotkeys.add({
      combo: ['n'],
      callback: function( ) {
        no()
      }
    });
    /////////////////////////////////////  add hotkeys  //////////////////////////////////////////////////////////

  }

  autoSaveDraft(){
    this.savedEmailAsDraft();
  }

  selectMailPriority(){
    this.savedEmailAsDraft();
  };

  _activate(data) {
    this.mailComposeConstant = {
      action: {
        compose: 'COMPOSE',
        reply: 'REPLY',
        replyAll: 'REPLYALL',
        forward: 'FORWARD',
        forward_conversation: 'FORWARD_CONVERSATION',
        edit: 'EDIT',
        getContact: 'GET_CONTACT'
      },
      content: {
        emailContent: 'emailContent',
        attachment: 'attachment'
      },
      contentType: {
        textHTML: 'text/html',
        textPlain: 'text/plain',
        attachment: 'multipart/alternative'
      },
      user: {
        displayName: 'displayName',
        emailAddress: localStorage.getItem('mailWidgetSelectedEmailAddress')
      }
    };

    if(angular.isDefined(data) && data !== '' && !angular.equals({}, data)) {
      let dataObject = JSON.parse(data);
      if (angular.isDefined(dataObject) && dataObject !== null) {
        this.emailData = dataObject.emailData;
        this.actionType = dataObject.actionType;

        if (this.actionType === this.mailComposeConstant.action.compose) {
          return;
        }

        // initialize common and specific data for Reply, Reply All, Forward and Forward Conversation
        this.actionType != 'GET_CONTACT' && this._initializeCommonData(this.emailData);
        switch (this.actionType) {
          case this.mailComposeConstant.action.reply:
            this._initializeDataForReply(this.emailData, false);
            break;
          case this.mailComposeConstant.action.replyAll:
            this._initializeDataForReply(this.emailData, true);
            break;
          case this.mailComposeConstant.action.forward:
            this._initializeDataForForward(this.emailData, false);
            break;
          case this.mailComposeConstant.action.forward_conversation:
            this._initializeDataForForward(this.emailData, true);
            break;
          case this.mailComposeConstant.action.edit:
            this._initializeDataForEdit(this.emailData);
            break;
          case this.mailComposeConstant.action.getContact:
            this._initializeDataForGet(this.emailData);
            break;
        }
      }
    }
  }

  _closeModal() {
    if (this.firstOpen) {
      MDDIALOG.get(this).hide().then(() => {
          console.info('close');
          // TODO This is a hack job until the issue of nested modals gets fixed.
          setTimeout(() => {
              let mask = document.querySelector('.md-scroll-mask');
              let dialog = document.querySelector('.md-dialog-container');
              let backdrop = document.querySelector('.md-dialog-backdrop');
              let body = document.querySelector('body');

              if(mask) {
                mask.parentNode.removeChild(mask);
              }
              if(dialog) {
                dialog.parentNode.removeChild(dialog);
              }
              if(dialog) {
                backdrop.parentNode.removeChild(backdrop);
              }

              body.classList.remove('md-dialog-is-showing');
              this.firstOpen = false;
          }, 250);
      }, 'finished');
    }

  }

  _initializeCommonData(emailData) {
    this.subject = emailData.subject;

    // Prepare Original Message
    let sentDate = new this.moment(new Date(Number(emailData.sentDate))).format('dddd, MMMM DD, YYYY hh:mm:ss A');
    let fromList = [emailData.sender.displayName + ' <' + emailData.sender.email + '>'];

    let toList = emailData.mailTos.map((toEmail) => {
      return toEmail.displayName || toEmail.email + ' <' + toEmail.email + '>';
    });

    let ccList = emailData.mailCcTos.map((ccEmail) => {
      return ccEmail.displayName + ' <' + ccEmail.email + '>';
    });

    // Prepare Original Message
    let originalMessage = '';
    originalMessage += '<br>From: ' + fromList.join(', ');
    originalMessage += '<br>To: ' + toList.join(', ');

    if (ccList.length > 0) {
      originalMessage += '<br>CC: ' + ccList.join(', ');
    }

    originalMessage += '<br>Sent: ' + sentDate;
    originalMessage += '<br>Subject: ' + emailData.subject;
    originalMessage += '<br><br>' + emailData.plainContent;

    this.content = originalMessage;
    if ( this.actionType === 'NEW') {
      this.content = '';
      let sender = this.emailData.sender;
      this.toEmails = [{display: sender.email + ' <' + sender.displayName + '>',
        email: sender.email,
        name: sender.displayName
      }];
    }

  }

  _initializeDataForForward(emailData, isForwardConversation) {
    this.title = 'Forward';
    if (this.subject.toLowerCase().indexOf('fwd:') < 0) {
      this.subject = 'Fwd: ' + this.subject;
    }

    // Prepare Original Message
    this.content = '<br><br><br>----- Forwarded Message -----' + this.content;

    // Prepare attachments for forwarding from the sent email
    if (emailData.attachmentList && emailData.attachmentList.length > 0) {
      for (let attachment of emailData.attachmentList) {
        this.attachmentsFromDraftOrSentEmail.push({
          'part': attachment.part,
          'mid': emailData.id,
          'aid': attachment.part,
          'name': attachment.filename,
          'size': attachment.s
        });
      }
    }

    if (isForwardConversation) {
      this.title = 'Forward Conversation';
      this.content = '';
      // Prepare attachments for forwarding from the sent email
      //if (emailData.messages && emailData.messages.length > 0) {
      //  for(let i = 0; i < emailData.messages.length; i++){
      //    let attachment = emailData.messages[i];
      //    this.attachmentsFromDraftOrSentEmail.push({
      //      'mid': attachment.$.id,
      //      'part': String(i + 1),
      //      'name': attachment.su,
      //      'size': attachment.$.s
      //    });
      //  }
      //}
    }
  }

  _initializeDataForReply(emailData, isReplyAll) {
    this.title = 'Reply';
    if (this.subject.toLowerCase().indexOf('re:') < 0) {
      this.subject = 'Re: ' + this.subject;
    }

    this.toEmails = [{
      display: emailData.sender.displayName + ' <' + emailData.sender.email + '>',
      email: emailData.sender.email,
      name: emailData.sender.displayName
    }];

    // Add all emails in CC list to To List
    // And set the title of the email compose modal view
    if (isReplyAll) {
      this.title = 'Reply all';

      // TODO: Prevent duplicate emails
      for (let toEmail of emailData.mailTos) {
        let newToEmail = {
          display: toEmail.displayName + ' <' + toEmail.email + '>',
          email: toEmail.email,
          name: toEmail.displayName
        };

        if (this.toEmails.indexOf(newToEmail) === -1) {
          this.toEmails.push(newToEmail);
        }
      }

      for (let ccEmail of emailData.mailCcTos) {
        let newToEmail = {
          display: ccEmail.displayName + ' <' + ccEmail.email + '>',
          email: ccEmail.email,
          name: ccEmail.displayName
        };

        if (this.toEmails.indexOf(newToEmail) === -1) {
          this.toEmails.push(newToEmail);
        }
      }
    }

    // Prepare Original Message
    this.content = '<br><br><br>----- Original Message -----' + this.content;
  }

  _initializeDataForEdit(emailData) {
    this.title = 'Edit';
    this.subject = emailData.subject;
    this.toEmails = [];
    this.mailCcTos = [];
    for (let toEmail of emailData.mailTos) {
      let newToEmail = {
        display: toEmail.displayName || toEmail.email,
        email: toEmail.email,
        name: toEmail.displayName || toEmail.email
      };

      if (this.toEmails.indexOf(newToEmail) === -1) {
        this.toEmails.push(newToEmail);
      }
    }

    for (let ccEmail of emailData.mailCcTos) {
      let newToEmail = {
        display: ccEmail.displayName || ccEmail.email,
        email: ccEmail.email,
        name:  ccEmail.displayName || ccEmail.email
      };

      if (this.mailCcTos.indexOf(newToEmail) === -1) {
        this.mailCcTos.push(newToEmail);
      }
    }

    // Prepare Original Message
    this.content = emailData.content;
  }

  _initializeDataForGet(emailData) {
    this.toEmails = [{
      display: emailData.avatarName,
      name: emailData.displayName
    }];
  }

  savedEmailAsDraft(userSave) {
    let request = this._prepareDataForSending();
    //request.tagName = 'tagName';
    this.mailService.saveDraft(request, (response) => {
      if (response.status && response.status === 'failed') {
        //logger.error(res.msg);
      }

      // the attachment parts resets when we add new attachment
      let attachmentParts = [];

      if (response.m) {
        if (this.emailDraftId === null) {
          this.emailDraftId = response.m.$.id;
        }

        // TODO: checks if draft-email contains any attachment
        let attachmentList = this._getMimePartEmailObject(response.m.mp, 'attachment');
        if (attachmentList.length > 0) {
          for (let attachment of attachmentList) {
            // stores the attachment info for sending/forwarding
            attachmentParts.push({
              part: attachment.part,
              fileName: attachment.filename,
              size: attachment.s,
              mid: this.emailDraftId
            });
          }

          // re-set the attachment list
          this.attachmentsFromDraftOrSentEmail = attachmentParts;
        }
        ROOTSCOPE.get(this).$broadcast('event:updateNoOfDraftMails');
        ROOTSCOPE.get(this).CurrentDraftId = this.emailDraftId;
        if(userSave){
          // LOGGER.get(this).success('Draft saved.');
        }
      }
    }).catch((error) => {
      // TODO: Notify if the mail could not save to draft.
      //logger.warning('Mail nicht verschickt; eine oder mehrere Adressen wurden nicht akzeptiert.');
    });
  }

  _getMimePartEmailObject(data, content) {
    let result = loopThroughObject(data, content);
    ///
    /// Looping through data.mp object to return exactly object data for requesting content.
    ///
    function loopThroughObject(data, content) {
      let result = null;

      if (!data) {
        return result;
      }

      // Check if the current data is an array.
      if (angular.isArray(data)) {
        for (let i in data) {

          //          if (content === 'attachment') {
          let temp = loopThroughObject(data[i], content);

          if (result === null) {
            result = [];
          }

          if (temp !== null) {
            result = result.concat(temp);
          }
          //          }
        }
      }

      if (data.$) {
        if (data.$.cd === content) {
          if (result === null) {
            result = [];
          }

          result.push(data.$);
        }
      }

      if (data.mp) {
        result = loopThroughObject(data.mp, content);
      }

      return result;
    }

    return result;
  }

  _savingDraftModalController($rootScope, $mdDialog, mailService) {
    // save draft
    this.yes = () => {
      // save draft, then close mail compose view
      $mdDialog.hide(true, $rootScope);
      $rootScope.$broadcast('CLOSE_MAIL_COMPOSE');
      $rootScope.CurrentDraftId = undefined;
    };

    // not saving draft
    this.no = () => {
      $rootScope.CurrentDraftId && mailService.messageActions($rootScope.CurrentDraftId, 'delete', function (err, res) {
        //nothing to show as zimbra
        $rootScope.CurrentDraftId = undefined;
      });

      // close mail compose view without saving draft
      $mdDialog.cancel(false);
      $rootScope.$broadcast('CLOSE_MAIL_COMPOSE');
    };

  };

  _emptyCCDialog() {

    let vm = this;
    vm.reqPending = true;
    MDTOAST.get(this).show({
      templateUrl: 'emptyCC.html',
      controller: function($rootScope, $mdToast){
        this.ok = () => {
          $mdToast.hide();
        };
      },
      controllerAs: 'vm',
      bindToController: true,
      parent : this.$document[0].querySelector('#toastBounds'),
      hideDelay: 0,
      position: "left right bottom"
    }). then(function(){
      vm.reqPending = false;
    });
  }

  _emptySubjectDialog() {

    let vm = this;
    vm.reqPending = true;
    MDTOAST.get(this).show({
      templateUrl: 'emptySubject.html',
      controller: function($rootScope, $mdToast){
        this.ok = () => {
          $mdToast.hide();
        };
        this.cancel = () => {
          $mdToast.cancel();
        };
      },
      controllerAs: 'vm',
      bindToController: true,
      parent : vm.$document[0].querySelector('#toastBounds'),
      hideDelay: 0,
      position: "left right bottom"
    }). then(function(){
      vm.sendEmail();
      //then close mail compose modal view
      ROOTSCOPE.get(vm).$broadcast('CLOSE_MAIL_COMPOSE');
      vm.reqPending = false;
    });
  }

  cancel(ev) {
    // if email is changed --> ask to save draft
    let vm = this;
    if(SCOPE.get(this).mailCompose.$dirty){
      var modalInstance = MDDIALOG.get(this).show({
            controller: this._savingDraftModalController,
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'savingDraftModal.html',
            escapeToClose: false,
            fullscreen: true
          })
            .then(() => {
              // TODO: save draft
              vm.savedEmailAsDraft('userSave');

              // then close mail compose modal view
              ROOTSCOPE.get(this).$broadcast('CLOSE_MAIL_COMPOSE');
          });
    }

    else{
      ROOTSCOPE.get(this).$broadcast('CLOSE_MAIL_COMPOSE');
    }
  }

  closeBcc() {
    this.isBccVisible = false;
  }

  showBcc() {
    this.isBccVisible = true;
  }

  checkSend(){
    if(!this.bccEmails.length && !this.ccEmails.length && !this.toEmails.length){
      this._emptyCCDialog();
    }
    else if(!this.subject){
      this._emptySubjectDialog();
    }
    else{
      this.sendEmail();
    }
  }

  sendEmail() {
    let vm = this;
    let request = this._prepareDataForSending();

    this.mailService.sendEmail(request, (response) => {
      if (response.status && response.status === 'failed') {
        return;
      }

      // LOGGER.get(this).success('Message sent');

      // close mail compose modal view after sending email successfully.
      vm._closeModal();
    }).catch((error) => {
      LOGGER.get(this).warning('Message not sent, one or more addresses were not accepted.');
    });
  }

  _prepareAttachmentRequest(request) {
    if (this.attachmentsFromDraftOrSentEmail && this.attachmentsFromDraftOrSentEmail.length > 0) {
      // mp is the attachment(s) received (when forwarding)
      request.attach = {
        mp: []
      };

      for (let attachment of this.attachmentsFromDraftOrSentEmail) {
        request.attach.mp.push({
          aid: attachment.aid,
          mid: attachment.mid,
          part: attachment.part
        });
      }
    }

    // if there'll be new attachment(s)
    if (this.newAttachments.length > 0) {
      if (!request.attach) {
        request.attach = {};
      }

      request.attach.aid = '';
      for(let attachment of this.newAttachments) {
        request.attach.aid += attachment.aid + ',';
      }

      if (request.attach.aid.endsWith(',')) {
        request.attach.aid.substring(0, request.attach.aid.length - 2);
      }
    }
  }

  // Prepare data for sending/saving mail as draft.
  _prepareDataForSending() {
    let emailInfoList = [];

    // Filter data for emailTo
    if (this.toEmails.length > 0) {
      for (let toEmail of this.toEmails) {
        emailInfoList.push({
          t: 't',
          a: toEmail.email,
          d: toEmail.name
        });
      }
    }
    if(this.readReceipt){
      emailInfoList.push({
        t: 'n',
        a: this.auth.userEmail,
        d: this.auth.user.name
      });
    }

    // Filter data for emailCc
    if (this.ccEmails.length > 0) {
      for (let ccEmail of this.ccEmails) {
        emailInfoList.push({
          t: 'c',
          a: ccEmail.email,
          d: ccEmail.name
        });
      }
    }

    // Filter data for emailBcc
    if (this.bccEmails.length > 0) {
      for (let bccEmail of this.bccEmails) {
        emailInfoList.push({
          t: 'b',
          a: bccEmail.email,
          d: bccEmail.name
        });
      }
    }

    // Filter data for emailFrom
    emailInfoList.push({
      t: 'f',
      a: this.fromEmail || this.auth.user.name
    });

    let emailBodyContent = '<html><body>' + this.content + '</body></html>';
    let contentType = this.emailData ? this.emailData.contentType : this.mailComposeConstant.contentType.textHTML;

    let request = {
      id: this.emailDraftId,
      f: this.selectedPriorities[this.selectedPriority.value],
      subject: this.subject || '<No Subject>',
      contenttype: contentType,
      content: this.content || 'The message has no text content',
      emailInfo: emailInfoList
    };

    this._prepareAttachmentRequest(request);

    return request;
  }
}

export default MailComposeController;
