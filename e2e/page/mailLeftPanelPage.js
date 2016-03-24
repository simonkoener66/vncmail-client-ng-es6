var commonFunctions = require("../commonFunctions/commonFunctions.js");

var mailLeftPanelPage = function(){

  var number,count;
  var emailToField = element(by.xpath("//input[@placeholder='To']"));
  var emailCcField = element(by.xpath("//tags-input[@placeholder='Cc']//input"));
  var emailBccField = element(by.xpath("//div[@ng-click='eventHandlers.host.click()']//input[@placeholder='BCC']"));
  var emailSubject = element(by.model('vm.subject'));
  var emailBccField = element(by.xpath('//tags-input[@placeholder="BCC"]//input'));
  var emailBody = element(by.xpath('//trix-editor[@placeholder="Message..."]'));

  this.getMailLeftSideMenuBar = function(){
    element(by.css('[ng-click="vm.toggleState()"]')).click();
  };

  this.getInboxFolder = function(){
    element(by.xpath('//span[@class="unread"]/span[contains(text(),"Inbox")]')).isDisplayed().then(function(result){
      if(result == true){
          element(by.xpath('//span[@class="unread"]/span[contains(text(),"Inbox")]')).click();
      }else {
          element(by.css('[ng-click="vm.toggleState()"]')).click();
          element(by.xpath('//span[@class="unread"]/span[contains(text(),"Inbox")]')).click();
      }
    });
  };

  this.getSentFolder = function(){
    element(by.xpath('//span[@class="unread"]/span[contains(text(),"Sent")]')).isDisplayed().then(function(result){
      if(result == true){
          element(by.xpath('//span[@class="unread"]/span[contains(text(),"Sent")]')).click();
      }else {
	  element(by.css('[ng-click="vm.toggleState()"]')).click();
          element(by.xpath('//span[@class="unread"]/span[contains(text(),"Sent")]')).click();
      }
    });
  };

  this.getDraftFolder = function(){
    element(by.xpath('//span[@class="unread"]/span[contains(text(),"Drafts")]')).isDisplayed().then(function(result){
      if(result == true){
          element(by.xpath('//span[@class="unread"]/span[contains(text(),"Drafts")]')).click();
      }else {
	  element(by.css('[ng-click="vm.toggleState()"]')).click();
          element(by.xpath('//span[@class="unread"]/span[contains(text(),"Drafts")]')).click();
      }
    });
  };

  this.getJunkFolder = function(){
    element(by.xpath('//span[@class="unread"]/span[contains(text(),"Junk")]')).isDisplayed().then(function(result){
      if(result == true){
          element(by.xpath('//span[@class="unread"]/span[contains(text(),"Junk")]')).click();
      }else {
	  element(by.css('[ng-click="vm.toggleState()"]')).click();
          element(by.xpath('//span[@class="unread"]/span[contains(text(),"Junk")]')).click();
      }
    });
  };

  this.getTrashFolder = function(){
    element(by.xpath('//span[@class="unread"]/span[contains(text(),"Trash")]')).isDisplayed().then(function(result){
      if(result == true){
          element(by.xpath('//span[@class="unread"]/span[contains(text(),"Trash")]')).click();
      }else {
	  element(by.css('[ng-click="vm.toggleState()"]')).click();
          element(by.xpath('//span[@class="unread"]/span[contains(text(),"Trash")]')).click();
      }
    });
  };

  this.checkLeftSideUserDefineFolders = function(parentFolder){
    return element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+parentFolder+'")]'));
  };

  this.getNoResultFoundMessage = function(){
    //Following element should return "No result found." Text.
    //return element.all(by.repeater('mail in emails')).get(0).getText();
    return element(by.xpath('//div[@ng-show="!vm.keys(vm.email.emails).length"]/p')).getText().then(function(value){
      return value;
    });
  };

  this.getInboxFolderText = function(){
    return element(by.xpath('//span[@class="unread"]/span[contains(text(),"Inbox")]')).getText().then(function(value){
      return value;
    });
  };

  this.getInboxFolderNumber = function(){
   return element(by.xpath('//span[@class="unread"]/span[contains(text(),"Inbox")]/../span[@class="ng-scope"]')).getText().then(function(value){
      var demovalue = value.substring(value.indexOf('(')+1, value.indexOf(')'));
      return number = parseInt(demovalue);
    });
  };

  this.getUnreadMailCount = function(){
    //need to develop unread mails functionality
    //Following element should unread emails and return count of unread emails.
    return element.all(by.css('[ng-click="vm.getUnreadEmails()"]')).count();
  };

  this.makeMailsRead = function(){
    //need to develop unread mails functionality
    //Following element should make emails Read.
    return element.all(by.css('[ng-click="vm.getUnreadEmails()"]'));
  };

  this.makeMailsUnread = function(){
    //need to develop unread mails functionality
    //Following element should make emails Unread.
    return element.all(by.css('[ng-click="vm.getUnreadEmails()"]'));
  };

  this.getDeleteEmailButton = function(){
    return element(by.css('[ng-click="vm.deleteEmail()"]'));
  };

  this.getRefreshEmailButton = function(){
    return element(by.css('[ng-click="vm.refreshMails()"]'));
  };

 this.getComposeMail = function(){
   return element(by.xpath('//span[@ng-click="vm.open()"]//md-icon'));
  };

  this.setToField = function(value){
    emailToField.clear();
    emailToField.sendKeys(value);
  };

  this.setCCField = function(value){
    emailCcField.clear();
    emailCcField.sendKeys(value);
  };

  this.getBCCFieldButton = function(){
    return element(by.css('[ng-click="vm.isBccVisible = true;"]'));
  };

  this.setBCCField = function(value){
    emailBccField.clear();
    emailBccField.sendKeys(value);
  };

  this.getSuggestion = function(value){
    return element.all(by.css('[ng-repeat="item in suggestionList.items track by track(item)"]'));
  }

  this.setSubject = function(value){
    emailSubject.clear();
    emailSubject.sendKeys(value);
  };

  this.sendEmail = function(){
    return element(by.css('[ng-click="vm.checkSend()"]'));
  };

  this.getInboxFolderSplittedText = function(){
    var text = element(by.xpath('//span[@class="unread"]/span[contains(text(),"Inbox")]')).getText().then(function(value){
      return value.split(" ");
    });
    var splittedText = text.then(function(section){
      return section[1];
    });
    return splittedText;
  };

  this.getDraftFolderText = function(){
    return element(by.xpath('//span[@class="unread"]/span[contains(text(),"Drafts")]')).getText().then(function(value){
      return value;
    });
  };

  this.saveEmailAsDraft = function(){
    //need to develop functionality for Save Draft button.Following element should return save Draft edit button.
    return element(by.css('[ng-click="//button[@ng-click=""]"]'));
  };

  this.getCloseComposeMail = function(){
    return element(by.css('[ng-click="vm.cancel($event)"]'));
  };

  this.getComposeMailConfirmButton = function(){
    return element(by.css('[ng-click="yes()"]'));
  };

  this.getDraftFolderNumber = function(){
    return element(by.xpath('//span[@class="unread"]/span[contains(text(),"Drafts")]/../span[@class="ng-scope"]')).getText().then(function(value){
      var demovalue = value.substring(value.indexOf('(')+1, value.indexOf(')'));
      return number = parseInt(demovalue);
    });
  };

  this.getDraftEdit = function(){
    //need to develop functionality for edit draft mails.
    return element(by.css('[ng-click="vm.editDraft()"]'));
  };

 this.getDraftFolderSplittedText = function(){
   var text = element(by.xpath('//span[@class="unread"]/span[contains(text(),"Drafts")]')).getText().then(function(value){
      return value.split(" ");
    });
    var splittedText = text.then(function(section){
      return section[1];
    });
    return splittedText;
  };

 this.getExpandAll = function(){
    element(by.xpath('//vnc-menu[@items="vm.folderMenu.items"]')).click();
    return element(by.xpath('//span[@ng-click="item.itemFunction(item, data)"]'));
  };

  this.getFolderCollapseButton = function(parentFolder){
    //need to be fixed. Following element should return minus sign element on folderName.
    return element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+parentFolder+'")]/parent::span/parent::div/parent::li//div[@ng-if="item.folder"]//span[@class="pointer ng-scope"]'));
  };

  this.collapseFolderTree = function(folderName){
    return element(by.xpath('//span[contains(text(),"'+ folderName +'")]/..//span[@ng-click="item.collapse = !item.collapse"][3]'));
  };

  this.checkFolderCollapsed = function(folderName){
    return element(by.xpath('//span[contains(text(),"'+ folderName +'")]/../..//ol'));
  };

  this.getShareFolderDialog = function(folderName){
    var scrollToScript = 'document.getElementsByClassName("header-title ng-scope")[0].scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function() {
      element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+folderName+'")]//..//vnc-menu[@items="vm.share.items"]')).click();
    });
    element(by.xpath('//ul[@ng-if="vm.menuContentPosition"]//span[contains(text(),"Share Folder")]')).click();
    expect((element(by.xpath('//div[contains(text(),"Share Folder")]'))).isPresent()).toBe(true);
  };

  this.getEditFolderDialog = function(folderName){
    var scrollToScript = 'document.getElementsByClassName("header-title ng-scope")[0].scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function() {
      element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+folderName+'")]//..//vnc-menu[@items="vm.share.items"]')).click();
    });
    element(by.xpath('//ul[@ng-if="vm.menuContentPosition"]//span[contains(text(),"Edit Properties")]')).click();
    //Need to be fixed. Following element should return Edit dialog.
    expect((element(by.xpath('//div[contains(text(),"Folder Properties")]'))).isPresent()).toBe(true);
  };

  this.getMoveFolderDialog = function(folderName){
    var scrollToScript = 'document.getElementsByClassName("header-title ng-scope")[0].scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function() {
      element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+folderName+'")]//..//vnc-menu[@items="vm.share.items"]')).click();
    });
    element(by.xpath('//ul[@ng-if="vm.menuContentPosition"]//span[contains(text(),"Move Folder")]')).click();
    //Need to be fixed. Following element should return Move dialog.
    expect((element(by.xpath('//h3[contains(text(),"Move Folder "'+folderName+'"")]'))).isPresent()).toBe(true);
  };

  this.getDeleteOption = function(folderName){
    var scrollToScript = 'document.getElementsByClassName("header-title ng-scope")[0].scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function() {
      element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+folderName+'")]//..//vnc-menu[@items="vm.share.items"]')).click();
    });
    expect(element(by.xpath('//div[@class="modal-content"]')).isPresent()).toBe(true);
    element(by.xpath('//ul[@ng-if="vm.menuContentPosition"]//span[contains(text(),"Delete")]')).click();
    element.all(by.css('[ng-click="vm.deleteFolder()"]')).click();
    expect(element(by.xpath('//div[@class="modal-content"]')).isPresent()).toBe(false);
    //Need to be fixed. Following element should return delete notification message text.
    expect(element(by.xpath('//div[contains(text(),"PathToDeleteMessageText")]')).getText()).toEqual('Mail folder "'+folderName+'" moved to Trash');
  };

  this.getCreateNewFolderDialog = function(folderName){
    var scrollToScript = 'document.getElementsByClassName("header-title ng-scope")[0].scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function() {
      element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+folderName+'")]//..//vnc-menu[@items="vm.share.items"]')).click();
    });
    element(by.xpath('//ul[@ng-if="vm.menuContentPosition"]//span[contains(text(),"Create new folder")]')).click();
    //Need to be fixed. Following element should return Create New Folder dialog.
    expect((element(by.xpath('//div[@class="modal-content"]'))).isPresent()).toBe(true);
  };

  this.getShareDialogPrefilledField = function(folderName){
    expect(element(by.xpath('//form[@ng-show="vm.form1"]/div/div/h4')).getText()).toEqual(folderName);
  };

  this.getShareWithOptions = function(){
    return element(by.xpath('//form[@ng-show="vm.form1"]/div[2]'));
  };

  this.getShareWithUserOrGroupOption = function(){
    return element(by.xpath('//form[@ng-show="vm.form1"]/div[2]//label[contains(text(),"User or Group")]'));
  };

  this.getShareWithGuestsOption = function(){
    return element(by.xpath('//form[@ng-show="vm.form1"]/div[2]//label[contains(text(),"Guests")]'));
  };

  this.getShareWithPublicOption = function(){
    return element(by.xpath('//form[@ng-show="vm.form1"]/div[2]//label[contains(text(),"Public")]'));
  };

  this.getShareWithNextButton = function(){
    return element(by.xpath('//button[@ng-click="vm.form1 = false; vm.form2 = true"]'));
  };

  this.getEnterContactsField = function(){
    return element(by.model('newTag.text'));
  };

  this.getSelectRoleViewerOption = function(){
    return element(by.xpath('//form[@ng-show="vm.form2"]/div[2]//label[contains(text(),"Viewer")]'));
  };

  this.getSelectRoleManagerOption = function(){
    return element(by.xpath('//form[@ng-show="vm.form2"]/div[2]//label[contains(text(),"Manager")]'));
  };

  this.getSelectRoleAdminOption = function(){
    return element(by.xpath('//form[@ng-show="vm.form2"]/div[2]//label[contains(text(),"Admin")]'));
  };

  this.getSelectRoleNoneOption = function(){
    return element(by.xpath('//form[@ng-show="vm.form2"]/div[2]//label[contains(text(),"None")]'));
  };

  this.getSelectRoleNextButton = function(){
    return element(by.xpath('//button[@ng-click="vm.form2 = false; vm.form3 = true"]'));
  };

  this.getAddNoteToMessageTextField = function(){
    return element(by.xpath('//textarea[@ng-focus="vm.border = true"]'));
  };

  this.getAddNoteSendStandardMessageOption = function(){
    return element(by.xpath('//form[@ng-show="vm.form3"]/div[2]//label[contains(text(),"Send standard message")]'));
  };

  this.getAddNoteDoNotSendMailOption =function(){
    return element(by.xpath('//form[@ng-show="vm.form3"]/div[2]//label[contains(text(),"Do not send mail")]'));
  };

  this.getShareButton = function(){
    return element(by.xpath('//button[contains(text(),"SHARE")]'));
  };

  this.getShareCreatedToastMessage = function(){
    return element(by.xpath('//div[contains(text(),"Share created")]'));
  };

  this.checkForNoTags = function(){
    var scrollToScript = 'document.getElementById("sidebar-tag").scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function() {
      element(by.xpath('//div[@id="sidebar-tag"]//span[contains(text(),"'+tagName+'")]')).click();
    });
  };

  this.getTagList = function(){
    return element(by.xpath('//div[@id="sidebar-tag"]'));
  };

  this.getTagFromTagList = function(tagName){
    var scrollToScript = 'document.getElementById("sidebar-tag").scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function() {
      element(by.xpath('//div[@id="sidebar-tag"]//span[contains(text(),"'+tagName+'")]')).click()
    });
  };

  this.getCreateNewTagDialogFromTagContextMenu = function(){
    element(by.xpath('//vnc-menu[@items="vm.tagMenu.items"]/md-icon')).click();
    element(by.xpath('//span[@ng-click="vm.open()"]/span[contains(text(),"Create new tag")]')).click();
    //Need to be fixed. Following element should return Create New Tag dialog.
    expect((element(by.xpath('//div[contains(text(),"Create New Tag")]'))).isPresent()).toBe(true);
  };

  this.getHeaderDate = function(){
    return element(by.binding("vm.today | date:'dd'")).getText().then(function(value){
      return parseInt(value);
    });
  };

  this.getHeaderMonth = function(){
    return element(by.binding("vm.today | date:'MMMM'")).getText().then(function(value){
      return value;
    });
  };

  this.getMonthName = function(monthNumber){
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return months[monthNumber];
  };

  this.getHeaderSearchBar = function(){
    return element(by.model('vm.search'));
  };

  this.getHeaderMailIcon = function(){
    return element(by.css('[ui-sref="mail"]'));
  };

  this.getHeaderCalendarIcon = function(){
    return element(by.css('[ui-sref="calendar"]'));
  };

  this.getHeaderTasksIcon = function(){
    return element(by.css('[ui-sref="tasks"]'));
  };
  this.getUserAvtar = function(){
      return element(by.binding('vm.shortName'));
  };

  this.getAvtarDropDown = function(){
    return element(by.xpath('//button[@ng-click="vm.openMenu($mdOpenMenu, $event)"]/md-icon')).click();
  };

  this.getSignOut = function(){
    return element(by.css('[ng-click="vm.logout()"]')).click();
  };

  this.getSearchResultFilterButton = function(){
    return element(by.xpath('//div[@ng-if="vm.email.infiniteScrollDisabled && emails.length"]//i'));
  };

  this.getSearchFilterOption = function(filterName){
    return element(by.xpath('//span[contains(text(),"'+filterName+'")]'));
  };

  this.getSavedSearchPopup = function(){
    //Need to be fixed. Following element should return popup for saved search result.
    return element(by.xpath('//PathToSavedSearchResultPopup'));
  };

  this.getSearchResultCount = function(){
    return element.all(by.repeater('mail in emails')).count().then(function(value){
      return count = value;
    });
  };

  this.getSearchResultNumber = function(){
    return element(by.xpath('//div[@ng-repeat="(d, emails) in vm.email.emails track by $index"]/div/div')).getText().then(function(value){
      var demovalue = value.substring(value.indexOf('(')+1, value.indexOf(')'));
      return number = parseInt(demovalue);
    });
  };

  this.getSearchInContactsOption = function(){
    //Need to be fixed. Following element should return search in contacts option displayed after search result.
    return element(by.xpath('//PathToSearchInContactsOption'));
  };

  this.getSearchInCalendarOption = function(){
    //Need to be fixed. Following element should return search in calendar option displayed after search result.
    return element(by.xpath('//PathToSearchInCalendarOption'));
  };

  this.getSearchInTasksOption = function(){
    //Need to be fixed. Following element should return search in tasks option displayed after search result.
    return element(by.xpath('//PathToSearchInTasksOption'));
  };

  this.getUserAvtarImage = function(){
    return element(by.binding('vm.shortName'));
  };

  this.getUserAvtarInitials = function(){
    return element(by.binding('vm.shortName')).getText().then(function(value){
      return value;
    });
  };

  this.getUserAvtarDefaultImage = function(){
    //need to be fix. Following element shoud return user avtar default image.
    return element(by.xpath('PathToUserAvtarDefaultImage'));
  };

  this.getFloatingCompose = function(){
    element(by.xpath('//button[@ng-click="vm.compose()"]/md-icon')).isDisplayed().then(function(result){
      if(result == true){
          return element(by.xpath('//button[@ng-click="vm.compose()"]/md-icon')).click();
      }else {
          //element(by.xpath('//md-icon[contains(text(),"menu")]')).click();
          element(by.xpath('//div[@ng-if="vm.auth.authenticated"]//md-icon[contains(text(),"menu")]')).click();
          return element(by.xpath('//button[@ng-click="vm.compose()"]/md-icon')).click();
      }
    });
  };

  this.getComposeMailWindow = function(){
    return element(by.xpath('//div[@class="compose-mail ng-scope"]'));
  };

  this.getComposeCalendarWindow = function(){
    return element(by.xpath('//div[@class="modal-content"]'));
  };

  this.getCloseComposeCalendarWindow = function(){
    return element(by.css('[ng-click="vm.cancel()"]'));
  };

  this.getComposeTasksWindow = function(){
    return element(by.xpath('//div[@class="compose-task ng-scope"]'));
  };

  this.getCloseComposeTasksWindow = function(){
    return element(by.css('[ng-click="vm.cancel()"]'));
  };

  this.getComposeWindowFooterFontButton = function(){
    return element(by.xpath('//span[@class="mail-icons"]/i'));
  };

  this.checkComposeWindowFooterFontButtonOptions = function(){
    //Need to be Fixed. Following element should give list of font options.
    return element(by.xpath('//PathToComposeWindowFooterFontButtonOptions'));
  };

  this.getComposeWindowFooterAttachmentButton = function(){
    return element(by.xpath('//i[@ng-model="file"]'));
  };

  this.getComposeWindowFooterMoreOptionsButton = function(){
    return element(by.xpath('//i[@class="glyphicon glyphicon-option-vertical"]'));
  };

  this.checkComposeWindowFooterMoreOptionsButtonOptions = function(){
    //Need to be Fixed. Following element should give list of font options.
    return element(by.xpath('//PathToComposeWindowFooterFontButtonOptions'));
  };

  this.getDraftFolderFirstSavedMail = function(){
    return element.all(by.repeater('mail in emails')).get(0);
    //return element.all(by.repeater('mail in emails')).get(0).getText();
  };

  this.getComposeWindowMailBody = function(){
    return element(by.xpath('//vnc-rich-textbox[@ng-model="vm.content"]//iframe'));
  };

  this.checkChildUserDefineFoldersInsideSystemFolder = function(parentFolder){
    //Following element should return user define folder list created inside system folder.
    return element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+parentFolder+'")]/parent::span/parent::div/parent::li//div[@ng-if="item.folder"]/ol'));
  };

  this.getFolderExpandCollpseImageInsideSystemFolder = function(parentFolder){
    //Following element should return ExpandCollapse image of user define folders inside system folders.
    return element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+parentFolder+'")]/parent::span/parent::div/parent::li//div[@ng-if="item.folder"]//span[@class="pointer ng-scope"]'));
  };

  this.getFolderExpandCollpseImageOutsideSystemFolder = function(parentFolder){
    //Following element should return ExpandCollapse image of user define folders outside system folders.
    return element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+parentFolder+'")]/parent::span/parent::div//i[@aria-hidden="false"]'));
  };

  this.getuserDefineFolderInsideSystemFolder = function(folderName){
    //Following element should return user define folder inside system folder.
    return element(by.xpath('//ol[@ng-model="item.folder"]//span[contains(text(),"'+folderName+'")]'));
  };

  this.getUserFolderDropDownOutsideSystemFolder = function(parentFolder){
    //Following element should return user define folder outside system folder.
    return element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+parentFolder+'")]/../../span[@class="pull-right"]//md-icon')).click();
  };

  this.getUserFolderDropDownInsideSystemFolder = function(parentFolder,childFolder){
    //Following element should return user define folder drop down inside system folder.
    return element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+parentFolder+'")]/../../../div[2]//span[contains(text(),"'+childFolder+'")]/../span[@class="pull-right"]//md-icon'));
  };

  this.getMarkAllAsReadOption = function(){
    return element(by.xpath('//span[contains(text(),"Mark All as Read")]'));
  };

  this.checkUserDefineParanthesisInsideSystemFolder = function(parentFolder,childFolder){
    return element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+parentFolder+'")]/parent::span/parent::div/parent::li//span[contains(text(),"'+childFolder+'")]/span'));
  };

  this.getUserDefineParanthesisTextInsideSystemFolder = function(parentFolder,childFolder){
    return element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+parentFolder+'")]/parent::span/parent::div/parent::li//span[contains(text(),"'+childFolder+'")]/span')).getText().then(function(value){
      return value;
    });
  };

  this.getUserDefineParanthesisNumberInsideSystemFolder = function(parentFolder,childFolder){
    return element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+parentFolder+'")]/parent::span/parent::div/parent::li//span[contains(text(),"'+childFolder+'")]/span')).getText().then(function(value){
      var demovalue = value.substring(value.indexOf('(')+1, value.indexOf(')'));
      return number = parseInt(demovalue);
    });
  };

  this.checkFolderExistInside = function(parentFolder,childFolder){
    return element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+parentFolder+'")]/parent::span/parent::div/parent::li//span[contains(text(),"'+childFolder+'")]')).isPresent().then(function(result){
      return result;
    });
  };

  this.getInsideUserDefineDeleteOption = function(parentFolder,childFolder){
    var scrollToScript = 'document.getElementsByClassName("header-title ng-scope")[0].scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function() {
      element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+parentFolder+'")]/parent::span/parent::div/parent::li//span[contains(text(),"'+childFolder+'")]/parent::span/parent::div//md-icon[@ng-click="vm.selectFolder($index, item)"]')).click();
    });
    expect(element(by.xpath('//div[@class="modal-content"]')).isPresent()).toBe(true);
    element(by.xpath('//ul[@ng-if="vm.menuContentPosition"]//span[contains(text(),"Delete")]')).click();
    element.all(by.css('[ng-click="vm.deleteFolder()"]')).click();
    expect(element(by.xpath('//div[@class="modal-content"]')).isPresent()).toBe(false);
    //Need to be fixed. Following element should return delete notification message text.
    expect(commonFunctions.getNotificationToastMessageText()).toEqual('Mail folder "'+folderName+'" moved to Trash');
  };

  this.getSystemFolderDropDownExpandAllOption = function(){
    //need to be fix. Following element should return System folder drop down Expand All option.
    return element(by.xpath('//span[contains(text(),"Expand All")]'));
  };

  this.getEmptyTrashOption = function(){
    //need to be fix. Following element should return System folder drop down Empty Trash option.
    return element(by.xpath('//span[contains(text(),"Empty Trash")]'));
  };

  this.getEmptyTrashConfirmationDialog = function(){
    return element(by.xpath('//div[@class="modal-content"]'));
  };

  this.getEmptyTrashConfirmationDialogOkButton = function(){
    return element(by.css('[ng-click="vm.emptyTrash()"]')).click();
  };

  this.getEmptyTrashConfirmationDialogCancelButton = function(){
    return element(by.css('[ng-click="vm.cancel()"]')).click();
  };

  this.getRecoverDeletedItemsOption = function(){
    //need to be fix. Following element should return System folder drop down Recover Deleted Items option.
    return element(by.xpath('//span[contains(text(),"Recover Deleted Items")]'));
  };

  this.getRecoverDeletedItemsDialog = function(){
    //need to be fix. Following element should return opening of recover deleted item dialog.
    return element(by.xpath('//div[contains(text(),"Recover Deleted Items")]'));
  };

  this.getShareFolderDialogCancelButton = function(){
    return element(by.xpath('//span[contains(text(),"CANCEL")]'));
  };

  this.getUserDefineChildFolderTree = function(argumentNumber){
    return element(by.xpath('//ol[@ng-model="vm.folders"]/li['+argumentNumber+']//div[@ng-if="item.folder"]//span[@class="pointer ng-scope"]'));
  };

  this.getEditFolderNameField = function(){
    return element(by.model('vm.folderNewName'));
  };

  this.getEditFolderNameFieldText = function(){
    return element(by.model('vm.folderNewName')).getText().then(function(value){
      return value;
    });
  };

  this.getEditFolderColorDropDown = function(){
    return element(by.xpath('//button[@id="color-dropdown"]'));
  };

  this.getEditFolderAddShareButton = function(){
    return element(by.css('[ng-click="vm.addShareFolder()"]'));
  };

  this.getUserDefineChildFolderTree = function(parentFolder){
    return element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+parentFolder+'")]/parent::span/parent::div/parent::li//div[@ng-if="item.folder"]//span[@class="pointer ng-scope"]'));
  };

  this.getToField = function(){
    return emailToField;
  };

  this.checkToFieldPrefilled = function(){
    emailToField.getAttribute('value').then(function(value){
      expect(value.length>0).toBeTruthy();
    });
  };

  this.getCcField = function(){
    return emailCcField;
  };

  this.checkCcFieldPrefilled = function(){
    emailCcField.getAttribute('value').then(function(value){
      expect(value.length>0).toBeTruthy();
    });
  };

  this.getBCCField = function(){
    return emailBccField;
  };

  this.getSubjectField = function(){
    return emailSubject;
  };

  this.checkSubjectFieldPrefilled = function(){
    emailSubject.getAttribute('value').then(function(value){
      expect(value.length>0).toBeTruthy();
    });
  };

  this.checkComposeWindowMailBodyPrefilled = function(){
    emailBody.getAttribute('value').then(function(value){
      expect(value.length>0).toBeTruthy();
    });
  };

  this.getComposeWindowAttachment = function(fileName){
    return element(by.xpath('//div[@ng-repeat="f in vm.files"]//span[contains(text(),"'+fileName+'")]'));
  };

  this.getComposeWindowAttachmentText = function(fileName){
    return element(by.xpath('//div[@ng-repeat="f in vm.files"]//span[contains(text(),"'+fileName+'")]')).getText().then(function(value){
      return value;
    });
  };

  this.checkComposeWindowAttachmentPrefilled = function(fileName){
    element.all(by.css('[ng-repeat="f in vm.files"]')).count().then(function(value){
      expect(value>0).toBeTruthy();
    });
  };

  this.getReplyMailWindow = function(){
    //need to be fixed. Following element should return reply mail window.
    return element(by.xpath('//PathToReplyMailWindow'));
  };

  this.getReplyAllMailWindow = function(){
    //need to be fixed. Following element should return reply all mail window.
    return element(by.xpath('//PathToReplyAllMailWindow'));
  };

  this.getForwardMailWindow = function(){
    //need to be fixed. Following element should return forward mail window.
    return element(by.xpath('//PathToForwardMailWindow'));
  };

  this.getRecoverDeletedItemsCloseDialog = function(){
    //need to be fixed this element should return a value of close button from Recover Deleted Items Dialog box
    return element(by.xpath('//span[contains(text(),"close")]'));
  };

  this.getRecoverDeletedItemsSearcheDialog = function(){
    //need to be fixed this element should return a value of search box from Recover Deleted Items Dialog box
    return element(by.xpath('//searchbox'));
  };

  this.getRecoverDeletedItemssearchButtonDialog = function(){
    //need to be fixed this element should return a value of search button from Recover Deleted Items Dialog box
    return element(by.xpath('//span[contains(text(),"search")]'));
  };

  this.getNewFolderDialog = function(){
    //need to be fixed this element should return a new folder Dialog box
    return element(by.xpath('//div[@class="modal-content"]'));
  };

};
module.exports = new mailLeftPanelPage();
