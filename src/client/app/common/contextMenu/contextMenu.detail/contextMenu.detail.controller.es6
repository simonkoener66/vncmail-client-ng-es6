import createNewTagTemplate from '../../tag/create.new.tag/create.new.tag.html';
import createNewTagController from '../../tag/create.new.tag/create.new.tag.controller';

import deleteTemplate from './contextMenu.detail.deleteModal.html';
import renameTemplate from './contextMenu.detail.renameModal.html';
import selectColorTemplate from './contextMenu.detail.selectColor.html';

import calendarTemplate from '../../sidebar/sidebar.folders/create.new.folder/calendar/calendar.html';
import calendarController from '../../sidebar/sidebar.folders/create.new.folder/calendar/calendar.controller';

import shareFolderTemplate from '../../sidebar/sidebar.folders/share.folder.modal/share.folder.modal.html';
import shareFolderController from '../../sidebar/sidebar.folders/share.folder.modal/share.folder.modal.controller';

import cancelAppointmentTemplate from './contextMenu.detail.cancelAppointment.html';
import cancelAppointmentSeriesTemplate from './contextMenu.detail.cancelAppointmentSeries.html';
import cancelAppointmentController from './extends/cancelAppointment.controller.es6';

import emptyTrashTemplate from './contextMenu.detail.emptyTrashModal.html';
import moveConversationTemplate from './../../../common/sidebar/sidebar.folders/move.user.folder/move.user.folder.html';
import moveConversationController from './../../../common/sidebar/sidebar.folders/move.user.folder/move.user.folder.controller.es6';

import TagContextMenu from './extends/tagContextMenu.controller.es6';

const UIBMODAL = new WeakMap();
const MDDIALOG = new WeakMap();
const LOGGER = new WeakMap();
const SIDEBARSERVICE = new WeakMap();
const STATE = new WeakMap();
const ROOTSCOPE = new WeakMap();

class ContextMenuDetailController {
  /* @ngInject */
  constructor($uibModal, $mdDialog, $q, $scope, $state, $rootScope, $timeout, logger, mailHandleService, tagService, mailService,
               sidebarService, vncConstant,$window) {
    LOGGER.set(this, logger);
    SIDEBARSERVICE.set(this, sidebarService);
    UIBMODAL.set(this, $uibModal);
    MDDIALOG.set(this, $mdDialog);
    STATE.set(this, $state);
    ROOTSCOPE.set(this, $rootScope);

    this.q = $q;
    this.rootScope = $rootScope;
    this.scope = $scope;
    this.timeout = $timeout;
    this.logger = logger;
    this.mailService = mailService;
    this.sidebarService = sidebarService;
    this.vncConstant = vncConstant;
    this.mailHandleService = mailHandleService;
    this.tagService = tagService;
    this.$ = angular.element;
    this.window = $window;

    this.calendarId = $scope.calendarId;
    this.calendarParentId = $scope.calendarParentId;
    this.calendarName = $scope.calendarName;
    this.contextMenuType = $scope.contextMenuType;
    this.contextMenuPosition = $scope.contextMenuPosition;
    this.contextMenuContactId = $scope.contextMenuContactId;
    this.contextMenuConversation = $scope.contextMenuConversation;
    this.contextMenuMailD = $scope.contextMenuMailD;
    this.contextMenuMailIndex = $scope.contextMenuMailIndex;
    this.contextMenuContactTags = $scope.contextMenuContactTags;
    this.contextMenuCalendarViewType = $scope.contextMenuCalendarViewType;
    this.contextMenuCalendarDate = $scope.contextMenuCalendarDate;
    this.contextMenuAppointmentDetail = $scope.contextMenuAppointmentDetail;
    this.tagId = $scope.tagId;
    this.tagName = $scope.tagName;

    this.contextMenuTypeAllowGettingTagList = ['contactItem', 'appointmentItem', 'mailItem'];
    this.tagList = [];
    this.tagAddedInContact = [];
    this.tagAddedInAppointment = [];
    this.contextSubMenuStyle = {};

    this.activate();

    //$rootScope.$on('tag-contact-dropped', (event, args) => {
    //  let tagName = '', contactId = '';
    //  this.tagContact(tagName, contactId);
    //});

    let onContextItemRepeatPostBack = $scope.$on('contextItemRepeatFinished', (event) => {
      event.stopPropagation();

      let $contextMenu = this.$('.context-menu-list'),
        contextMenuHeight = $contextMenu.prop('clientHeight'),
        contextMenuWidth = $contextMenu.prop('clientWidth'),
        bodyHeight = this.$('body').prop('clientHeight'),
        bodyWidth = this.$('body').prop('clientWidth'),
        offsetTop = parseInt(this.contextMenuPosition.top),
        offsetLeft = parseInt(this.contextMenuPosition.left),
        newOffsetTop = offsetTop,
        newOffsetLeft = offsetLeft;

      if (offsetTop + contextMenuHeight > bodyHeight) {
        newOffsetTop = bodyHeight - contextMenuHeight - 10;
      }

      if (offsetLeft + contextMenuWidth > bodyWidth) {
        newOffsetLeft = bodyWidth - contextMenuWidth - 10;
      }

      this.contextMenuPosition.top = newOffsetTop + 'px';
      this.contextMenuPosition.left = newOffsetLeft + 'px';

      // destroy event
      onContextItemRepeatPostBack();
    });
  }

  activate() {
    this.q.all([this.getTagList(), this.getTagInTargetItem()])
      .then(() => {
        this.contextListItems = this.generateContextMenuListItems();
      })
      .finally(() => {
        // TODO: For checking data / clear cache / reset data if needed.
      });
  }

  getTagList() {
    if (this.contextMenuTypeAllowGettingTagList.indexOf(this.contextMenuType) !== -1) {
      let eventName;

      switch (this.contextMenuType) {
        case 'appointmentItem':
          eventName = 'add-tag-appointment';
          break;
        case 'contactItem':
          eventName = 'add-tag-contact';
          break;
        case 'mailItem':
          eventName = 'add-tag-conversation';
          break;
      }

      let tagList = localStorage.getItem('tagList');

      if (tagList) {
        this.tagListRaw = JSON.parse(tagList);
        this.tagList = this.generateContextItemListForTagData(JSON.parse(tagList), eventName);
      }
      else {
        return this.sidebarService.getTag({}, (tags, err) => {
          if (tags) {
            this.tagList = this.generateContextItemListForTagData(tags, eventName);

            // Save new tags list to localStorage
            localStorage.setItem('tagList', JSON.stringify(tags));
          }
        });
      }
    }
  }

  getTagInTargetItem() {
    if (this.contextMenuTypeAllowGettingTagList.indexOf(this.contextMenuType) !== -1) {
      switch (this.contextMenuType) {
        case 'appointmentItem':
          if (angular.isDefined(this.contextMenuAppointmentDetail) &&
              angular.isDefined(this.contextMenuAppointmentDetail.tags) &&
              this.contextMenuAppointmentDetail.tags.length > 0) {
            let contextMenuAppointmentTags = this.contextMenuAppointmentDetail.tags;
            this.tagAddedInAppointment = this.generateContextItemListForTagData(contextMenuAppointmentTags, 'remove-tag-appointment');
          }
          break;
        case 'contactItem':
          if (angular.isDefined(this.contextMenuContactId) &&
            angular.isDefined(this.contextMenuContactTags)) {
            let contextMenuContactTags = JSON.parse(this.contextMenuContactTags);
            this.tagAddedInContact = this.generateContextItemListForTagData(contextMenuContactTags, 'remove-tag-contact');
          }
          break;
        case 'mailItem':
          if (angular.isDefined(this.contextMenuContactId) &&
            angular.isDefined(this.contextMenuContactTags)) {
            let contextMenuContactTags = JSON.parse(this.contextMenuContactTags);
            this.tagAddedInContact = this.generateContextItemListForTagData(contextMenuContactTags, 'remove-tag-conversation');
          }
          break;
      }
    }
  }

  generalContextItemEvent(contextItem) {
    switch (contextItem.eventName) {
      case 'received-from-contact':
        // this.logger.info('This feature is not available now.');
        break;
      case 'sent-to-contact':
        // this.logger.info('This feature is not available now.');
        break;
      case 'new-email':
        // this.logger.info('This feature is not available now.');
        break;
      case 'edit-contact':
        // this.logger.info('This feature is not available now.');
        break;
      case 'forward-contact':
        // this.logger.info('This feature is not available now.');
        break;
      case 'redirect-mail':
        // this.redirectConversation(this.contextMenuConversation);
        break;
      case 'new-contact-group':
        // this.logger.info('This feature is not available now.');
        break;
      case 'new-tag':
        this.addNewTag();
        break;
      case 'new-tag-for-contact':
        this.addNewTag(this.contextMenuContactId);
        break;
      case 'add-tag-contact':
        this.addNewTagToContact(this.contextMenuContactId, contextItem.text);
        break;
      case 'remove-tag-contact':
        this.removeTagInContact(this.contextMenuContactId, contextItem.text);
        break;
      case 'remove-all-tag-in-contact':
        this.removeAllTagInContact(this.contextMenuContactId);
        break;
      case 'rename-tag':
        this.renameTag();
        break;
      case 'delete-tag':
        this.removeTag();
        break;
      case 'tag-color':
        this.tagColor();
        break;
      case 'remove-tag':
        // this.logger.info('This feature is not available now.');
        break;
      case 'move-contact':
        // this.logger.info('This feature is not available now.');
        break;
      case 'delete-contact':
        // this.logger.info('This feature is not available now.');
        break;
      case 'print':
        this.printMailConversation();
        break;
      case 'new-tag-for-conversation':
        this.addConversationTag(this.contextMenuContactId, contextItem.text);
        break;
      case 'add-tag-conversation':
        this.addNewConversationTag(this.contextMenuContactId, contextItem.text);
        break;
      case 'flag-conversation':
        this.flagUnFlagConversation(this.contextMenuConversation);
        break;
      case 'unFlag-conversation':
        this.flagUnFlagConversation(this.contextMenuConversation);
        break;
      case 'mark-as-read':
        this.readUnreadConversation(this.contextMenuConversation, this.contextMenuMailD, this.contextMenuMailIndex);
        break;
      case 'mark-as-un-read':
        this.readUnreadConversation(this.contextMenuConversation, this.contextMenuMailD, this.contextMenuMailIndex);
        break;
      case 'remove-tag-conversation':
        this.removeConversationTag(this.contextMenuContactId, contextItem.text);
        break;
      case 'remove-all-tag-conversation':
        this.removeAllTagInConversation(this.contextMenuContactId);

        break;
      case 'mark-as-spam':
        this.contextMenuConversation || this.spamMessage(this.contextMenuMailIndex);
        break;
      case 'mark-as-not-spam':
        this.contextMenuConversation || this.unSpamMessage(this.contextMenuMailIndex);
        break;
      case 'Move-conversation':
        this.moveConversation(this.contextMenuContactId, this.contextMenuConversation, this.contextMenuMailD, this.contextMenuMailIndex);
        break;

      // Calendar
      // TODO: Implement these events
      case 'new-calendar':
        // false for edit mode.
        this.createNewCalendar(false);
        break;
      case 'share-calendar':
        this.shareFolder('calendar');
        break;
      case 'delete-calendar':
        this.deleteCalendar();
        break;
      case 'move-calendar':
        break;
      case 'edit-calendar-properties':
        break;
      case 'reload-calendar':
        break;
      case 'launch-calendar-in-separate-window':
        break;
      case 'empty-calendar-trash':
        this.emptyCalendarTrash();
        break;
      case 'new-appointment':
        this.createNewAppointment(true);
        break;
      case 'new-all-day-appointment':
        this.createNewAppointment(true, true);
        break;
      case 'delete-appointment':
      case 'delete-appointment-instance':
        this.cancelAppointment(false);
        break;
      case 'delete-appointment-series':
        this.cancelAppointment(true);
        break;
      case 'go-to-today':
        break;
      case 'calendar-view-day':
        this.changeCalendarView('day');
        break;
      case 'calendar-view-work-week':
        this.changeCalendarView('week');
        break;
      case 'calendar-view-week':
        this.changeCalendarView('week');
        break;
      case 'calendar-view-month':
        this.changeCalendarView('month');
        break;
      case 'calendar-view-list':
        this.changeCalendarView('list');
        break;
      case 'recover-calendar-deleted-items':
        this.recoverCalendarDeletedItems();
        break;

      case 'new-tag-for-appointment':
        this.addNewTag(this.contextMenuAppointmentDetail.apptId);
        break;
      case 'add-tag-appointment':
        this.addNewTagToAppointment(this.contextMenuAppointmentDetail.apptId, contextItem.text);
        break;
      case 'remove-tag-appointment':
        this.removeTagInAppointment(this.contextMenuAppointmentDetail.apptId, contextItem.text);
        break;
      case 'remove-all-tag-in-appointment':
        this.removeAllTagInAppointment(this.contextMenuAppointmentDetail.apptId);
        break;
      // End of Calendar

      default:
        break;
    }

    // remove context menu after events was executed.
    if (angular.isDefined(contextItem.eventName)) {
      this.removeContextMenu();
    }
  }

  generateContextMenuListItems() {
    switch (this.contextMenuType) {
      case 'contactItem':
      {
        return this.createContactContextMenu();
      }
        break;

      case 'tagItem':
      {
        return this.createTagContextMenu();
      }
        break;

      case 'mailItem':
      {
        return this.createMailContextMenu();
      }
        break;

      case 'mailSideBarItem':
      {
        return this.createMailSideBarContextMenu();
      }
        break;

      case 'calendarItem':
      {
        return this.createCalendarContextMenu();
      }
        break;

      case 'calendarSideBarItem':
      {
        return this.createCalendarSideBarContextMenu();
      }
        break;

      case 'appointmentItem':
      {
        return this.createAppointmentContextMenu();
      }
        break;

      default:
      {
        return [];
      }
    }
  }

  /* Print Email Conversation */
  printMailConversation(){
    var url = this.mailService.getPrintConversation(this.rootScope.messageCid);
    var popupWin = window.open(url);
    this.timeout(function(){
      popupWin.print();
      }, 5000);
  }


  /* Generate context menu depend on type view */
  createContactContextMenu() {
    let contactContextList = [];

    // ---- Create Divider menu item----
    let divider = this.contextMenuObjectFormat({isDivider: true});

    // ---- Create Find Email menu item----
    // ---- Create sub menu ----
    let findEmailSubMenu = [];
    findEmailSubMenu.push(this.contextMenuObjectFormat({
      text: 'Received From Contact',
      eventName: 'received-from-contact',
      iconClass: 'fa fa-search'
    }));

    findEmailSubMenu.push(this.contextMenuObjectFormat({
      text: 'Sent To Contact',
      eventName: 'sent-to-contact',
      iconClass: 'fa fa-search'
    }));

    contactContextList.push(this.contextMenuObjectFormat({
      text: 'Find Emails ...',
      iconClass: 'fa fa-search',
      hasSubMenu: true,
      subMenuItems: findEmailSubMenu
    }));

    // ---- Create New Email menu item----
    contactContextList.push(this.contextMenuObjectFormat({
      text: 'New Emails',
      eventName: 'new-email',
      iconClass: 'fa fa-envelope-o'
    }));

    // ---- Create Edit Email menu item----
    contactContextList.push(this.contextMenuObjectFormat({
      text: 'Edit Contact',
      eventName: 'edit-contact',
      iconClass: 'fa fa-pencil'
    }));

    // ---- Create Forward Contact menu item----
    contactContextList.push(this.contextMenuObjectFormat({
      text: 'Forward Contact',
      eventName: 'forward-contact',
      iconClass: 'fa fa-book'
    }));

    // ---- Add Divider menu item----
    contactContextList.push(divider);

    // ---- Create Contact Group menu item----
    // ---- Create sub menu ----
    let contactGroupSubMenu = [];
    contactGroupSubMenu.push(this.contextMenuObjectFormat({
      text: 'New Contact Group',
      eventName: 'new-contact-group',
      iconClass: 'fa fa-users'
    }));

    contactContextList.push(this.contextMenuObjectFormat({
      text: 'Contact Group',
      iconClass: 'fa fa-users',
      hasSubMenu: true,
      subMenuItems: contactGroupSubMenu
    }));

    // ---- Create Tag Contact menu item----
    // ---- Create sub menu ----
    let tagContactSubMenu = angular.copy(this.tagList);
    if (tagContactSubMenu.length > 0) {
      tagContactSubMenu.push(divider);
    }

    tagContactSubMenu.push(this.contextMenuObjectFormat({
      text: 'New Tag',
      eventName: 'new-tag-for-contact',
      iconClass: 'fa fa-tag'
    }));

    // Prepare contextMenu items for Remove Tag item.
    let
      removeTagEventName = undefined,
      isDisabledRemoveTag = true,
      hasSubMenuRemoveTag = false,
      removeTagSubMenuItems = [];

    if (this.tagAddedInContact.length > 0) {
      isDisabledRemoveTag = false;

      if (this.tagAddedInContact.length === 1) {
        removeTagEventName = 'remove-all-tag-in-contact';
      }
      else {
        hasSubMenuRemoveTag = true;

        removeTagSubMenuItems = this.tagAddedInContact;

        // Add devider.
        removeTagSubMenuItems.push(divider);

        // Add more item
        removeTagSubMenuItems.push(this.contextMenuObjectFormat({
          text: 'All Tag',
          eventName: 'remove-all-tag-in-contact',
          iconClass: 'fa fa-tags'
        }));
      }
    }

    tagContactSubMenu.push(this.contextMenuObjectFormat({
      text: 'Remove Tag',
      eventName: removeTagEventName,
      iconClass: 'fa fa-tag',
      isDisabled: isDisabledRemoveTag,
      hasSubMenu: hasSubMenuRemoveTag,
      subMenuItems: removeTagSubMenuItems
    }));

    contactContextList.push(this.contextMenuObjectFormat({
      text: 'Tag Contact',
      iconClass: 'fa fa-tags',
      hasSubMenu: true,
      subMenuItems: tagContactSubMenu
    }));

    // ---- Create Remove Contact menu item----
    contactContextList.push(this.contextMenuObjectFormat({
      text: 'Delete Contact',
      eventName: 'delete-contact',
      iconClass: 'fa fa-remove'
    }));

    // ---- Create Move Contact menu item----
    contactContextList.push(this.contextMenuObjectFormat({
      text: 'Move Contact',
      eventName: 'move-contact',
      iconClass: 'fa fa-files-o'
    }));

    // ---- Create Print Contact menu item----
    contactContextList.push(this.contextMenuObjectFormat({
      text: 'Print',
      eventName: 'print',
      iconClass: 'fa fa-print'
    }));

    return contactContextList;
  }

  createMailContextMenu() {
    let conversationItem = this.contextMenuConversation;

    let contactMailList = [];

    // ---- Create Divider menu item----
    let divider = this.contextMenuObjectFormat({isDivider: true});

    // ---- sub menu start here ----
    let tagConversationSubMenu = angular.copy(this.tagList);
    if (tagConversationSubMenu.length > 0) {
      tagConversationSubMenu.push(divider);
    }

    tagConversationSubMenu.push(this.contextMenuObjectFormat({
      text: 'New Tag',
      eventName: 'new-tag-for-conversation',
      iconClass: 'local_offer'
    }));

    // Prepare contextMenu items for Remove Tag item.
    let
      removeTagEventName = undefined,
      isDisabledRemoveTag = true,
      hasSubMenuRemoveTag = false,
      removeTagSubMenuItems = [];

    if (this.tagAddedInContact.length > 0) {
      isDisabledRemoveTag = false;

      if (this.tagAddedInContact.length === 1) {
        removeTagEventName = 'remove-all-tag-conversation';
      }
      else {
        hasSubMenuRemoveTag = true;

        removeTagSubMenuItems = this.tagAddedInContact;

        // Add devider.
        removeTagSubMenuItems.push(divider);

        // Add more item
        removeTagSubMenuItems.push(this.contextMenuObjectFormat({
          text: 'All Tag',
          eventName: 'remove-all-tag-conversation',
          iconClass: 'local_offer'
        }));
      }
    }

    tagConversationSubMenu.push(this.contextMenuObjectFormat({
      text: 'Remove Tag',
      eventName: removeTagEventName,
      iconClass: 'local_offer',
      isDisabled: isDisabledRemoveTag,
      hasSubMenu: hasSubMenuRemoveTag,
      subMenuItems: removeTagSubMenuItems
    }));
    // ---- sub menu end here ----

    if (angular.isDefined(this.tagName)) {

      let findEmails = [];
      findEmails.push(this.contextMenuObjectFormat({
        text: 'Recived From Sender',
        eventName: 'received-from-contact',
        iconClass: 'fa fa-search'
      }));

      findEmails.push(this.contextMenuObjectFormat({
        text: 'Send To Sender',
        eventName: 'received-from-contact',
        iconClass: 'fa fa-search'
      }));

      contactMailList.push(this.contextMenuObjectFormat({
        text: 'Find Emails...',
        eventName: 'reply',
        iconClass: 'fa fa-search',
        hasSubMenu: true,
        subMenuItems: findEmails
      }));

      contactMailList.push(this.contextMenuObjectFormat({
        text: 'New Email',
        eventName: 'reply',
        iconClass: 'fa fa-envelope'
      }));

      contactMailList.push(this.contextMenuObjectFormat({
        text: 'Add to Contact',
        eventName: 'reply',
        iconClass: 'fa fa-user-plus'
      }));

      contactMailList.push(this.contextMenuObjectFormat({
        text: 'Forward Contact',
        eventName: 'reply',
        iconClass: 'fa fa-forward',
        isDisabled: true
      }));

      // ---- Add Divider menu item----
      contactMailList.push(divider);
    }

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Reply',
      eventName: 'reply',
      iconClass: 'reply'
    }));

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Reply to All',
      iconClass: 'reply_all',
      eventName: 'reply'
      //hasSubMenu: true,
      //subMenuItems: findEmailSubMenu
    }));

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Forward',
      eventName: 'new-email',
      iconClass: 'forward'
    }));

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Forward Conversation',
      eventName: 'edit-contact',
      iconClass: 'forward',
      isDisabled: true
    }));

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Redirect',
      eventName: 'redirect-mail',
      iconClass: 'directions'
    }));

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Edit as New',
      eventName: 'forward-contact',
      iconClass: 'edit'
    }));

    // ---- Add Divider menu item----
    contactMailList.push(divider);

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Delete',
      iconClass: 'delete',
      eventName: 'new-contact-group'
    }));

    if (STATE.get(this).current.name !== 'mail.junk' && STATE.get(this).current.name !== 'mail.drafts') {
      contactMailList.push(this.contextMenuObjectFormat({
        text: 'Mark as Spam',
        iconClass: 'email',
        eventName: 'mark-as-spam'
      }));
    }

    if (STATE.get(this).current.name === 'mail.junk') {
      contactMailList.push(this.contextMenuObjectFormat({
        text: 'Mark as not Spam',
        iconClass: 'email',
        eventName: 'mark-as-not-spam'
      }));
    }

    // ---- Add Divider menu item----
    contactMailList.push(divider);

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Tag Conversation',
      iconClass: 'local_offer',
      hasSubMenu: true,
      subMenuItems: tagConversationSubMenu
    }));

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Move',
      iconClass: 'folder_open',
      eventName: 'Move-conversation'
    }));

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Print',
      iconClass: 'print',
      eventName: 'print'
    }));

    // ---- Add Divider menu item----
    contactMailList.push(divider);

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Mark as Read',
      iconClass: 'email',
      eventName: 'mark-as-read',
      isDisabled: (!(conversationItem && conversationItem.flag && conversationItem.flag.indexOf('u') >= 0 ))
    }));

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Mark as Unread',
      iconClass: 'markunread',
      eventName: 'mark-as-un-read',
      isDisabled: (conversationItem && conversationItem.flag && conversationItem.flag.indexOf('u') >= 0)
    }));

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Flag',
      iconClass: 'flag',
      eventName: 'flag-conversation',
      isDisabled: (conversationItem && conversationItem.flag && conversationItem.flag.indexOf('f') >= 0)
    }));

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Unflag',
      iconClass: 'indeterminate_check_box',
      eventName: 'unFlag-conversation',
      isDisabled: (!(conversationItem && conversationItem.flag && conversationItem.flag.indexOf('f') >= 0 ))
    }));

    // ---- Add Divider menu item----
    contactMailList.push(divider);

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Create Filter',
      iconClass: 'filter_list',
      eventName: 'new-contact-group'
    }));

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Create Appointment',
      iconClass: 'perm_contact_calendar',
      eventName: 'new-contact-group'
    }));

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Create Task',
      iconClass: 'add',
      eventName: 'new-contact-group'
    }));

    // ---- Add Divider menu item----
    contactMailList.push(divider);

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Launch as Separate Window',
      iconClass: 'tab',
      eventName: 'new-contact-group'
    }));

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Show Original',
      iconClass: 'email',
      eventName: 'new-contact-groupe'
    }));

    contactMailList.push(this.contextMenuObjectFormat({
      text: 'Clear Search Highlights',
      iconClass: 'clear',
      eventName: 'new-contact-group'
    }));

    return contactMailList;
  }

  createMailSideBarContextMenu() {
    let mailSideBarList = [];

    mailSideBarList.push(this.contextMenuObjectFormat({
      text: 'New Folder',
      eventName: 'reply',
      iconClass: 'fa fa-folder'
    }));

    mailSideBarList.push(this.contextMenuObjectFormat({
      text: 'Mark as Unread',
      iconClass: 'fa fa-envelope',
      eventName: 'reply',
      isDisabled: true
    }));

    mailSideBarList.push(this.contextMenuObjectFormat({
      text: 'Delete',
      eventName: 'new-email',
      iconClass: 'fa fa-times',
      isDisabled: true
    }));

    mailSideBarList.push(this.contextMenuObjectFormat({
      text: 'Rename',
      eventName: 'edit-contact',
      iconClass: 'fa fa-pencil-square-o',
      isDisabled: true
    }));

    mailSideBarList.push(this.contextMenuObjectFormat({
      text: 'Move',
      eventName: 'forward-contact',
      iconClass: 'fa fa-backward',
      isDisabled: true
    }));

    mailSideBarList.push(this.contextMenuObjectFormat({
      text: 'Share Folder',
      eventName: 'forward-contact',
      iconClass: 'fa fa-pencil'
    }));

    mailSideBarList.push(this.contextMenuObjectFormat({
      text: 'Edit Properties',
      iconClass: 'fa fa-trash',
      eventName: 'new-contact-group'
    }));

    mailSideBarList.push(this.contextMenuObjectFormat({
      text: 'Expend All',
      iconClass: 'fa fa-envelope',
      eventName: 'new-contact-group',
      isDisabled: true
    }));

    mailSideBarList.push(this.contextMenuObjectFormat({
      text: 'Empty Folder',
      eventName: 'reply',
      iconClass: 'fa fa-tag',
      isDisabled: true
    }));

    return mailSideBarList;
  }

  createTagContextMenu() {
    let tagContextList = [];

    tagContextList.push(this.contextMenuObjectFormat({
      text: 'New Tag', eventName: 'new-tag', iconClass: 'local_offer'
    }));

    if (angular.isDefined(this.tagId) && angular.isDefined(this.tagName)) {
      tagContextList.push(this.contextMenuObjectFormat({
        text: 'Rename Tag', eventName: 'rename-tag', iconClass: 'edit'
      }));

      tagContextList.push(this.contextMenuObjectFormat({
        text: 'Delete', eventName: 'delete-tag', iconClass: 'clear'
      }));

      tagContextList.push(this.contextMenuObjectFormat({
        text: 'Tag Color', eventName: 'tag-color', iconClass: 'color_lens'
      }));
    }

    return tagContextList;
  }

  createCalendarSideBarContextMenu() {
    let calendarSideBarList = [];
    let isTrash = false;

    if (this.calendarName === 'Trash') {
      isTrash = true;
    }

    calendarSideBarList.push(this.contextMenuObjectFormat({
      text: 'New Calendar',
      eventName: 'new-calendar',
      iconClass: 'folder',
      isDisabled: isTrash
    }));

    calendarSideBarList.push(this.contextMenuObjectFormat({
      text: 'Share Calendar',
      iconClass: 'folder_shared',
      eventName: 'share-calendar',
      isDisabled: isTrash
    }));

    calendarSideBarList.push(this.contextMenuObjectFormat({
      text: 'Delete',
      eventName: 'delete-calendar',
      iconClass: 'delete',
      iconColor: 'red',
      isDisabled: isTrash
    }));

    calendarSideBarList.push(this.contextMenuObjectFormat({
      text: 'Move',
      eventName: 'move-calendar',
      iconClass: 'folder_open',
      isDisabled: isTrash
    }));

    calendarSideBarList.push(this.contextMenuObjectFormat({
      text: 'Edit Properties',
      eventName: 'edit-calendar-properties',
      iconClass: 'edit',
      isDisabled: isTrash
    }));

    calendarSideBarList.push(this.contextMenuObjectFormat({
      text: 'Reload',
      eventName: 'reload-calendar',
      iconClass: 'refresh',
      isDisabled: isTrash
    }));

    calendarSideBarList.push(this.contextMenuObjectFormat({
      text: 'Launch in Separate Window',
      iconClass: 'launch',
      eventName: 'launch-calendar-in-separate-window',
      isDisabled: isTrash
    }));

    if (isTrash) {
      calendarSideBarList.push(this.contextMenuObjectFormat({
        text: 'Empty Trash',
        iconClass: 'delete', // need to be red
        eventName: 'empty-calendar-trash',
        isDisabled: !isTrash
      }));

      calendarSideBarList.push(this.contextMenuObjectFormat({
        text: 'Recover Deleted Items',
        iconClass: 'history',
        iconColor: 'red',
        eventName: 'recover-calendar-deleted-items',
        isDisabled: !isTrash
      }));
    }

    return calendarSideBarList;
  }

  createCalendarContextMenu() {
    let calendarContextList = [];

    // ---- Create Divider menu item----
    let divider = this.contextMenuObjectFormat({isDivider: true});

    // ---- Create New Appointment menu item----
    calendarContextList.push(this.contextMenuObjectFormat({
      text: 'New Appointment',
      eventName: 'new-appointment',
      iconClass: 'note_add'
    }));

    // ---- Create New All Day Appointment ----
    calendarContextList.push(this.contextMenuObjectFormat({
      text: 'New All Day Appointment',
      eventName: 'new-all-day-appointment',
      iconClass: 'note_add'
    }));

    // ---- Add Divider menu item----
    calendarContextList.push(divider);

    // ---- Create Go to Today menu item----
    calendarContextList.push(this.contextMenuObjectFormat({
      text: 'Go to Today',
      eventName: 'go-to-today',
      iconClass: 'today'
    }));

    // ---- Create View menu item----
    // ---- Create View sub menu item----
    let calendarViewSubMenu = [];

    calendarViewSubMenu.push(this.contextMenuObjectFormat({
      text: 'Day',
      eventName: 'calendar-view-day',
      iconClass: 'view_day'
    }));

    calendarViewSubMenu.push(this.contextMenuObjectFormat({
      text: 'Work Week',
      eventName: 'calendar-view-work-week',
      iconClass: 'view_week'
    }));

    calendarViewSubMenu.push(this.contextMenuObjectFormat({
      text: 'Week',
      eventName: 'calendar-view-week',
      iconClass: 'view_week'
    }));

    calendarViewSubMenu.push(this.contextMenuObjectFormat({
      text: 'Month',
      eventName: 'calendar-view-month',
      iconClass: 'view_module'
    }));

    calendarViewSubMenu.push(this.contextMenuObjectFormat({
      text: 'List',
      eventName: 'calendar-view-list',
      iconClass: 'view_agenda'
    }));

    calendarContextList.push(this.contextMenuObjectFormat({
      text: 'View',
      iconClass: 'view_day',
      hasSubMenu: true,
      subMenuItems: calendarViewSubMenu
    }));

    return calendarContextList;
  }

  createAppointmentContextMenu() {
    let appointmentContextList = [];

    // Prepare context menu list for repeating appointment
    if (this.contextMenuAppointmentDetail.isRepeatingAppt) {
      // Instance context menu
      appointmentContextList.push(this.contextMenuObjectFormat({
        text: 'Instance',
        iconClass: 'event',
        hasSubMenu: true,
        subMenuItems: this.createRepeatingAppointmentContextMenu(1)
      }));

      // Series context menu
      appointmentContextList.push(this.contextMenuObjectFormat({
        text: 'Series',
        iconClass: 'event_note',
        hasSubMenu: true,
        subMenuItems: this.createRepeatingAppointmentContextMenu(2)
      }));
    }
    else {
      appointmentContextList = this.createRepeatingAppointmentContextMenu(0);
    }

    return appointmentContextList;
  }

  createRepeatingAppointmentContextMenu(indexType) {
    /*
     0: context menu for appointment without repeating
     1: context menu for instance appointment
     2: context menu for series appointment
     * */

    let textArray = ['', ' Instance', ' Series'],
      eventNameArray = ['', '-instance', '-series'];

    let appointmentContextList = [];

    // ---- Create Divider menu item----
    let divider = this.contextMenuObjectFormat({isDivider: true});

    // ---- Open Appointment menu item----
    appointmentContextList.push(this.contextMenuObjectFormat({
      text: 'Open' + textArray[indexType],
      eventName: 'open-appointment' + eventNameArray[indexType],
      iconClass: 'event_note'
    }));

    // ---- Create Print Appointment menu item----
    appointmentContextList.push(this.contextMenuObjectFormat({
      text: 'Print',
      eventName: 'print',
      iconClass: 'print'
    }));

    appointmentContextList.push(divider);

    // ---- Re-invite attendees menu item ----
    if (indexType !== 0) {
      appointmentContextList.push(this.contextMenuObjectFormat({
        text: 'Re-invite Attendees',
        eventName: 're-invite-attendee',
        iconClass: 'assignment_ind'
      }));
    }

    // ---- Create Copy Appointment menu item----
    appointmentContextList.push(this.contextMenuObjectFormat({
      text: 'Create a copy',
      eventName: 'copy-appointment',
      iconClass: 'content_copy'
    }));

    appointmentContextList.push(divider);

    // ---- Create Reply Appointment menu item----
    appointmentContextList.push(this.contextMenuObjectFormat({
      text: 'Reply',
      eventName: 'reply-appointment',
      iconClass: 'reply'
    }));

    // ---- Create Delete Appointment menu item----
    appointmentContextList.push(this.contextMenuObjectFormat({
      text: 'Reply to All',
      eventName: 'reply-all-appointment',
      iconClass: 'reply_all'
    }));

    // ---- Create Delete Appointment menu item----
    appointmentContextList.push(this.contextMenuObjectFormat({
      text: 'Forward' + textArray[indexType],
      eventName: 'forward-appointment' + eventNameArray[indexType],
      iconClass: 'forward'
    }));

    // ---- Create Delete Appointment menu item----
    appointmentContextList.push(this.contextMenuObjectFormat({
      text: 'Delete' + textArray[indexType],
      eventName: 'delete-appointment' + eventNameArray[indexType],
      iconClass: 'delete',
      iconColor: 'red'
    }));

    appointmentContextList.push(divider);

    // ---- Create Move Appointment menu item----
    if (indexType !== 1) {
      appointmentContextList.push(this.contextMenuObjectFormat({
        text: 'Move',
        eventName: 'move-appointment',
        iconClass: 'folder_open'
      }));
    }

    // ---- Create Tag Contact menu item----
    // ---- Create sub menu ----
    let tagAppointmentSubMenu = angular.copy(this.tagList);

    if (tagAppointmentSubMenu.length > 0) {
      tagAppointmentSubMenu.push(divider);
    }

    tagAppointmentSubMenu.push(this.contextMenuObjectFormat({
      text: 'New Tag',
      eventName: 'new-tag-for-appointment',
      iconClass: 'local_offer'
    }));

    // Prepare contextMenu items for Remove Tag item.
    let
      removeTagEventName = undefined,
      isDisabledRemoveTag = true,
      hasSubMenuRemoveTag = false,
      removeTagSubMenuItems = [];

    if (this.tagAddedInAppointment.length > 0) {
      isDisabledRemoveTag = false;

      if (this.tagAddedInAppointment.length === 1) {
        removeTagEventName = 'remove-all-tag-in-appointment';
      }
      else {
        hasSubMenuRemoveTag = true;

        removeTagSubMenuItems = this.tagAddedInAppointment;

        // Add devider.
        removeTagSubMenuItems.push(divider);

        // Add more item
        removeTagSubMenuItems.push(this.contextMenuObjectFormat({
          text: 'All Tag',
          eventName: 'remove-all-tag-in-appointment',
          iconClass: 'clear_all'
        }));
      }
    }

    tagAppointmentSubMenu.push(this.contextMenuObjectFormat({
      text: 'Remove Tag',
      eventName: removeTagEventName,
      iconClass: 'clear',
      isDisabled: isDisabledRemoveTag,
      hasSubMenu: hasSubMenuRemoveTag,
      subMenuItems: removeTagSubMenuItems
    }));

    appointmentContextList.push(this.contextMenuObjectFormat({
      text: 'Tag Contact',
      iconClass: 'local_offer',
      hasSubMenu: true,
      subMenuItems: tagAppointmentSubMenu
    }));

    return appointmentContextList;
  }

  generateContextItemListForTagData(tags, eventName) {
    let contextTagItems = [];

    if (angular.isDefined(tags) && tags.length > 0) {
      angular.forEach(tags, (tag, index) => {
        let iconColor = tag.$.color ?
          this.vncConstant.COLOR_CODES[tag.$.color] :
          tag.$.rgb;

        contextTagItems.push(this.contextMenuObjectFormat({
          itemId: tag.$.id,
          text: tag.$.name,
          eventName: eventName,
          iconClass: 'local_offer',
          iconColor: iconColor
        }));
      });

      // arrange tag list as alphabet.
      //contextTagItems.sort((firstItem, secondItem) => {
      //  if (firstItem.text < secondItem.text) return -1;
      //  if (firstItem.text > secondItem.text) return 1;
      //  return 0;
      //});
    }

    return contextTagItems;
  }

  /* Add new tag for conversation*/

  addConversationTag(contextMenuConversationId) {
    MDDIALOG.get(this).open({
      template: createNewTagTemplate,
      windowClass: 'modal-middle-position',
      controller: ['$modalInstance', '$rootScope', 'logger', 'sidebarService', createNewTagController],
      controllerAs: 'vm',
      bindToController: true,
      backdrop: true,
      keyboard: true,
      backdropClick: true,
      size: 'md modal-2'
    });

    uibModalInstance.result.then((res) => {
      if (angular.isDefined(contextMenuConversationId)) {
        // Add tag to conversation
        this.addNewConversationTag(contextMenuConversationId, res.name);
      }
    });
  }

  /* Add new tag */

  addNewTag(selectedItemId) {
    let uibModalInstance = MDDIALOG.get(this).open({
      animation: true,
      template: createNewTagTemplate,
      windowClass: 'modal-middle-position',
      controller: ['$modalInstance', '$rootScope', 'logger', 'sidebarService', createNewTagController],
      controllerAs: 'vm',
      bindToController: true,
      template: createNewTagTemplate,
      escapeToClose: false,
      fullscreen: true
    })
    .then((res) => {
      if (angular.isDefined(selectedItemId)) {
        switch (this.contextMenuType) {
          case 'contactItem':
            // Add tag to contact
            this.addNewTagToContact(selectedItemId, res.name);
            break;

          case 'appointmentItem':
            this.addNewTagToAppointment(selectedItemId, res.name);
            break;
        }
      }
    });
  }

  /* Add new tag for selected contact */
  addNewTagToContact(selectedContactId, tagName) {
    this.mailService.assignTagToContact(selectedContactId, tagName, (res, err) => {
      if (err) {
        this.logger.error(err.msg);
      }
      else {
        // this.logger.info('Tag added successfully.');
      }
    });
  }

  /* Remove selected tag in contact */
  removeTagInContact(selectedContactId, tagName) {
    this.mailService.removeTagInContact(selectedContactId, tagName, (res, err) => {
      if (err) {
        this.logger.error(err.msg);
      }
      else {
        // this.logger.info('Tag [' + tagName + '] removed successfully.');
      }
    });
  }

  /* Remove all tag in contact */
  removeAllTagInContact(selectedContactId) {
    this.mailService.removeAllTagInContact(selectedContactId, (res, err) => {
      if (err) {
        this.logger.error(err.msg);
      }
      else {
        // this.logger.info('Tags removed successfully.');
      }
    });
  }

  /* Add new tag for selected contact */
  addNewTagToAppointment(selectedApptId, tagName) {
    this.mailService.tagAppointment(selectedApptId, tagName, (res, err) => {
      if (err) {
        this.logger.error(err.msg);
      }
      else {
        //Update selected appointment tags.
        this.updateTagsForSelectedAppointment('add', tagName);

        // this.logger.info('Tag added successfully.');
      }
    });
  }

  /* Remove selected tag in contact */
  removeTagInAppointment(selectedApptId, tagName) {
    this.mailService.removeTagFromAppointment(selectedApptId, tagName, (res, err) => {
      if (err) {
        this.logger.error(err.msg);
      }
      else {
        //Update selected appointment tags.
        this.updateTagsForSelectedAppointment('remove', tagName);

        // this.logger.info('Tag [' + tagName + '] removed successfully.');
      }
    });
  }

  /* Remove all tag in contact */
  removeAllTagInAppointment(selectedContactId) {
    this.mailService.removeAllTagFromAppointment(selectedContactId, (res, err) => {
      if (err) {
        this.logger.error(err.msg);
      }
      else {
        //Update selected appointment tags.
        this.updateTagsForSelectedAppointment('removeAll');
        // this.logger.info('Tags removed successfully.');
      }
    });
  }

  /* Remove the tag */
  removeTag() {
    let vm = this;
    MDDIALOG.get(this).show({
      controller: ['$mdDialog', 'tagName', 'tagId', 'logger', 'tagService', deleteTagModalController],
      controllerAs: 'vm',
      bindToController: true,
      template: deleteTemplate,
      escapeToClose: false,
      fullscreen: true,
      resolve: {
        tagName: () => {
          return vm.tagName || '';
        },
        tagId: () => {
          return vm.tagId || '';
        }
      }
    });

    function deleteTagModalController($mdDialog, tagName, tagId, logger, tagService) {

      let vm = this;
      vm.tagName = tagName;
      vm.tagId = tagId;
      vm.reqPending = false;
      // Accept mail deletation
      vm.ok = () => {
        if(vm.tagId){
          vm.reqPending = true;
          tagService.removeTag(vm.tagId, vm.tagName, function(res, err){
            $mdDialog.hide();
          });
        }
        else {
          // logger.info('This feature is not available now.');
          $mdDialog.hide();
        }
      };

      // Cancel mail deletation
      vm.cancel = () => {
        $mdDialog.cancel();
      };
    }
  }

  /* Set Tag color */

  tagColor() {
    MDDIALOG.get(this).show({
      controller: ['$mdDialog', 'tagService', 'logger', 'tagId', selectColorModalController],
      controllerAs: 'vm',
      bindToController: true,
      template: selectColorTemplate,
      escapeToClose: false,
      fullscreen: true,
      resolve: {
        tagId: () => {
          return this.tagId || {};
        }
      }
    });

    function selectColorModalController($mdDialog, tagService, logger, tagId) {

      let vm = this;
      vm.tagId = tagId;
      vm.availableColors = ['Blue', 'Cyan', 'Green', 'Purple', 'Red', 'Yellow', 'Pink'];
      vm.rgbCodes = {
        'Blue': '#42a5f6',
        'Cyan': '#00BCD4',
        'Green': '#66bb6a',
        'Purple': '#5B69C3',
        'Red': '#F1524A',
        'Yellow': '#ef6c00',
        'Pink': '#E91E63'
      };

      vm.reqPending = false;

      // Set tag Color
      vm.ok = () => {
        vm.reqPending = true;
        let tag = {
          "id": vm.tagId
        };
        vm.moreColor && (tag.rgb = vm.selectColor);
        vm.moreColor || (tag.rgb = vm.rgbCodes[vm.selectColor]);
        if (vm.tagId) {
          tagService.changeTagColor(tag, function(res, err){
            if ( err ) {
              logger.error(err.msg);
              $mdDialog.hide();
            }
            else{
              $mdDialog.hide();
            }
          });
        } else {
          $mdDialog.hide();
          // logger.info('This feature is not available now.');
        }
      };

      // Cancel
      vm.cancel = () => {
        $mdDialog.cancel();
      };
    }
  }

  /* Rename the tag */
  renameTag() {
    let vm = this;
    MDDIALOG.get(this).show({
      controller: ['$mdDialog', 'tagName','tagId', 'sidebarFoldersService', 'tagService', 'logger', renameTagModalController],
      controllerAs: 'vm',
      bindToController: true,
      template: renameTemplate,
      escapeToClose: false,
      fullscreen: true,
      resolve: {
        tagName: () => {
          return vm.tagName || {};
        },
        tagId: () => {
          return vm.tagId || {};
        }
      }
    });

    function renameTagModalController($mdDialog, tagName, tagId, sidebarFoldersService, tagService, logger) {

      let vm = this;
      vm.oldName = tagName;
      vm.newName = tagName;
      vm.id = tagId;
      vm.reqPending = false;

      //Rename tag
      vm.ok = () => {
        vm.reqPending = true;
        if(vm.newName == tagName) $mdDialog.cancel();
        else{
          if (vm.id) {
            tagService.renameTag(vm.tagId, vm.newName, function(res, err){
              if ( err ) {
                let duplicateError = 'object with that name already exists';
                if(err.msg && err.msg.indexOf(duplicateError) > -1){
                  vm.reqPending = true;
                  sidebarFoldersService._openCriticalErrorModel('A tag with the same name already exists. Please use another name.', function(){
                    vm.reqPending = false;
                  });
                }
                else{
                  logger.error(err.msg);
                  $mdDialog.hide();
                }
              }
              else{
                $mdDialog.hide();
              }
            });
          } else {
            $mdDialog.hide();
            // logger.info('This feature is not available now.');
          }
        }
      };

      // Cancel
      vm.cancel = () => {
        $mdDialog.cancel();
      };
    }
  }

  /* Update appointment data afer adding/removing tags */
  updateTagsForSelectedAppointment(actionType, tagName) {
    if (actionType === 'add') {
      let tagListRaw = angular.copy(this.tagListRaw);

      if (angular.isDefined(tagListRaw) && tagListRaw.length > 0) {
        angular.forEach(tagListRaw, (tag, index) => {
          if (tag.$.name === tagName) {
            this.contextMenuAppointmentDetail.tags.push(tag);
          }
        });
      }
    }
    else if (actionType === 'remove') {
      let tagInAppointments = angular.copy(this.contextMenuAppointmentDetail.tags);

      if (tagInAppointments.length > 0) {
        angular.forEach(tagInAppointments, (tag, index)=> {
          if (tag.$.name === tagName) {
            this.contextMenuAppointmentDetail.tags.splice(index, 1);
          }
        });
      }
    }
    else if (actionType === 'removeAll') {
      this.contextMenuAppointmentDetail.tags = [];
    }
  }

  onContextItemHover(event, contextItemName) {
    let $target = this.$(event.target),
      $ul = $target.children('ul');

    if ($ul.length > 0) {
      let parentOffsetTop = event.clientY,
        parentOffsetLeft = event.clientX + $target.prop('clientWidth'),
        subItemsHeight = $ul.prop('clientHeight'),
        subItemsWidth = $ul.prop('clientWidth'),
        bodyHeight = this.$('body').prop('clientHeight'),
        bodyWidth = this.$('body').prop('clientWidth'),
        subItemsOffsetTop = 0,
        subItemsOffsetLeft = '95%',
        subItemsOffsetRight = 'auto';

      if (parentOffsetTop + subItemsHeight > bodyHeight) {
        subItemsOffsetTop = bodyHeight - (parentOffsetTop + subItemsHeight) + 'px';
      }

      if (parentOffsetLeft + subItemsWidth > bodyWidth) {
        subItemsOffsetLeft = 'auto';
        subItemsOffsetRight = '95%';
      }

      this.contextSubMenuStyle[contextItemName] = {
        top: subItemsOffsetTop,
        left: subItemsOffsetLeft,
        right: subItemsOffsetRight
      };
    }
  }

  onContextItemBlur(event) {
    // Todo: handle selected context item after mouse leaving.
  }

  removeContextMenu() {
    let $contextMenu = this.$('#contextMenu');

    // Remove existed context menu
    if ($contextMenu.length > 0) {
      $contextMenu.remove();
    }
  }

  /*
   *
   * */
  contextMenuObjectFormat(contextObject) {
    let
      itemId = contextObject.itemId,
      text = contextObject.text,
      eventName = contextObject.eventName,
      isEnableIcon = contextObject.isEnableIcon || true,
      iconClass = contextObject.iconClass || 'fa fa-default',
      iconColor = contextObject.iconColor || '#333',
      isDivider = contextObject.isDivider || false,
      isDisabled = contextObject.isDisabled || false,
      hasSubMenu = contextObject.hasSubMenu || false,
      subMenuItems = contextObject.subMenuItems || [];

    return angular.copy({
      itemId: itemId,
      text: text,
      eventName: eventName,
      icon: {
        isEnable: isEnableIcon,
        classes: iconClass,
        color: iconColor
      },
      isDivider: isDivider,
      isDisabled: isDisabled,
      hasSubMenu: hasSubMenu,
      subMenuItems: subMenuItems
    });
  }

  /* Add new tag conversation */
  addNewConversationTag(contextMenuConversationId, tagName) {
    this.mailService.assignTagToConversation(contextMenuConversationId, tagName, (res, err) => {
      if (err) {
        this.logger.error(err.msg);
      }
      else {
        this.scope.$emit('event:conversationTag');
        // this.logger.info('1 conversation tagged "' + tagName + '"');
      }
    });
  }

  /* remove tag from conversation */
  removeConversationTag(contextMenuConversationId, tagName) {
    this.mailService.removeTagFromConversation(contextMenuConversationId, tagName, (res, err) => {
      if (err) {
        this.logger.error(err.msg);
      }
      else {
        this.scope.$emit('event:conversationTag');
        // this.logger.info('Tag "' + tagName + '" removed from 1 conversation');
      }
    });
  }

  /* Conversation events */
  /* Remove all tag in conversation */
  removeAllTagInConversation(selectedContactId) {
    this.mailService.removeAllTagInConversation(selectedContactId, (res, err) => {
      if (err) {
        this.logger.error(err.msg);
      }
      else {
        this.scope.$emit('event:conversationTag');
        // this.logger.info('Tags removed successfully.');
      }
    });
  }

  /* Flag UnFlag conversation */
  flagUnFlagConversation(contextMenuConversation) {
    this.scope.$emit('event:contextMenu', contextMenuConversation, 'f');
  }

  /* Read Unread conversation */
  readUnreadConversation(contextMenuConversation, d, index) {
    this.scope.$emit('event:contextMenu', contextMenuConversation, 'u', d, index);
  }

  /* redirect  conversation */
  redirectConversation(mail) {
    this.scope.$emit('event:contextMenuRedirect', mail.m[0].$.id);
  }

  /* spam single message */
  spamMessage(index) {
    this.scope.$emit('event:messageSpamUnspam', index, 'spam');
  }

  /* spam single message */
  unSpamMessage(index) {
    this.scope.$emit('event:messageSpamUnspam', index, 'undoSpam');
  }

  moveConversation() {
    let vm = this;
    let type = vm.contextMenuConversation ? 'Email' : 'Message';
    let uibModalInstance = MDDIALOG.get(this).show({
      escapeToClose: false,
      fullscreen: true,
      template: moveConversationTemplate,
      controller: moveConversationController,
      controllerAs: 'vm',
      bindToController: true,
      resolve: {
        data: function () {
          return {
            emailId: vm.contextMenuContactId,
            key: vm.contextMenuMailD,
            index: vm.contextMenuMailIndex,
            type: type
          };
        }
      }
    });
  }

  /* Calendar events */
  createNewAppointment(isQuickMode, isAllDayAppointment, existingAppointmentObject) {
    let currentDate = undefined,
      isGetTimeFromDate = false,
      size = '',
      title = '';

    if (angular.isDefined(this.contextMenuCalendarDate)) {
      if (this.contextMenuCalendarViewType === 'day') {
        isGetTimeFromDate = true;
      }
      currentDate = JSON.parse(this.contextMenuCalendarDate);
    }

    if (isQuickMode) {
      size = 'md';
      title = 'Quick Add Appointment';
    }
    else {
      size = 'lg';
      title = 'Create New Appointment';
    }

    let uibModalInstance = MDDIALOG.get(this).open({
      animation: true,
      backdrop: 'static',
      template: newAppointmentTemplate,
      windowClass: 'app-modal-window',
      controller: ['$cookies', '$filter', '$modalInstance', '$rootScope',
        '$sce', '$scope', '$state', 'auth', 'calendarService', 'jstimezonedetect', 'logger',
        'mailService', 'moment', 'resolveModal', newAppointmentController],
      controllerAs: 'vm',
      bindToController: true,
      keyboard: true,
      backdropClick: true,
      size: size,
      resolve: {
        resolveModal: {
          currentDate: currentDate,
          isAllDay: isAllDayAppointment || false,
          isGetTimeFromDate: isGetTimeFromDate,
          isQuickMode: isQuickMode || false,
          title: title,
          existingAppointmentObject: existingAppointmentObject || undefined
        }
      }
    });

    uibModalInstance.result.then((response) => {
      if (response.openFullMode) {
        this.createNewAppointment(false, false, response.existingAppointmentObject);
      }
    });
  }

  /**
   * Delete a selected appointment or the whole series of a repeating one.
   * @param {boolean} deleteWholeSeries True will delete the whole series.
   */
  cancelAppointment(deleteWholeSeries) {
    if (!this.contextMenuAppointmentDetail) {
      return;
    }

    let vm = this;

    // Pass the selected appointment to the service so the controller can work on it.
    vm.sidebarService.currentAppointment = vm.contextMenuAppointmentDetail;

    let apptCancellationModal = MDDIALOG.get(this).open({
      animation: true,
      windowClass: 'modal-middle-position',
      template: deleteWholeSeries ? cancelAppointmentSeriesTemplate : cancelAppointmentTemplate,
      controller: cancelAppointmentController,
      controllerAs: 'vm',
      bindToController: true,
      backdrop: true,
      keyboard: true,
      backdropClick: true,
      size: 'md modal-2'
    });

//    apptCancellationModal.result.then((res) => {
//    });
  }

  /**
   * Shows `Create New Calenda` modal for creating new or editing.
   * @param {boolean} isEditMode Shows modal for edit a selected Calendar.
   */
  createNewCalendar(isEditMode) {
    let vm = this;

    if (isEditMode) {
      // TODO: populate selected calendar data
    }

    // The modal controller has already implement save function.
    // The modal result will return the newly added Calendar if user hits Save button.
    let modalInstance = MDDIALOG.get(vm).show({
      clickOutsideToClose: true,
      template: calendarTemplate,
      controller: calendarController, // this should be a function
      controllerAs: 'vm',
      bindToController: true,
//      parent: angular.element(document.body),
//      targetEvent: ev,
      size: 'md modal-2'
    });

    modalInstance.then((modalResult) => {
      if (modalResult.success) {
        // LOGGER.get(vm).info('Calendar "' + modalResult.result.$.name + '" was added successfully.');
        ROOTSCOPE.get(vm).$broadcast('calendar-added');
      } else {
        LOGGER.get(vm).error(modalResult.error, modalResult.error, 'Error occurs while creating calendar.');
      }
    });
  }

  /**
   * Shows `Share Calendar` modal for requesting a Calendar folder options.
   */
  shareFolder(folderType) {
    let vm = this;
    let calendarFolder = this.sidebarService.selectedCalendarFolder;

    // The modal controller has already implement save function.
    // The modal result will return the newly added Calendar if user hits Save button.
    let modalInstance = MDDIALOG.get(vm).show({
      animation: true,
      template: shareFolderTemplate,
      controller: 'ShareFolderController',
      controllerAs: 'vm',
      bindToController: true,
      backdrop: 'static',
      keyboard: true,
      resolve:{
        data: () => {
          return calendarFolder
        }
      },
      backdropClick: 'true',
      size: 'md modal-2'
    });

    modalInstance.then((modalResult) => {
      if (modalResult.success) {
        // LOGGER.get(vm).info('Calendar "' + modalResult.result.$.name + '" has been shared successfully.');
        ROOTSCOPE.get(vm).$broadcast('calendar_shared');
      } else {
        LOGGER.get(vm).error(modalResult.error, modalResult.error, 'Error occurs while sharing calendar.');
      }
    });
  }

  /**
   * Delete the selected Calendar node on the Calendar Tree.
   */
  deleteCalendar() {
//    let selectedCalendarNode = this.sidebarService.selectedCalendarNode;
//    if (selectedCalendarNode.id) {
//      this.mailService.deleteFolder(selectedCalendarNode.id, (res) => {
//        this.logger.info('Calendar "' + selectedCalendarNode.name + '" was moved to "Trash".');
//        this.rootScope.$broadcast('CALENDAR_DELETED');
//      }).catch((error) => {
//        LOGGER.get(this).error(error, error, 'Error occurs while deleting calendar.');
//      });
//    }

    let modalInstance = MDDIALOG.get(this)
    .confirm()
    .title('Delete Calendar')
    .textContent('Are you sure you want to permanently delete the "' + selectedCalendarNode.$.name + '" folder?')
      .ariaLabel('Confirmation')
//          .targetEvent(ev)
      .ok('OK')
      .cancel('Cancel');

    MDDIALOG.get(this).show(confirm).then(()=> {
        this.mailService.deleteFolder(selectedCalendarNode.id, (res) => {
          // this.logger.info('Calendar "' + selectedCalendarNode.name + '" was moved to "Trash".');
          this.rootScope.$broadcast('CALENDAR_DELETED');
      }, () =>{
  //      $scope.status = 'You decided to keep your debt.';
      });
    });
  }

  changeCalendarView(view) {
    STATE.get(this).go('calendar.view', {
      viewType: view
    });
  }

  // #region Calendar Sidebar events
  // Empty Calendar Trash
  emptyCalendarTrash() {
    // Show Empty Trash modal
    var modalInstance = MDDIALOG.get(this).open({
      animation: true,
      backdrop: 'static',
      template: emptyTrashTemplate,
      windowClass: 'modal-middle-position',
      controller: ['$scope', '$modalInstance', emptyTrashModalController],
      size: 'md modal-2'
    });

    modalInstance.result.then(() => {
      this.mailService.emptyTrash(() => {
        //LOGGER.get(this).info('The ' + this.tagName + ' tag was removed successfully.');
        this.rootScope.$broadcast('TRASH_EMPTIED');

      }).catch((error) => {
        LOGGER.get(this).error(error, error, 'Error occurs while removing tag.');
      });
    });

    function emptyTrashModalController($scope, $modalInstance) {
      // Accept appointment deletation
      $scope.ok = () => {
        $modalInstance.close();
      };

      // Cancel appointment deletation
      $scope.cancel = () => {
        $modalInstance.dismiss('cancel');
      };
    }
  }

  recoverCalendarDeletedItems() {
    // Show a list of the calendar deleted items
    this.timeout(() => {
      this.$('#recover-calendar-deleted-items').find('#modal').trigger('click');
    }, 100);
  }

  // #endregion Calendar Sidebar events
}

export default ContextMenuDetailController;
