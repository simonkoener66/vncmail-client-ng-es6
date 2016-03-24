import mailComposeTemplate from '../../mail.compose/mail.compose.html';
class MailDetailController {
  /*@ngInject*/
  constructor( logger, $sce, mailService, $rootScope, $scope, $compile, $state, mailHandleService, tagService, hotkeys ) {

    // initialization
    var vm = this;
    vm.tmpContentDivId = 0;
    vm.mailDetail = angular.isDefined(vm.mailDetail) ? vm.mailDetail : [];
    vm.mailIndex = angular.isDefined(vm.mailIndex) ? vm.mailIndex : '';
    vm.mailKey = angular.isDefined(vm.mailKey) ? vm.mailKey : '';
    vm.mailFolder = angular.isDefined(vm.mailFolder) ? vm.mailFolder : '';
    vm.mailComposeTemplate = mailComposeTemplate;
    vm.emailDetailList = {
      messages: [],
      subject: '',
      startDate: '',
      isCollapsed: false
    };

    // services
    vm.sce = $sce;
    vm.scope = $scope;
    vm.logger = logger;
    vm.$rootScope = $rootScope;
    vm.$compile = $compile;
    vm.state = $state;
    vm.mailService = mailService;
    vm.mailHandleService = mailHandleService;
    vm.tagService = tagService;
    if(vm.mailDetail.length){
      vm.emailDetailList.subject = vm.mailDetail[0].su;

      // sorts ascending (to Array) to prepare getting the first email date.
      let tempSortEmails = vm.mailDetail.sort(function(a,b) {
        return new Date(a.$.d).getTime() - new Date(b.$.d).getTime()
      });
      vm.emailDetailList.startDate = tempSortEmails[0].$.d;

      for (let i = 0; i < vm.mailDetail.length; i++) {
        this.getEmailDetail(vm.mailDetail[i], i);
      }
    }

    vm.expandCollapseSingleConversation = function(id,value){
       this.emailDetailList.messages[id].isCollapsed = value;
    };

    vm.toggleSingleConversation = function(id){
       this.emailDetailList.messages[id].isCollapsed = !this.emailDetailList.messages[id].isCollapsed;
    };

    vm.expandCollapseAllConversation = function(value){
      for(let i = 0; i < vm.emailDetailList.messages.length; i++){
        this.emailDetailList.messages[i].isCollapsed = value;
      }
    };

    vm.selectPreviousUnreadMessage = function(id){
      let previousUnreadMessage = -1;
      for(let i = 0; i < vm.emailDetailList.messages.length; i++){
        if(this.emailDetailList.messages[i].flag.indexOf('u') >= 0 && i<id ){
            previousUnreadMessage = i;
        }
      }
      if(previousUnreadMessage != -1){
        vm.tmpContentDivId = previousUnreadMessage;
        this.emailDetailList.messages[vm.tmpContentDivId].isCollapsed = false;
      }
    };

    vm.selectNextUnreadMessage = function(id){
      for(let i = 0; i < vm.emailDetailList.messages.length; i++){
        if(this.emailDetailList.messages[i].flag.indexOf('u') >= 0 && i>id){
            this.emailDetailList.messages[i].isCollapsed = false;
            vm.tmpContentDivId = i;
            return;
        }
      }
    };

    vm.selectFirstUnreadMessage = function(){
      for(let i = 0; i < vm.emailDetailList.messages.length; i++){
        if(this.emailDetailList.messages[i].flag.indexOf('u') >= 0){
            this.emailDetailList.messages[i].isCollapsed = false;
            vm.tmpContentDivId = i;
            return;
        }
      }
    };

    vm.selectLastUnreadMessage = function(){
      let lastConversation = -1;
      for(let i = 0; i < vm.emailDetailList.messages.length; i++){
        if(this.emailDetailList.messages[i].flag.indexOf('u') >= 0){
            lastConversation = i;
        }
      }
      if(lastConversation != -1){
          vm.tmpContentDivId = lastConversation;
          this.emailDetailList.messages[vm.tmpContentDivId].isCollapsed = false;
      }
    };

    vm.selectNextConversation = function(){
      if(vm.tmpContentDivId < this.emailDetailList.messages.length-1){
        vm.tmpContentDivId = vm.tmpContentDivId +1;
      }
      this.emailDetailList.messages[vm.tmpContentDivId].isCollapsed = false;
    };

    vm.selectPreviousConversation = function(){
      if(vm.tmpContentDivId > 0){
        vm.tmpContentDivId = vm.tmpContentDivId - 1;
      }
      this.emailDetailList.messages[vm.tmpContentDivId].isCollapsed = false;
    };

    /* add hotkeys */
    hotkeys.add({
      combo: ['right'],
      callback: function(event) {
        event.preventDefault();
        vm.expandCollapseSingleConversation(vm.tmpContentDivId,true);
      }
    });

    hotkeys.add({
      combo: ['left'],
      callback: function(event) {
        event.preventDefault();
        vm.expandCollapseSingleConversation(vm.tmpContentDivId,false);
      }
    });

    hotkeys.add({
      combo: ['o'],
      callback: function(event) {
        event.preventDefault();
        vm.toggleSingleConversation(vm.tmpContentDivId);
      }
    });

    hotkeys.add({
      combo: ['shift+o'],
      callback: function(event) {
        event.preventDefault();
        vm.expandCollapseAllConversation(false);
      }
    });

    hotkeys.add({
      combo: ['ctrl+o'],
      callback: function(event) {
        event.preventDefault();
        vm.expandCollapseAllConversation(true);
      }
    });

    hotkeys.add({
      combo: ['ctrl+['],
      callback: function(event) {
        event.preventDefault();
        vm.selectPreviousUnreadMessage(vm.tmpContentDivId);
      }
    });

    hotkeys.add({
      combo: ['ctrl+]'],
      callback: function(event) {
        event.preventDefault();
        vm.selectNextUnreadMessage(vm.tmpContentDivId);
        }
    });

    hotkeys.add({
      combo: ['shift+ctrl+['],
      callback: function(event) {
        event.preventDefault();
        vm.selectFirstUnreadMessage();
      }
    });

    hotkeys.add({
      combo: ['shift+ctrl+]'],
      callback: function(event) {
        event.preventDefault();
        vm.selectLastUnreadMessage();
      }
    });

    hotkeys.add({
      combo: ['shift+right'],
      callback: function(event) {
        event.preventDefault();
        vm.selectNextConversation();
      }
    });

    hotkeys.add({
      combo: ['shift+left'],
      callback: function(event) {
        event.preventDefault();
        vm.selectPreviousConversation();
      }
    });

    //////////////////////////////////////   Mails Events   /////////////////////////////////////////
    $scope.$on('event:messageReadUnread', function(event, mail, cond){
      for (var i in vm.emailDetailList.messages){
        if(cond == 'read'){
          vm.emailDetailList.messages[i].flag = vm.emailDetailList.messages[i].flag.replace('u', '');
        }
        else{
          vm.emailDetailList.messages[i].flag += 'u';
        }
      }
    });

    $scope.$on('event:messageFlagUnflag', function(event, mail, cond){
      for (var i in vm.emailDetailList.messages){
        if(cond == 'flag'){
          vm.emailDetailList.messages[i].flag = vm.emailDetailList.messages[i].flag.replace('f', '');
        }
        else{
          vm.emailDetailList.messages[i].flag += 'f';
        }
      }
    });

    $scope.$on('event:messageSpamUnspam', function(e, index, cond){
      if(cond == 'spam') vm.spamMessage(index);
      else vm.unSpamMessage(index);
    });

    // update tags in message
    $scope.$on('event:mail-tag-updated', function(e, data, parentIndex, cond){
      if(cond == 'add') vm.emailDetailList.messages[parentIndex].tags.push(data);
      else if(cond == 'remove') vm.emailDetailList.messages[parentIndex].tags.splice(data, 1);
      else vm.emailDetailList.messages[parentIndex].tags = [];
    });

    $scope.$on('event:moveMsgEvent', function(e, index, emailId, folder) {
        vm.emailDetailList.messages[index].move = true;
        let temp = 0;
        for(let i = 0; i < vm.emailDetailList.messages.length; i++){
          (!(vm.emailDetailList.messages[i].move) || vm.emailDetailList.messages[i].move == false) || temp++;
        }
        if(vm.emailDetailList.messages.length == temp){
          vm.scope.$emit('event:moveEvent', vm.mailKey, vm.mailIndex, folder)
        }
        else {
          // vm.logger.success('1 Message moved to "' + folder.$.name + '"');
        }
    });
    //////////////////////////////////////   Mails Events   /////////////////////////////////////////
  }

   spamMessage(index){
    let vm = this;
    if(vm.state.current.name != 'mail.junk'){
      vm.mailService.markMessageAsSpam(vm.emailDetailList.messages[index].id, function(res, err){
        if(res){
          vm.spamUnspamConversation(index);
          vm.mailHandleService._undoMessage(index, vm.emailDetailList.messages, '1  Message moved to "' + vm.state.current.title + '"', vm.mailFolder);
        }
        else vm.logger.error(err);
      });
    }
  }

  unSpamMessage(index){
    let vm = this;
    vm.mailService.unSpamMessage(vm.emailDetailList.messages[index].id, (res, err) => {
      if (err) vm.logger.error(err.msg);
      else{
        vm.spamUnspamConversation(index);
        // vm.logger.success('1 message marked as not Spam');
      }
    });
  }

  spamUnspamConversation(index){
    let vm = this, temp = 0;
    vm.emailDetailList.messages[index].move = true;
    for(let i = 0; i < vm.emailDetailList.messages.length; i++){
      vm.emailDetailList.messages[i].move && temp++;
    }
    if(vm.emailDetailList.messages.length == temp){
      vm.mailHandleService._publishEvents('event:updateNoOfMails');
      vm.scope.$emit('event:conversationSpamUnspam', vm.mailKey, vm.mailIndex, 'undoSpam', 'message');
    }
  }

  publishEventForUpdateNoOfMails(){
    this.$rootScope.$broadcast('event:updateNoOfMails');
  }

  moveToTrash(){
    this.$rootScope.$broadcast('event:moveToTrash');
  }

  deleteEmail(){
    this.$rootScope.$broadcast('event:deleteEmail');
  }

  /////////////////////////////////////////  Message read unread ////////////////////////////////////////
  markMessageReadAndUnread(e, mail){
    e && e.stopPropagation();
    if(mail.flag.indexOf('u') >= 0){
        this.readMessage(mail);
    }
    else{
      this.unreadMessage(mail);
    }
  }

  readMessage(mail){
    let vm = this;
    vm.mailService.messageMarkAsRead(mail.id, function(res, err){
      if(res){
        mail.flag = mail.flag.replace('u', '');
        vm._emitReadUnreadMail(mail, vm.emailDetailList.messages);
        // vm.logger.success('Message marked as read');
      }
      else vm.logger.error(err);
    })
  }

  unreadMessage(mail){
    let vm = this;
    vm.mailService.messageMarkAsUnread(mail.id, function(res, err){
      if(res){
        mail.flag += 'u';
        vm._emitReadUnreadMail(mail, vm.emailDetailList.messages);
        // vm.logger.success('Message marked as unread');
      }
      else vm.logger.error(err);
    })
  }

  _emitReadUnreadMail(mail, messages){
    let temp = 0;
    for(let i = 0; i < messages.length; i++){
      messages[i].flag.indexOf('u') >= 0 || temp++;
    }
    this.publishEventForUpdateNoOfMails();
    messages.length == temp && this.scope.$emit('event:conversationReadUnread', mail, 'read', this.mailIndex, this.mailKey);
    messages.length == temp || this.scope.$emit('event:conversationReadUnread', mail, 'unRead', this.mailIndex, this.mailKey);
  }
  ///////////////////////////////////////// Message read unread ////////////////////////////////////////

  /////////////////////////////////////////  Message flag UnFlag ////////////////////////////////////////
  markConversationFlagAndUnFlag(e, mail){
    e.stopPropagation();
    let vm = this;
    if((typeof mail) == 'string'){
      mail = JSON.parse(mail);
    }
    if (mail.flag.indexOf('f') >= 0) {
      this.unFlagConversation(mail);
    }
    else {
      this.flagConversation(mail);
    }
  };

  flagConversation(mail){
    let vm = this;
    if (mail.flag.indexOf('f') < 0) {
      vm.mailService.flagEmail(mail.cid, function(res, err){
        if(res){
          mail.flag += 'f';
          vm._emitFlagUnflagMail(mail, vm.emailDetailList.messages);
          // vm.logger.success('1 conversation flagged');
        }
        else vm.logger.error(err);
      })
    }
  }

  unFlagConversation(mail){
    let vm = this;
    if (mail.flag.indexOf('f') >= 0) {
      vm.mailService.unflagEmail(mail.cid, function(res, err){
        if(res){
          mail.flag = mail.flag.replace('f', '');
          vm._emitFlagUnflagMail(mail, vm.emailDetailList.messages);
          // vm.logger.success('1 conversation unflagged');
        }
        else vm.logger.error(err);
      })
    }
  }

  _emitFlagUnflagMail(mail, messages){
    let temp = 0;
    for(let i = 0; i < messages.length; i++){
      messages[i].flag.indexOf('f') >= 0 || temp++;
    }
    messages.length == temp && this.scope.$emit('event:conversationFlagUnflag', mail, 'unflag', this.mailIndex, this.mailKey);
    messages.length == temp || this.scope.$emit('event:conversationFlagUnflag', mail, 'flag', this.mailIndex, this.mailKey);
  }
  /////////////////////////////////////////  Message flag UnFlag ////////////////////////////////////////


  /**
   * Looping through data.mp object for content.
   * @param   {Object}   data    [[Description]]
   * @param   {String} content [[Description]]
   * @returns {[[Type]]} [[Description]]
   */
  _getMimePartEmailObject(data, content) {
    let result = null;

    // Check if the current data is an array.
    if (angular.isArray(data)) {
      for (let i in data) {
        if (data[i] !== undefined) {
          if (content === 'emailContent') {
            result = this._getMimePartEmailObject(data[i], content);

            if (result !== null) {
              return result;
            }
          }

          if (content === 'attachment') {
            let temp = this._getMimePartEmailObject(data[i], content);

            if (result === null) {
              result = [];
            }

            if (temp !== null) {
              result = result.concat(temp);
            }
          }
        }
      }
    }

    if (data) {
      if (data.$) {
        if (content === 'emailContent') {
          if (data.content !== undefined && data.$.ct !== undefined &&
            (data.$.ct === 'text/html' || data.$.ct === 'text/plain')) {
            return data.content;
          }
        }

        if (content === 'attachment' && data.$.cd === 'attachment') {
          if (result === null) {
            result = [];
          }

          result.push(data.$);
        }
      }

      if (data.mp) {
        result = this._getMimePartEmailObject(data.mp, content);
      }
    }
    return result;
  }

  getEmailDetail(messageDetail, index){
    let tos = [];
    let ccs = [];
    let bccs = [];
    let sender = {};

    // contains all email addresses that this email has mentioned about
    let emailAddresses = messageDetail.e;
    if (emailAddresses && emailAddresses.length > 0) {
      for(let i = 0; i < emailAddresses.length; i++){
        let emailAddress = emailAddresses[i];
        switch (emailAddress.$.t) {
          case 'f':
            sender = {
              email: emailAddress.$.a,
              fullName: emailAddress.$.p,
              displayName: emailAddress.$.d
            };
            break;

          case 't':
            tos.push({
              email: emailAddress.$.a,
              fullName: emailAddress.$.p,
              displayName: emailAddress.$.d
            });
            break;
          case 'c':
            ccs.push({
              email: emailAddress.$.a,
              fullName: emailAddress.$.p,
              displayName: emailAddress.$.d
            });
            break;
          case 'b':
            bccs.push({
              email: emailAddress.$.a,
              fullName: emailAddress.$.p,
              displayName: emailAddress.$.d
            });
            break;

          default:
          // resent
        }
      }
    }

    let htmlContent = '';
    let plainContent = '';
    let mimeParts = messageDetail.mp;
    let contentType = '';
    let flag = messageDetail.$.f || '';
    flag = flag.indexOf('u') >= 0 ? flag.replace('u', '') : flag;
    if (mimeParts && mimeParts.mp && mimeParts.mp.length > 0) {
      plainContent = this.getBodyFromMultiPart(mimeParts.mp);
      htmlContent = this.sce.trustAsHtml(plainContent);
      plainContent || (plainContent = messageDetail.fr);
      htmlContent || (htmlContent = messageDetail.fr);
      contentType = 'text/html';
    }
    else{
      plainContent = htmlContent = messageDetail.fr || 'The message has no text content.';
      contentType = 'text/plain';
    }

    this.populateMailToAndCCList(messageDetail, tos, ccs);

    let attachmentList = this._getMimePartEmailObject(messageDetail.mp, 'attachment');
    let emailDetailTempMap = {
      id: messageDetail.$.id,
      cid: messageDetail.$.cid,
      sender: sender,
      subject: messageDetail.su,
      mailTos: tos,
      mailCcTos: ccs,
      mailBccTos: bccs,
      sentDate: messageDetail.$.d,
      resentDate: messageDetail.$.rd,
      headerDate: messageDetail.$.sd,
      content: htmlContent,
      contentType: contentType,
      plainContent: plainContent,
      isCollapsed: index != 0,
      showDetail: false,
      actionType: '',
      mailsToShow: messageDetail.mailsToShow,
      mailsCcShow: messageDetail.mailsCcShow,
      attachmentList: attachmentList,
      apiUrl: this.$rootScope.API_URL,
      flag: flag,
      tags: this.tagService._splitTags(messageDetail.$.tn)
    };
    this.emailDetailList.messages.push(emailDetailTempMap);
  }

  getBodyFromMultiPart(mp) {
    for (let i = 0; i < mp.length; i++) {
      let part = mp[i];
      if (part.$.ct === 'text/html') {
        return part.content;
      }
      if (part.mp && part.mp.length > 0) {
        return this.getBodyFromMultiPart(part.mp);
      }
    }
  }

  populateMailToAndCCList(messageDetail, mailToList, mailCCList) {
    messageDetail.mailsToShow = [];
    messageDetail.mailsCcShow = [];

    // populate data for To list
    if (mailToList.length > 3) {
      for (var i = 0; i < 3; i++) {
        messageDetail.mailsToShow.push(mailToList[i]);
      }
    } else {
      for (var i = 0; i < mailToList.length; i++) {
        messageDetail.mailsToShow.push(mailToList[i]);
      }
    }

    // populate data for CC list
    if (mailCCList.length > 3) {
      for (var i = 0; i < 3; i++) {
        messageDetail.mailsCcShow.push(mailCCList[i]);
      }
    } else {
      for (var i = 0; i < mailCCList.length; i++) {
        messageDetail.mailsCcShow.push(mailCCList[i]);
      }
    }
  }

  showHideDetail(value, index){
    for(let i in this.emailDetailList.messages){
      this.emailDetailList.messages[i].showDetail = false;
    }
    this.emailDetailList.messages[index].showDetail = value
  }

  toggleMail(){
    this.emailDetailList.isCollapsed = !this.emailDetailList.isCollapsed;
    for(let i in this.emailDetailList.messages){
      this.emailDetailList.messages[i].isCollapsed = this.emailDetailList.isCollapsed;
    }
  }

  backToMail() {
    let detailPane = document.querySelector('.email-detail-pane.populated');
    let button = document.querySelector('.back-to-mail');
    detailPane.classList.toggle('show');
    button.classList.toggle('show');
  }

  toggleMessage(index, e){
    //nothing on right click after opening context menu
    if(e && e.target && e.target.hasAttribute('no-right')){
      return;
    }
    this.emailDetailList.messages[index].isCollapsed = !this.emailDetailList.messages[index].isCollapsed;
    let temp = 0;
    for(let i in this.emailDetailList.messages){
      this.emailDetailList.messages[i].isCollapsed && temp++;
    }
    this.emailDetailList.isCollapsed  = this.emailDetailList.messages.length == temp;
    this.tmpContentDivId = index;
  }

  reply() {
    // this.logger.info('reply');
  }

  replyAll() {
    // this.logger.info('replyall');
  }

  forward() {
    // this.logger.info('forward');
  }


  mailTo(sender) {
    this.$rootScope.$broadcast('compose:event', sender);
  }
}

export default MailDetailController;
