import mailComposeTemplate from '../mail.compose/mail.compose.html';
import createFolderTemplate from '../../../common/sidebar/sidebar.folders/create.new.folder/create.new.folder.html';
import mailDeleteTemplate from '../mail.delete/mail.delete.html';
import mailFullScreenTemplate from '../mail.fullscreen/mail.fullscreen.html';
import mailRedirectTemplate from '../mail.redirect/mail.redirect.html';
import createNewTagTemplate from '../../../common/tag/create.new.tag/create.new.tag.html'
import moveConversationTemplate from '../../../common/sidebar/sidebar.folders/move.user.folder/move.user.folder.html';

const LOGGER = new WeakMap();
const UIBMODAL = new WeakMap();
const MDDIALOG = new WeakMap();

class MailListController {
  /*@ngInject*/
  constructor($scope, $timeout, $uibModal, $mdDialog, auth, AUTH_EVENTS, config, logger, mailFilterByDateService, mailHandleService,
              tagService, mailService, moment, vncConstant, $rootScope, $compile, $state, sidebarService, $q, $mdToast){
    // initialization
    let vm = this;
    UIBMODAL.set(this, $uibModal);
    MDDIALOG.set(this, $mdDialog);
    LOGGER.set(this, logger);
    vm.title = 'Mail';
    vm.sender = vm.showBy == 'sender';
    vm.receiver = vm.showBy == 'receiver';
    vm.queryBy = vm.queryBy || vncConstant.SEARCH_CRITERIA.IN_INBOX;
    vm.folderId = vm.folderId || vncConstant.FOLDERID.INBOX;
    vm.ws = new WebSocket(config.SITE_WS);
    vm.mailComposeResolve = {"actionType": "COMPOSE"};
    vm.keys = Object.keys;
    vm.loading = true;

    vm.contactDetail = false;
    vm.sidebarService = sidebarService;
    vm.selectAll = false;
    vm.selectedMails = [];

    // infinite scroll properties
    vm.container = '#emails-list';
    vm.isBusy = false;
    vm.mailComposeTemplate = mailComposeTemplate;
    vm.createFolderTemplate = createFolderTemplate;
    vm.moveConversationTemplate = moveConversationTemplate;
    vm.createNewTagTemplate = createNewTagTemplate;

    //Email properties set
    vm.request = {
      types: 'conversation',
      needExp: 1,
      offset: 0,
      limit: 20,
      query: [vm.queryBy],
      recip: '2',
      sortBy: 'dateDesc',
      fullConversation: 1
    };
    vm.email = {
      infiniteScrollDisabled: false,
      emails: {},
      messagesDetail: [],
      key: '',
      index: '',
      search: ''
    };
    vm.selectedEmail = null; // Track the current selected email for another actions

    // services
    vm.auth = auth;
    vm.state = $state;
    vm.$compile = $compile;
    vm.scope = $scope;
    vm.rootScope = $rootScope;
    vm.mailService = mailService;
    vm.logger = logger;
    vm.timeout = $timeout;
    vm.moment = moment;
    vm.vncConstant = vncConstant;
    vm.$mdToast = $mdToast;
    vm.mailFilterByDateService = mailFilterByDateService;
    vm.mailHandleService = mailHandleService;
    vm.tagService = tagService;
    vm.isTrash = vm.state.current.name != 'mail.trash';
    vm.currentLenght = 10;
    vm.onScroll = function (scrollTop, scrollHeight) {
      if(scrollTop > (scrollHeight - 200) && !vm.isBusy){
        vm.getPreviousUnreadEmails()
      }
    };

    activate();

    function activate() {
      let promises = [tagService._getTagList()];
      return $q.all(promises).then(() => {
        vm.getPreviousUnreadEmails();
      });
    }

    $scope.$on(AUTH_EVENTS.loginSuccess, (event, msg) => {
      vm.auth = auth;
      vm.ws.send(vm.auth.user.name + ' logged in');
    });

    // listen compose button click
    $scope.$on('compose:event',function(e, sender){
      vm.mailComposeResolve  = (sender) ?  {"actionType": "COMPOSE" , "sender" : sender} : {"actionType": "COMPOSE"} ;
      $timeout(function() {
        // trigger click event to open mail compose modal
        angular.element('#mail-compose').find('#modal').trigger('click');
        vm.mailComposeResolve = {"actionType": "COMPOSE"};
      }, 100);
    });

    //////////////////////////////////////   Select Multiple or All   /////////////////////////////////////

    vm.markMultiple = ( key, index ) => {
      let id = vm.email.emails[key][index].cid;
      if( vm.selectedMails && vm.selectedMails.includes(id) ){
        vm.selectedMails.splice( vm.selectedMails.indexOf(id) , 1)
      }
      else{
        vm.selectedMails.push( id );
      }
    };
    vm.markAll =  () => {
      vm.selectedMails = [];
      let flag = !vm.selectAll;
      angular.forEach(vm.email.emails, function ( index, key ) {
        angular.forEach(index, function ( mail ) {
          mail.selected = !vm.selectAll;
          flag && vm.selectedMails.push( mail.cid );
        });
      });
    };

    vm.makeMultiFunction = (cond, tag) =>{
      let count = vm.selectedMails.length,
          mails = vm.selectedMails.join(",");
      switch( cond ){
        case 'spam': {
          vm.mailService.markConversationAsSpam( mails, function(res, err){
            if(res){
              vm.mailHandleService._publishEvents('folder-added');
              // vm.logger.success( count + ' Conversation marked as Spam');
              vm.selectedMails = [];
            }
            else vm.logger.error(err.msg);
          });
          break;
        }
        case 'delete': {
          vm.mailService.moveEmailToTrash( mails, function(res, err){
            if(res){
              vm.mailHandleService._publishEvents('folder-added');
              // vm.logger.success( count+' Conversation moved to Trash');
              vm.selectedMails = [];
            }
            else vm.logger.error(err);
          });
          break;
        }
        case 'tag': {
          vm.mailService.assignTagToConversation(mails, tag.$.name, (res, err) => {
            if (err) {
              vm.logger.error(err.msg);
            }
            else {
              vm.selectedMails = [];
              // vm.logger.success( count+' Conversation tagged "' + tag.$.name + '"');
            }
          });
          break;
        }
        case 'remove-tag': {
            vm.mailService.removeAllTagInConversation(mails, (res, err) => {
              if (err) {
                logger.error(err.msg);
              }
              else {
                vm.selectedMails = [];
                // vm.logger.success('All Tags removed successfully.');
              }
            });
          break;
        }
      }
      vm.autoRefresh();
    };

    //////////////////////////////////////   Mail sort feature   /////////////////////////////////////
    vm.searchOptions = {
      show: false,   // show hide menu
      size: 'sm',    // size of menu lg, md, sm (Optional)
      items: [
        {
          name: 'Received',   // name of item
          type: 'function',
          itemFunction: function(){
            sortAction(this, 'fa fa-check', 'sort-actions', 'sort-actions-icon');
          },
          itemClass: 'sort-actions'
        },
        {
          name: 'Sent',   // name of item
          type: 'function',
          itemFunction: function(){
            sortAction(this, 'fa fa-check', 'sort-actions menu-border', 'sort-actions-icon menu-border');
          },
          itemClass: 'sort-actions menu-border'
        },
        {
          name: 'Sort by'
        },
        {
          name: 'Attachment',
          type: 'function',
          icon: isInQueryArray(vncConstant.SEARCH_CRITERIA.HAS_ATTACHMENT),
          itemFunction: function(){
            sortAction(this, 'fa fa-check', 'sort-actions', 'sort-actions-icon',
              vncConstant.SEARCH_CRITERIA.HAS_ATTACHMENT);
          },
          itemClass: 'sort-actions'
        },
        {
          name: 'Date',
          type: 'function',
          icon: isInQueryArray(vncConstant.SEARCH_CRITERIA.ON_DATE),
          itemFunction: function(){
            sortAction(this, 'fa fa-check', 'sort-actions', 'sort-actions-icon',vncConstant.SEARCH_CRITERIA.ON_DATE);
          },
          itemClass: 'sort-actions',
          child: [
            {
              name: 'Newest first',   // name of item
              type: 'function',
              itemFunction: function(){
                sortAction(this, 'fa fa-check', 'sort-actions', 'sort-actions-icon');
              },
              itemClass: 'sort-actions'
            },
            {
              name: 'Oldest first',   // name of item
              type: 'function',
              itemFunction: function(){
                sortAction(this, 'fa fa-check', 'sort-actions', 'sort-actions-icon');
              },
              itemClass: 'sort-actions'
            }
          ]
        },
        {
          name: 'Receiver',
          type: 'function',
          icon: isInQueryArray(vncConstant.SEARCH_CRITERIA.TO),
          itemFunction: function(){
            sortAction(this, 'fa fa-check', 'sort-actions', 'sort-actions-icon', vncConstant.SEARCH_CRITERIA.TO);
          },
          itemClass: 'sort-actions'
        },
        {
          name: 'Sender',
          type: 'function',
          icon: isInQueryArray(vncConstant.SEARCH_CRITERIA.FROM),
          itemFunction: function(){
            sortAction(this, 'fa fa-check', 'sort-actions', 'sort-actions-icon', vncConstant.SEARCH_CRITERIA.FROM);
          },
          itemClass: 'sort-actions'
        },
        {
          name: 'Size',
          type: 'function',
          itemFunction: function(){
            sortAction(this, 'fa fa-check', 'sort-actions', 'sort-actions-icon');
          },
          itemClass: 'sort-actions'
        },
        {
          name: 'Tags',
          type: 'function',
          itemFunction: function(){
            sortAction(this, 'fa fa-check', 'sort-actions', 'sort-actions-icon');
          },
          itemClass: 'sort-actions'
        },
        {
          name: 'Subject',
          type: 'function',
          icon: isInQueryArray(vncConstant.SEARCH_CRITERIA.SUBJECT),
          itemFunction: function(){
            sortAction(this, 'fa fa-check', 'sort-actions', 'sort-actions-icon',vncConstant.SEARCH_CRITERIA.SUBJECT);
          },
          itemClass: 'sort-actions'
        },
        {
          name: 'Unread',
          type: 'function',
          icon: isInQueryArray(vncConstant.SEARCH_CRITERIA.IS_UNREAD),
          itemFunction: function(){
            sortAction(this, 'fa fa-check', 'sort-actions menu-border', 'sort-actions-icon menu-border',
              vncConstant.SEARCH_CRITERIA.IS_UNREAD);
          },
          itemClass: 'sort-actions menu-border'
        },
        {
          name: 'Save this search',
          icon: 'fa fa-save',
          itemClass: 'sort-actions-icon'
        }

      ]
    };

    function sortAction( self, icon, itemClassBefore, itemClassAfter, action ){
      if(!!self.icon){
        self.icon = '';
        self.itemClass = itemClassBefore;
        vm.request.query.splice(vm.request.query.indexOf(action));
        onSearch();
      }
      else {
        self.icon = icon;
        self.itemClass = itemClassAfter;
        vm.request.query.push(action);
        onSearch();
      }
    }

    function onSearch(){
      vm.email.infiniteScrollDisabled = true;
      if(vm.request.query.indexOf(vm.queryBy) < 0){
        vm.request.query.unshift(vm.queryBy);
      }
      vm.request.offset = 0;
      vm.request.limit = 100;
      vm.getPreviousUnreadEmails();
    }

    function isInQueryArray(action){
      if(vm.request.query.indexOf(action) >= 0){
        return 'fa fa-check';
      }
      else return '';
    }

    $scope.$on('search', function(e, search){
      if(!!search){
        if(vm.request.query.indexOf(vm.queryBy) >= 0){
          vm.request.query.splice(vm.request.query.indexOf(vm.queryBy));
        }
        if(vm.request.query.indexOf(vm.email.search) >= 0){
          vm.request.query.splice(vm.request.query.indexOf(vm.email.search));
        }
        vm.email.search = search;
        vm.request.query.push(search);
        onSearch();
      }
      else{
        vm.refreshMails();
      }
    });

      $scope.emailSortingType = 'date';
      $scope.reverse = true;
      $scope.sortemail = function(emailSortingType) {
             $scope.reverse = ($scope.emailSortingType === emailSortingType) ? !$scope.reverse : false;
             $scope.emailSortingType = emailSortingType;
      };

    //////////////////////////////////////   Mail sort feature   /////////////////////////////////////

    //////////////////////////////////////   Mails Events   /////////////////////////////////////////
    $scope.$on('event:conversationReadUnread', function(event, mail, cond, index, key){
      if (cond == 'read') {
        vm.email.emails[key][index].flag = vm.email.emails[key][index].flag.replace('u', '');
      }
      else {
        (vm.email.emails[key][index].flag.indexOf('u') >= 0) || (vm.email.emails[key][index].flag += 'u');
      }
    });

    $scope.$on('event:conversationFlagUnflag', function(event, mail, cond, index, key){
      if (cond == 'flag') {
        (vm.email.emails[key][index].flag.indexOf('f') >= 0) || (vm.email.emails[key][index].flag += 'f');
      }
      else {
        vm.email.emails[key][index].flag = vm.email.emails[key][index].flag.replace('f', '');
      }
    });

    $scope.$on('event:conversationSpamUnspam', function(e, key, index, cond, isMessage){
      if(cond == 'spam') vm.spamConversation(key, index, isMessage);
      else vm.unSpamConversation(key, index, isMessage);
    });

    $scope.$on('event:contextMenu', function(e, mail, cond, d, index){
      if(cond == 'f') vm.markConversationFlagAndUnFlag(e, mail);
      else if(cond == 'u') vm.markConversationReadAndUnread(e, mail, d, index);
    });

    $scope.$on('event:contextMenuRedirect', function(e, id){
      vm.redirectMail(id);
    });

    $scope.$on('event:moveEvent', function(e, key, index, folder){
      vm.moveEmail(key, index, folder)
    });

    $scope.$on('event:moveToTrash', function(e, msg){
      vm.moveToTrash();
    });

    $scope.$on('event:deleteEmail', function(e, msg){
      vm.moveToTrash();
    });

    $scope.$on('event:conversationTag', function(e, msg){
      vm.autoRefresh();
    });

    $scope.$on('event:markAllAsRead', function(e, folderName){
      if( folderName && String(folderName).toLowerCase() == vm.currentFolder.toLowerCase()) {
        vm.markAllAsRead();
      }
    });

    $scope.$on('event:moveMultipleEvent', function(e, folderName){
      let count = vm.selectedMails.length;
      vm.selectedMails = [];
      vm.autoRefresh();
      // vm.logger.success( count + ' Conversation moved to ' + folderName);
    });

    $rootScope.$on('tag-added', function(){
      vm.tagService._getTagList()
    })
  }
  ////////////////////////////////////////////   Mails Events   ///////////////////////////////////////////////

  /////////////////////////////////////////   conversation read unread ////////////////////////////////////////
  markConversationReadAndUnread(e, mail, key, index, cb){
    e && e.stopPropagation();
    if (mail.flag.indexOf('u') >= 0) {
      this.readConversation(mail, key, index, cb);
    }
    else {
      this.unreadConversation(mail, key, index, cb);
    }
  };

  readConversation(mail, key, index, cb){
    let vm = this;
    if (mail.flag.indexOf('u') >= 0) {
      vm.mailService.conversationMarkAsRead(mail.cid, function (res, err) {
        if (res) {
          mail.flag = mail.flag.replace('u', '');
          // vm.logger.success('Mail marked as read');
          vm.email.key == key && vm.email.index == index && vm.scope.$broadcast('event:messageReadUnread', mail, 'read');
          vm.mailHandleService._publishEvents('event:updateNoOfMails');
          cb && cb();
        }
        else vm.logger.error(err);
      })
    }
    else cb && cb();
  }

  unreadConversation(mail, key, index, cb){
    let vm = this;
    if (mail.flag.indexOf('u') < 0) {
      vm.mailService.conversationMarkAsUnread(mail.cid, function (res, err) {
        if (res) {
          mail.flag += 'u';
          // vm.logger.success('Mail marked as unread');
          vm.email.key == key && vm.email.index == index && vm.scope.$broadcast('event:messageReadUnread', mail, 'unRead');
          vm.mailHandleService._publishEvents('event:updateNoOfMails');
          cb && cb();
        }
        else vm.logger.error(err);
      })
    }
    else cb && cb();
  }
  /////////////////////////////////////////   conversation read unread ////////////////////////////////////////

  /////////////////////////////////////////   conversation flag unFlag ////////////////////////////////////////
  markConversationFlagAndUnFlag(e, mail, key, index){
    e && e.stopPropagation();
    let vm = this;
    if((typeof mail) == 'string'){
      mail = JSON.parse(mail);
    }
    if (mail.flag.indexOf('f') >= 0) {
      this.unFlagConversation(mail, key, index);
    }
    else {
      this.flagConversation(mail, key, index);
    }
  };

  flagConversation(mail, key, index){
    let vm = this;
    if (mail.flag.indexOf('f') < 0) {
      vm.mailService.flagEmail(mail.cid, function(res, err){
        if(res){
          mail.flag += 'f';
          vm.email.key == key && vm.email.index == index && vm.scope.$broadcast('event:messageFlagUnflag', mail, 'unflag');
          // vm.logger.success('1 conversation flagged');
        }
        else vm.logger.error(err.msg);
      })
    }
  }

  unFlagConversation(mail, key, index){
    let vm = this;
    if (mail.flag.indexOf('f') >= 0) {
      vm.mailService.unflagEmail(mail.cid, function(res, err){
        if(res){
          mail.flag = mail.flag.replace('f', '');
          vm.email.key == key && vm.email.index == index && vm.scope.$broadcast('event:messageFlagUnflag', mail, 'flag');
          // vm.logger.success('1 conversation unflagged');
        }
        else vm.logger.error(err.msg);
      })
    }
  }
  /////////////////////////////////////////   conversation flag unFlag ////////////////////////////////////////

  /////////////////////////////////////////    Spam UnSpam Conversation ////////////////////////////////////////
  spamConversation(key, index, isMessage){
    let vm = this;
    if(isMessage == 'message') vm.email.emails[key][index].move = true;
    else{
      vm.undoKey = key;
      vm.undoIndex = index;
      if(vm.state.current.name != 'mail.junk'){
        vm.email.emails[key][index].move = true;
        vm.mailService.markConversationAsSpam(vm.email.emails[key][index].cid, function(res, err){
          if(res){
            vm.mailHandleService._publishEvents('event:updateNoOfMails');
            vm._checkAndGetEmailDetail(1, key, index);
            vm.mailHandleService._undoMail(vm.undoKey, vm.undoIndex, vm.email, '1 Conversation marked as Spam ', vm.folderId);
          }
          else vm.logger.error(err);
        });
      }
    }
  }

  unSpamConversation(key, index, isMessage){
    let vm = this;
    if(isMessage == 'message') vm.email.emails[key][index].move = true;
    else {
      vm.mailService.unSpamConversation(vm.email.emails[key][index].cid, (res, err) => {
        if (err) vm.logger.error(err.msg);
        else {
          vm.mailHandleService._publishEvents('event:updateNoOfMails');
          vm.email.emails[key][index].move = true;
          // vm.logger.success('1 conversation marked as not Spam');
        }
      });
    }
  }
  /////////////////////////////////////////     Spam UnSpam Conversation ////////////////////////////////////////

  getPreviousUnreadEmails(refresh) {
    this.isBusy = true;
    this.loading = true;
    let request = {
      'query': this.request.query.join(' '),
      'limit': this.request.limit,
      'types': this.request.types,
      'offset': this.request.offset,
      'fullConversation': this.request.fullConversation,
      'needExp': this.request.needExp,
      'sortBy': this.request.sortBy,
      'recip': this.request.recip
    };

    this.mailService.getEmailList(request, (rawEmails) => {
      if (angular.isDefined(rawEmails) && angular.isArray(rawEmails)) {
        this.request.offset += rawEmails.length;
        this.currentLenght += rawEmails.length;
        this.handleRawEmails(rawEmails, refresh);
      }
    }).catch((error) => {
      !this.email.infiniteScrollDisabled && (this.isBusy = false);
      this.loading = false;
      this.logger.error(error.msg);
    });
  }

  handleRawEmails(rawEmails, refresh) {
    let vm = this;
    let normalizedEmails = vm.mailHandleService._normalizeUnreadEmails(rawEmails);
    // Sorts mails, only sorts if there are mails
    if(refresh || vm.email.infiniteScrollDisabled){
      vm.email.emails = {};
      vm.email.messagesDetail = [];
      vm.email.key = '';
      vm.email.index = '';
    }
    vm.mailFilterByDateService.filterByDate(vm.email.emails, normalizedEmails, vm.email.infiniteScrollDisabled, function(mails){
      vm.email.emails = mails;
      vm.loading = false;
      !vm.email.infiniteScrollDisabled && (vm.isBusy = false);
    });
  }

  getEmailDetail(mail, key, index, e, fullScreen ){
    let vm = this;
    //nothing on right click after opening context menu
    if(e && e.target && e.target.hasAttribute('no-right')){
      return;
    }

    if(vm.email.key != key || vm.email.index != index){
      vm.contextMenuConversationId = mail.cid;
      this.mailHandleService._getEmailDetail(mail, function(messagesDetail) {
        if(messagesDetail){
          emailDetail:
            for (let i in vm.email.emails) {
              for (let j = 0; j < vm.email.emails[i].length; j++) {
                if (vm.email.emails[i][j].isCollapse) {
                  for (let k in vm.email.emails[i][j].messages) {
                    vm.email.emails[i][j].messages[k].active = false;
                    (index != j) && (vm.email.emails[i][j].isCollapse = false);
                  }
                  break emailDetail;
                }
              }
            }

          vm.email.messagesDetail = [];
          vm.email.key = '';
          vm.email.index = '';
          vm.timeout(function () {
            vm.readConversation(mail, key, index, function(){
              vm.email.messagesDetail = messagesDetail;
              vm.email.key = key;
              vm.email.index = index;
              vm.email.emails[key][index].flag = vm.email.emails[key][index].flag.replace('u', '');
              nextLoop:
                for (let i in vm.email.emails) {
                  for (let j = 0; j < vm.email.emails[i].length; j++) {
                    if (vm.email.emails[i][j].active) {
                      vm.email.emails[i][j].active = false;
                      break nextLoop;
                    }
                  }
                }
              vm.email.emails[key][index].active = true;
              fullScreen && vm.fullScreen();
            });
          });
        }
      })
    }
    else{
      fullScreen && vm.fullScreen();
    }
    // Toggle back buttona and email detail veiw for mobile
    let detailPane = document.querySelector('.email-detail-pane.populated');
    let button = document.querySelector('.back-to-mail');
    detailPane && detailPane.classList.toggle('show');
    button && button.classList.toggle('show');
  }

  getMessageDetail(detail, key, parentIndex, index, e, mail){
    let vm = this;
    vm.selectedEmail = detail;
    vm.mailHandleService._getMessageDetail(detail, key, parentIndex, index, e, function(messagesDetail){
      if(messagesDetail){
        vm.email.messagesDetail = [];
        vm.timeout(function() {
          vm.readConversation(mail, key, index, function () {
            angular.isArray(messagesDetail) || (messagesDetail = [messagesDetail]);
            vm.email.messagesDetail = messagesDetail;
            vm.email.emails[key][index].flag = vm.email.emails[key][index].flag.replace('u', '');
            vm.email.emails[key][parentIndex].active = false;
            for (let i in vm.email.emails[key][parentIndex].messages) {
              vm.email.emails[key][parentIndex].messages[i].active = index == i;
            }
          });
        })
      }
    });
  }

  refreshMails(){
    this.request.offset = 0;
    this.email.messagesDetail = [];
    this.email.infiniteScrollDisabled = false;
    this.request.query = [this.queryBy];
    this.request.limit = 10;
    this.getPreviousUnreadEmails(true);
    this.mailHandleService._publishEvents('event:updateNoOfMails');
    this.mailService.noOp({}, function(res){
      console.log('res');
      console.log(res);
    });
  }

  /////////////////////////////////////////    collapse of mails ////////////////////////////////////////
  setCollapseOfMailConversation(value, key, index, e){
    e.stopPropagation();
    let vm = this;
    if(vm.email.emails[key][index].messages.length){
      vm.setCollapse(value, key, index);
    }
    else{
      this.mailHandleService._getEmailConversationDetail(vm.email.emails[key][index].cid, function(detail){
        if(detail){
          vm.email.emails[key][index].messages = detail;
          vm.setCollapse(value, key, index);
        }
      });
    }
  }

  setCollapse( value, key, index ){
    let vm = this;
    if(!value) {
      emailDetail:
        for(let i in vm.email.emails){
          for(let j = 0; j < vm.email.emails[i].length; j++){
            if(vm.email.emails[i][j].isCollapse){
              for(let k in vm.email.emails[i][j].messages){
                vm.email.emails[i][j].messages[k].active = false;
              }
              vm.email.emails[i][j].isCollapse = false;
              vm.email.emails[i][j].active = false;
              break emailDetail;
            }
            else vm.email.emails[i][j].active = false;
          }
        }
    }
    else{
      for(let k in vm.email.emails[key][index].messages){
        vm.email.emails[key][index].messages[k].active = false;
      }
    }
    vm.email.emails[key][index].isCollapse = !value;
  }
  /////////////////////////////////////////    collapse of mails ////////////////////////////////////////

  moveToTrash(key, index){
    let vm = this;
    vm.undoKey = angular.isDefined(key) ? key : vm.email.key;
    vm.undoIndex = angular.isDefined(index) ? index : vm.email.index;
    if(vm.state.current.name != 'mail.trash'){
      vm.email.emails[vm.undoKey][vm.undoIndex].move = true;
      vm.mailService.moveEmailToTrash(vm.email.emails[vm.undoKey][vm.undoIndex].cid, function(res, err){
        if(res){
          vm.mailHandleService._publishEvents('event:updateNoOfMails');
          vm._checkAndGetEmailDetail(1, key, index);
          vm.mailHandleService._undoDeletedMail(vm.undoKey, vm.undoIndex, vm.email, '1 Conversations moved to Trash ', vm.folderId);
        }
        else vm.logger.error(err);
      });
    }
  }

  moveEmail(key, index, folder){
    let vm = this;
    vm.undoKey = key;
    vm.undoIndex = index;
    vm.email.emails[key][index].move = true;
    // vm.logger.success('1 Conversation moved to "' + folder.$.name + '"');
  }

  _checkAndGetEmailDetail(value, key, index){
    let vm = this;
    if(angular.isDefined(key) && angular.isDefined(index)){
      if(vm.email.key == key && vm.email.index != index) return;   // if current mail not selected
      else{
        vm.email.key = key;
        vm.email.index = index;
      }
    }
    if(vm.email.emails[vm.email.key] && vm.email.emails[vm.email.key].length > (vm.email.index + value)){
      vm.getEmailDetail(vm.email.emails[vm.email.key][vm.email.index + value], vm.email.key, vm.email.index + value)
    }
    else{
      let keys = Object.keys(vm.email.emails);
      vm.getEmailDetail(vm.email.emails[keys[keys.indexOf(vm.email.key) + 1]][0], keys[keys.indexOf(vm.email.key) + 1], 0)
    }
  }

  fullScreen() {
    let vm = this;
    MDDIALOG.get(this).show({
      escapeToClose: false,
      fullscreen: true,
      template: mailFullScreenTemplate,
      controller: 'MailFullScreenController',
      controllerAs: 'vm',
      bindToController: true,
      resolve: {
        index: function(){
          return vm.email.index;
        },
        key: function(){
          return vm.email.key;
        },
        detail: function(){
          return vm.email.messagesDetail;
        },
        folderId: function(){
          return vm.folderId
        }
      }
    }).then(() => {
      vm.email.emails[vm.email.key].splice(vm.email.index, 1);
      vm._checkAndGetEmailDetail(0);
    });
  }

  deleteEmail() {
    let vm = this;

    let modalInstance = UIBMODAL.get(this).open({
      animation: true,
      template: mailDeleteTemplate,
      controller: 'MailDeleteController',
      controllerAs: 'vm',
      bindToController: true,
      backdrop: 'static',
      keyboard: true,
      backdropClick: true,
      size: 'md',
      resolve: {
        id: function(){
          return vm.email.emails[vm.email.key][vm.email.index].cid;
        },
        isTrash: function(){
          return vm.isTrash;
        }
      }
    });

    modalInstance.result.then(() => {
      vm.mailHandleService._publishEvents('event:updateNoOfMails');
      vm.email.emails[vm.email.key].splice(vm.email.index, 1);
      vm._checkAndGetEmailDetail(0);
    });
  }

  moveMultipleConversations() {
    let vm = this;
    MDDIALOG.get(this).show({
      escapeToClose: false,
      fullscreen: true,
      template: moveConversationTemplate,
      controller: 'MoveConversationController',
      controllerAs: 'vm',
      bindToController: true,
      resolve: {
        data: function () {
          return {
            multiple : true,
            type : 'Email',
            emailId : vm.selectedMails.join(",")
          };
        }
      }
    });
  }

  redirectMail(id) {
    let vm = this;
    MDDIALOG.get(this).show({
      controller: 'MailRedirectController',
      controllerAs: 'vm',
      bindToController: true,
      template: mailRedirectTemplate,
      escapeToClose: false,
      fullscreen: true,
      resolve: {
        id: function(){
          return id;
        }
      }
    })
  }

  markAllAsRead (){
    let vm = this;
    for (var i in vm.email.emails){
      for (var j = 0; j < vm.email.emails[i].length; j++){
        vm.email.emails[i][j].flag = vm.email.emails[i][j].flag.replace('u', '');
      }
    }
  }

  //autoRefresh after tagging
  autoRefresh(){
    this.request.offset = 0;
    this.email.messagesDetail = [];
    this.email.infiniteScrollDisabled = false;
    this.request.query = [this.queryBy];
    this.request.limit = this.currentLenght;
    this.getPreviousUnreadEmails(true);
  }

  tagConversation(mail, index) {
    let vm = this;
    MDDIALOG.get(this).show({
      controller: 'CreateNewTagController',
      controllerAs: 'vm',
      bindToController: true,
      template: createNewTagTemplate,
      escapeToClose: false,
      fullscreen: true
    })
    .then((res) => {
        vm.tagService.tagConversation(mail, res.tag, index);
      });
  }

  tagMultipleConversation(mailArray, index) {
    let vm = this;
    MDDIALOG.get(this).show({
      controller: 'CreateNewTagController',
      controllerAs: 'vm',
      bindToController: true,
      template: createNewTagTemplate,
      escapeToClose: false,
      fullscreen: true
    })
      .then((res) => {
        vm.tagService.tagConversations(mailArray, res.tag, index);
      });
  }
}

export default MailListController;
