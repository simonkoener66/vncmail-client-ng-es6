var homePage = require("../page/homePage.js");
var loginPage = require("../page/loginPage.js");
var navigationPage = require("../page/navigationPage.js");
var mailLeftPanelPage = require("../page/mailLeftPanelPage.js");
var mailListPanelPage = require("../page/mailListPanelPage.js");
var mailDetailPanelPage = require("../page/mailDetailPanelPage.js");
var contactLeftPanelPage = require("../page/contactLeftPanelPage.js");
var contactListPanelPage = require("../page/contactListPanelPage.js");
var contactDetailPanelPage = require("../page/contactDetailPanelPage.js");
var calendarLeftPanelPage = require("../page/calendarLeftPanelPage.js");
var calendarListPanelPage = require("../page/calendarListPanelPage.js");
var parentFolder='Inbox', newFolderName='Test', existFolder, contactsFolderName='Contacts', contactsTestFolder='Test', result, sentFolder='Sent';
var enter = browser.actions().sendKeys(protractor.Key.ENTER);
var userArjun='arjun@', userJay='jay@', validEmail='jaydeep@', ;
var subject = 'LONGBODYDATALONGBODYDATALONGBODYDATALONGBODYDATALONGBODYDATALONGBODYDATALONGBODYDATALONGBODYDATA', composeMailBody=' Hello EveryOne';
var attachFilePath = '/home/vnc/Pictures/images_1.jpg', ToFieldValue, CcFieldValue;
var createTagText = 'TestTag', subject='Testing New Mail', deleteMailNotification='1 Conversation moved to Trash';
var contactFirstName='FirstName', contactLastName='LastName', contactEmail='first@last.com', contactPhone='1234567890', contactCompany='VNC';
var folderAlreadyExist = 'Cannot move folder to the selected destination folder. A folder with that name already exists under the destination folder.'


var commonFunctions = function(){

  this.logIn = function(){
    homePage.get();
    loginPage.setUserName(browser.params.inputData.username);
    loginPage.setPassword(browser.params.inputData.password);
    loginPage.getLoginButton().click();
    expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/mail/inbox');
  };

  this.logOut = function(){
    expect(mailLeftPanelPage.getAvtarDropDown().isPresent()).toBe(true);
    mailLeftPanelPage.getAvtarDropDown();
    expect(mailLeftPanelPage.getSignOut().isPresent()).toBe(true);
    mailLeftPanelPage.getSignOut();
    expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/login');
  };

  this.wait = function()  {
    browser.driver.sleep(3000);
  };

  this.navigationToMailPage = function(){
    navigationPage.activateNavigationMenu();
    navigationPage.getMailNavigationMenu().click();
    expect(navigationPage.getNavbarTitle()).toEqual('Mail');
  };

  this.navigationToContactsPage = function(){
    navigationPage.activateNavigationMenu();
    navigationPage.getContactsNavigationMenu().click();
    expect(navigationPage.getNavbarTitle()).toEqual('Contacts');
  };

  this.navigationToCalendarPage = function(){
    navigationPage.activateNavigationMenu();
    navigationPage.getCalenderNavigationMenu().click();
    expect(navigationPage.getNavbarTitle()).toEqual('Calendar');
  };

  this.navigationToTasksPage = function(){
    navigationPage.activateNavigationMenu();
    navigationPage.getTasksNavigationMenu().click();
    expect(navigationPage.getNavbarTitle()).toEqual('Tasks');
  }

  this.navigationToPreferencesPage = function(){
    navigationPage.activateNavigationMenu();
    navigationPage.getPreferencesNavigationMenu().click();
    expect(navigationPage.getNavbarTitle()).toEqual('Preferences');
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

  this.checkShareFolderDialogOpen = function(folderName){
    var scrollToScript = 'document.getElementsByClassName("header-title ng-scope")[0].scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function() {
      element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+folderName+'")]//..//vnc-menu[@items="vm.share.items"]')).click();
    });
    element(by.xpath('//ul[@ng-if="vm.menuContentPosition"]//span[contains(text(),"Share Folder")]')).click();
    expect((element(by.xpath('//div[contains(text(),"Share Folder")]'))).isPresent()).toBe(true);
  };

  this.checkEditFolderDialogOpen = function(folderName){
    var scrollToScript = 'document.getElementsByClassName("header-title ng-scope")[0].scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function() {
      element(by.xpath('//ol[@ng-model="vm.folders"]//span[contains(text(),"'+folderName+'")]//..//vnc-menu[@items="vm.share.items"]')).click();
    });
    element(by.xpath('//ul[@ng-if="vm.menuContentPosition"]//span[contains(text(),"Edit Properties")]')).click();
    //Need to be fixed. Following element should return Edit dialog.
    expect((element(by.xpath('//div[contains(text(),"Folder Properties")]'))).isPresent()).toBe(true);
  };

  this.checkMoveFolderDialogOpen = function(folderName){
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
    expect(commonFunctions.getNotificationToastMessageText()).toEqual('Mail folder "'+folderName+'" moved to Trash');
  };

  this.checkCreateNewFolderDialogOpen = function(folderName){
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

  this.getShareWithCancelButton = function(){
    return element(by.css('[ng-click="vm.cancel()"]'));
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

  this.getEditFolderOkButton = function(){
    return element(by.css('[ng-click="vm.editFolder()"]'));
  };

  this.getEditFolderCancelButton = function(){
    return element(by.css('[ng-click="vm.cancel()"]'));
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

  this.checkCreateNewTagDialogOpen = function(){
    return element(by.xpath('//div[contains(text(),"Create New Tag")]'));
  };

  this.getCreateNewTagDialogFromTagContextMenu = function(){
    element(by.xpath('//vnc-menu[@items="vm.tagMenu.items"]/md-icon')).click();
    element(by.xpath('//span[@ng-click="vm.open()"]/span[contains(text(),"Create new tag")]')).click();
    //Need to be fixed. Following element should return Create New Tag dialog.
    expect(commonFunctions.checkCreateNewTagDialogOpen().isPresent()).toBe(true);
  };

  this.getTagDropDown = function(){
    return element(by.xpath('//vnc-menu[@items="vm.tagMenu.items"]/md-icon')).click();
  };

  this.getOkButtonForCreateTag = function(){
    //need to be fix currently element is not available
    return element(by.css('[ng-click="vm.ok()"]'));
  };

  this.getCancelButtonForCreateTag = function(){
    //need to be fix currently element is not available
    return element(by.css('[ng-click="vm.cancel()"]'));
  };

  this.getCreateTagTextbox = function(){
    //need to be fix currently element is not available
    return element(by.xpath('//Tag name textbox'));
  };

  this.getColourDropdownForCreateTag = function(){
    //need to be fixed currently element is not available
    return  element(by.xpath('//Tag colour dropdown'));
  };

  this.getColourListForCreateTag = function(argumentNumber){
    //need to be fixed currently element is not available
    return element(by.xpath('//ol[@ng-model="vm.colours"]/li['+argumentNumber+']//div[@ng-if="item.colours"]'));
  };

  this.getErrorMessageForTag = function(){
    //need to be fixed currently element is not available
    return element(by.xpath('//Error message'));
  };

  this.getMoreColoreForTag = function(){
    //need to be fixed currently element is not available
    return element(by.xpath('//Get more colour box'));
  };

  this.getMoreColourListForCreateTag = function(argumentNumber){
    //need to be fixed currently element is not available
    return element(by.xpath('//ol[@ng-model="vm.colours"]/li['+argumentNumber+']//div[@ng-if="item.colours"]'));
  };

  this.checkOpeningOfAcceptShareDialog = function(){
    //need to be fix. Following element should return opening of accept share dialog
    return element(by.xpath('//PathToAcceptShareDialogOpen'));
  };

  this.getAcceptShareDialogUserDefineNoteMessageTextField = function(){
    //need to be fix. Following element should return user define Note Message Text field of Accept share dialog.
    return element(by.xpath('//PathToAcceptShareDialogUserDefineNoteMessageTextField'));
  };

  this.getAcceptShareDialogSendStandardMessageOption = function(){
    //need to be fix. Following element should return send standard message option of Accept share dialog.
    return element(by.xpath('//PathToAcceptShareDialogSendStandardMessageOption'));
  };

  this.getAcceptShareDialogDoNotSendMailOption =function(){
    //need to be fix. Following element should return do not send mail option of Accept share dialog.
    return element(by.xpath('//PathToAcceptShareDialogDoNotSendMailOption'));
  };

  this.getAcceptShareDialogAcceptButton = function(){
    //need to be fix. Following element should return accept button of Accept share dialog.
    return element(by.xpath('//button[contains(text(),"Accept")]'));
  };

  this.getAcceptShareDialogDeclineButton = function(){
    //need to be fix. Following element should return decline button of Accept share dialog.
    return element(by.xpath('//button[contains(text(),"Decline")]'));
  };

  this.checkOpeningOfDeclineShareDialog = function(){
    //need to be fix. Following element should return opening of decline share dialog
    return element(by.xpath('//PathToDeclineShareDialogOpen'));
  };

  this.getDeclineShareDialogUserDefineNoteMessageTextField = function(){
    //need to be fix. Following element should return user define Note Message Text field of Decline share dialog.
    return element(by.xpath('//PathToDeclineShareDialogUserDefineNoteMessageTextField'));
  };

  this.getDeclineShareDialogSendStandardMessageOption = function(){
    //need to be fix. Following element should return send standard message option of Decline share dialog.
    return element(by.xpath('//PathToDeclineShareDialogSendStandardMessageOption'));
  };

  this.getDeclinetShareDialogDoNotSendMailOption =function(){
    //need to be fix. Following element should return do not send mail option of Decline share dialog.
    return element(by.xpath('//PathToDeclineShareDialogDoNotSendMailOption'));
  };

  this.getDeclineShareDialogYesButton = function(){
    //need to be fix. Following element should return Yes button of Decline share dialog.
    return element(by.xpath('//button[contains(text(),"Yes")]'));
  };

  this.getDeclineShareDialogNoButton = function(){
    //need to be fix. Following element should return No button of Decline share dialog.
    return element(by.xpath('//button[contains(text(),"No")]'));
  };

  this.checkUserDefineFolderExistance = function(){
    existFolder = mailLeftPanelPage.checkFolderExistInside(parentFolder,newFolderName);
    if(existFolder==true){
      mailLeftPanelPage.getInsideUserDefineDeleteOption(parentFolder,newFolderName);
    };
    commonFunctions.createNewFolder(newFolderName,parentFolder);
  };

  this.checkMailsInsideUsaerDefineFolder = function(){
    mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(parentFolder);
    expect(mailLeftPanelPage.getuserDefineFolderInsideSystemFolder(newFolderName).isPresent()).toBe(true);
    mailLeftPanelPage.getuserDefineFolderInsideSystemFolder(newFolderName).click();
    var checkInsideUserDefineFolderMails = mailLeftPanelPage.getNoResultFoundMessage();
    checkInsideUserDefineFolderMails.isPresent().then(function(value){
      if(value == true){
        //Need to be fix. Following code should compose 100 mails and move them to user define folder.
      };
    });
  };

  this.mailShareCreate = function(){
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
    commonFunctions.getShareWithUserOrGroupOption().click();
    commonFunctions.getShareWithNextButton().click();
    commonFunctions.getEnterContactsField().sendKeys('jay@');
    mailLeftPanelPage.getSuggestion().click();
    commonFunctions.getSelectRoleViewerOption().click();
    commonFunctions.getSelectRoleNextButton().click();
    commonFunctions.getAddNoteToMessageTextField().sendKeys('Add note to message user define note option.');
    commonFunctions.getShareButton().click();
    //need to be develop because Share is not created and dialog not closes, also toast message notification is not displaying.
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(false);
    expect(commonFunctions.getShareCreatedToastMessage().isEnabled()).toBe(true);
  };

  this.composeNewMail = function(){
    commonFunctions.getFloatingCompose();
    expect(mailLeftPanelPage.getComposeMailWindow().isPresent()).toBe(true);
    //need to be fixed. By default Send button should be disabled if Subject is empty.
    expect(mailLeftPanelPage.sendEmail().isEnabled()).toBe(false);
    mailLeftPanelPage.getToField().sendKeys(userArjun);
    commonFunctions.wait();
    enter.perform();
    ToFieldValue = mailLeftPanelPage.getToField().getAttribute('value');
    mailLeftPanelPage.getCcField().sendKeys(userJay);
    commonFunctions.wait();
    enter.perform();
    CcFieldValue = mailLeftPanelPage.getCcField().getAttribute('value');
    mailLeftPanelPage.setSubject(subject);
    expect(mailLeftPanelPage.sendEmail().isEnabled()).toBe(true);
    mailLeftPanelPage.getComposeWindowMailBody().sendKeys(composeMailBody);
    mailLeftPanelPage.getComposeWindowFooterAttachmentButton().sendKeys(attachFilePath);
    commonFunctions.wait();
    mailLeftPanelPage.sendEmail().click();
    expect(mailLeftPanelPage.getComposeMailWindow().isPresent()).toBe(false);
    mailLeftPanelPage.getInboxFolder();
    mailLeftPanelPage.getRefreshEmailButton().click();
    mailListPanelPage.getFirstMail().click();
    expect(mailListPanelPage.getMailListFirstmailSubject()).toContain(subject);
    expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain(subject);
  };

  this.contactShareCreate =function(){
    //Curently this code share contact book with same user but after devlope a code we correct it for use it globally
    expect(contactLeftPanelPage.getContactsFolder().isPresent()).toBe(true);
    contactLeftPanelPage.getContactsFolder();
    commonFunctions.checkShareFolderDialogOpen(contactsFolderName);
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
    commonFunctions.getShareWithUserOrGroupOption().click();
    commonFunctions.getShareWithNextButton().click();
    commonFunctions.getEnterContactsField().sendKeys(validEmail);
    mailLeftPanelPage.getSuggestion().click();
    commonFunctions.getSelectRoleViewerOption().click();
    commonFunctions.getSelectRoleNextButton().click();
    commonFunctions.getAddNoteToMessageTextField().sendKeys('Add note to message user define note option.');
    commonFunctions.getShareButton().click();
    //need to be develop because Share is not created and dialog not closes, also toast message notification is not displaying.
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(false);
    expect(commonFunctions.getShareCreatedToastMessage().isEnabled()).toBe(true);
  };

  this.checkTagRightClickMenuOpen = function(){
    return element(by.css('[ng-if="vm.contextMenuPosition"]'));
  };

  this.getTagRightClickMenuOption = function(optionName){
    return element(by.xpath('//div[@ng-if="vm.contextMenuPosition"]//span[contains(text(),"'+optionName+'")]'));
  };

  this.checkDeleteTagConfirmationDialogOpening = function(){
    return element(by.xpath('//div[@class="delete-mail-modal-content ng-scope"]'));
  };

  this.getDeleteTagConfirmationDialogYesButton = function(){
    //need to be fixed. Following element should return delete tag confirmation dialog Yes button.
    return element(by.css('[ng-click="ok()"]'));
  };

  this.getDeleteTagConfirmationDialogNoButton = function(){
    //need to be fixed. Following element should return delete tag confirmation dialog No button.
    return element(by.css('[ng-click="cancel()"]'));
  };

  this.createNewTag = function(){
    commonFunctions.navigationToMailPage();
    commonFunctions.getCreateNewTagDialogFromTagContextMenu();
    commonFunctions.getCreateTagTextbox().sendKeys(createTagText);
    commonFunctions.getColourDropdownForCreateTag().click();
    expect(commonFunctions.getColourListForCreateTag(1).isPresent()).toBe(true);
    commonFunctions.getColourListForCreateTag(1).click();
    expect(commonFunctions.getOkButtonForCreateTag().isEnabled()).toBe(true);
    commonFunctions.getOkButtonForCreateTag().click();
  };

  this.searchTagFromTagList = function(tagName){
    var scrollToScript = 'document.getElementById("sidebar-tag").scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function(){
      return element(by.xpath('//div[@id="sidebar-tag"]//span[contains(text(),"'+tagName+'")]')).isPresent();
    });
  };

  this.deleteTag = function(createTagText){
    commonFunctions.navigationToMailPage();
    browser.actions().click(commonFunctions.getTagFromTagList(createTagText),protractor.Button.RIGHT).perform();
    expect(commonFunctions.checkTagRightClickMenuOpen().isPresent()).toBe(true);
    expect(commonFunctions.getTagRightClickMenuOption(tagRightClickDeleteOption).isPresent()).toBe(true);
    commonFunctions.getTagRightClickMenuOption(tagRightClickDeleteOption).click();
    expect(commonFunctions.checkDeleteTagConfirmationDialogOpening().isPresent()).toBe(true);
    commonFunctions.getDeleteTagConfirmationDialogYesButton().click();
    expect(commonFunctions.searchTagFromTagList(createTagText)).toEqual(undefined);
  };

  this.getNotificationToastMessage = function(){
    return element(by.xpath('//md-toast[@md-theme="success-toast"]//span'));
  };

  this.getNotificationToastMessageText = function(){
    return element(by.xpath('//md-toast[@md-theme="success-toast"]//span')).getText().then(function(value){
      return value;
    });
  };

  this.getMailListCheckbox = function(subjectName){
    var scrollToScript = 'document.getElementsByClassName("list-item pointer ng-scope ng-isolate-scope layout-row active").scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function(){
      element(by.xpath('//h4[contains(text(),"'+subjectName+'")]/parent::div/parent::div/parent::div/parent::div/parent::div//md-checkbox')).click();
    });
  };

  this.deleteMail = function(parentFolder,subject){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    mailListPanelPage.getMailFromMailList(subject);
    commonFunctions.getMailListCheckbox(subject);
    expect(mailListPanelPage.getMailListHeaderDeleteButton().isEnabled()).toBe(true);
    mailListPanelPage.getMailListHeaderDeleteButton().click();
    expect(commonFunctions.getNotificationToastMessage().isPresent()).toBe(true);
    expect(commonFunctions.getNotificationToastMessageText()).toEqual(deleteMailNotification);
  };

  this.searchMail = function(parentFolder,subject){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.getHeaderSearchBar().clear();
    commonFunctions.getHeaderSearchBar().sendKeys(subject);
    enter.perform();
    expect(mailLeftPanelPage.getNoResultFoundMessage().isPresent()).toBe(false);
    expect(mailListPanelPage.getFirstMail().isPresent()).toBe(true);
    mailListPanelPage.getFirstMail().click();
    commonFunctions.getMailListCheckbox(subject);
    expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toEqual(subject);
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

  this.getUserAvtar = function(){
      return element(by.binding('vm.shortName'));
  };

  this.getAvtarDropDown = function(){
    return element(by.xpath('//button[@ng-click="vm.openMenu($mdOpenMenu, $event)"]/md-icon')).click();
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

  this.getHeaderContactsIcon = function(){
    return element(by.css('[ui-sref="contacts"]'));
  };

  this.getHeaderPreferencesIcon = function(){
    return element(by.css('[ui-sref="preferences"]'));
  };

  this.getMailIconBubble = function(){
    return element(by.css('[ui-sref="mail"]')).getAttribute('data-badge').then(function(value){
      return parseInt(value);
    });
  };

  this.getCalendarIconBubble = function(){
    return element(by.css('[ui-sref="calendar"]')).getAttribute('data-badge').then(function(value){
      return parseInt(value);
    });
  };

  this.getTasksIconBubble = function(){
    return element(by.css('[ui-sref="tasks"]')).getAttribute('data-badge').then(function(value){
      console.log('Task bubble value => ',value);
      return parseInt(value);
    });
  };

  this.getHeaderSearchBarSearchButton = function(){
    return element(by.css('[ng-click="vm.searchEmail()"]'));
  };

  this.createNewFolder = function(newFolderName, parentFolder){
    element(by.xpath('//vnc-menu[@items="vm.folderMenu.items"]')).click();
    element(by.xpath('//span[contains(text(),"Create new folder")]')).click();
    expect(element(by.xpath('//md-dialog[@aria-label="Create New Folder"]')).isPresent()).toBe(true);
    element(by.xpath('//input[@ng-model="vm.folderName"]')).sendKeys(newFolderName);
    element(by.css('[ng-click="vm.createFolder()"]')).click();
  };

  this.createNewContact = function(contactsFolderName,contactFirstName,contactLastName,contactEmail,contactPhone){
    commonFunctions.navigationToContactsPage();
    //Remaining to check folder existance and code for create folder if not present.
    //Code for importing 500-contacts in created folder.
    contactLeftPanelPage.getLeftPanelContactParentFolder(contactsFolderName).click();
    result = contactListPanelPage.getContactListContactName(contactFirstName);
    result.isPresent().then(function(value){
      if(value == true){
        contactListPanelPage.getContactNameFromContactListPanel(contactFirstName).click();
        expect(contactListPanelPage.getContactListHeaderDeleteButton().isEnabled()).toBe(true);
        contactListPanelPage.getContactListHeaderDeleteButton().click();
      };
    });
    commonFunctions.getFloatingCompose();
    expect(contactLeftPanelPage.getContactSaveButton().isPresent()).toBe(false);
    contactLeftPanelPage.getContactFirstNameField().sendKeys(contactFirstName);
    contactLeftPanelPage.getContactLastNameField().sendKeys(contactLastName);
    contactLeftPanelPage.getContactEmailField().sendKeys(contactEmail);
    contactLeftPanelPage.getContactPhoneField().sendKeys(contactPhone);
    contactLeftPanelPage.getContactCompanyField().sendKeys(contactCompany);
    expect(contactLeftPanelPage.getContactSaveButton().isPresent()).toBe(true);
    contactLeftPanelPage.getContactSaveButton().click();
    expect(contactLeftPanelPage.getComposeContactWindow().isPresent()).toBe(false);
    expect(commonFunctions.getNotificationToastMessage().isPresent()).toBe(true);
    expect(commonFunctions.getNotificationToastMessageText()).toEqual(contactCreatedNotification);
  };

  this.deleteContact = function(contactsFolderName,contactsTestFolder,contactName){
    commonFunctions.navigationToContactsPage();
    contactLeftPanelPage.getLeftPanelContactnewFolderName(contactsFolderName,contactsTestFolder).click();
    expect(contactListPanelPage.getContactNameFromContactListPanel(contactName).isPresent()).toBe(true);
    contactListPanelPage.getContactNameFromContactListPanel(contactName).click();
    expect(contactListPanelPage.getContactListHeaderDeleteButton().isEnabled()).toBe(true);
    contactListPanelPage.getContactListHeaderDeleteButton().click();
    expect(commonFunctions.getNotificationToastMessage().isPresent()).toBe(true);
    expect(commonFunctions.getNotificationToastMessageText()).toEqual(deleteContactNotification);
  };

  this.searchContact = function(contactsFolderName,contactName){
    commonFunctions.navigationToContactsPage();
    contactLeftPanelPage.getLeftPanelContactParentFolder(contactsFolderName).click();
    commonFunctions.getHeaderSearchBar().clear();
    commonFunctions.wait();
    commonFunctions.getHeaderSearchBar().sendKeys(contactName);
    commonFunctions.wait();
    enter.perform();
    commonFunctions.getHeaderSearchBarSearchButton().click();
    commonFunctions.wait();
    expect(contactListPanelPage.getContactListNoResultFoundMessage().isDisplayed()).toBe(false);
    expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(true);
    commonFunctions.wait();
    contactListPanelPage.getContactListFirstContact().click();
    expect(contactListPanelPage.getContactListFirstContactText()).toEqual(contactName);
    expect(contactDetailPanelPage.getContactDetailContactName()).toEqual(contactName);
  };

  this.tagMail = function(parentFolder,subject,tagName){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    mailListPanelPage.getMailFromMailList(subject);
    commonFunctions.getMailListCheckbox(subject);
    expect(contactListPanelPage.getContactListHeaderTagButton().isEnabled()).toBe(true);
    contactListPanelPage.getContactListHeaderTagButton().click();
    expect(contactListPanelPage.checkContactListHeaderTagMenuOpen().isPresent()).toBe(true);
    expect(contactListPanelPage.getContactListHeaderTagButtonOption(tagName).isPresent()).toBe(true);
    contactListPanelPage.getContactListHeaderTagButtonOption(tagName).click();
    expect(commonFunctions.getNotificationToastMessage().isPresent()).toBe(true);
    expect(commonFunctions.getNotificationToastMessageText()).toEqual('1 conversation tagged "'+tagName+'"');
  };

  this.deleteTaggedMail = function(parentFolder,subject,tagName,tagOptionRemove){
    commonFunctions.navigationToMailPage();
    commonFunctions.tagMail(parentFolder,subject,tagName);
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    mailListPanelPage.getMailFromMailList(subject);
    commonFunctions.getMailListCheckbox(subject);
    expect(contactListPanelPage.getContactListHeaderTagButton().isEnabled()).toBe(true);
    contactListPanelPage.getContactListHeaderTagButton().click();
    expect(contactListPanelPage.checkContactListHeaderTagMenuOpen().isPresent()).toBe(true);
    expect(contactListPanelPage.getContactListHeaderTagButtonOption(tagOptionRemove).isEnabled()).toBe(true);
    contactListPanelPage.getContactListHeaderTagButtonOption(tagOptionRemove).click();
    expect(commonFunctions.getNotificationToastMessage().isPresent()).toBe(true);
    expect(commonFunctions.getNotificationToastMessageText()).toEqual('Tag "'+tagName+'" removed from 1 conversation');
  };

  this.tagContact = function(contactsFolderName,contactName,tagName){
    commonFunctions.navigationToContactsPage();
    contactLeftPanelPage.getLeftPanelContactParentFolder(contactsFolderName).click();
    expect(contactListPanelPage.getContactNameFromContactListPanel(contactName).isPresent()).toBe(true);
    contactListPanelPage.getContactNameFromContactListPanel(contactName).click();
    expect(contactListPanelPage.getContactListHeaderTagButton().isEnabled()).toBe(true);
    contactListPanelPage.getContactListHeaderTagButton().click();
    expect(contactListPanelPage.checkContactListHeaderTagMenuOpen().isPresent()).toBe(true);
    expect(contactListPanelPage.getContactListHeaderTagButtonOption(tagName).isPresent()).toBe(true);
    contactListPanelPage.getContactListHeaderTagButtonOption(tagName).click();
    expect(commonFunctions.getNotificationToastMessage().isPresent()).toBe(true);
    expect(commonFunctions.getNotificationToastMessageText()).toEqual('1 conversation tagged "'+tagName+'"');
  };

  this.deleteTaggedContact = function(contactsFolderName,contactName,tagName,tagOptionRemove){
    commonFunctions.navigationToContactsPage();
    commonFunctions.tagContact(contactsFolderName,contactName,tagName);
    contactLeftPanelPage.getLeftPanelContactParentFolder(contactsFolderName).click();
    expect(contactListPanelPage.getContactNameFromContactListPanel(contactName).isPresent()).toBe(true);
    contactListPanelPage.getContactNameFromContactListPanel(contactName).click();
    expect(contactListPanelPage.getContactListHeaderTagButton().isEnabled()).toBe(true);
    contactListPanelPage.getContactListHeaderTagButton().click();
    expect(contactListPanelPage.checkContactListHeaderTagMenuOpen().isPresent()).toBe(true);
    expect(contactListPanelPage.getContactListHeaderTagButtonOption(tagOptionRemove).isEnabled()).toBe(true);
    contactListPanelPage.getContactListHeaderTagButtonOption(tagOptionRemove).click();
    expect(commonFunctions.getNotificationToastMessage().isPresent()).toBe(true);
    expect(commonFunctions.getNotificationToastMessageText()).toEqual('Tag "'+tagName+'" removed from 1 conversation');
  };

  this.getMoveFolderNewButton = function(){
    // Need to be fixed this should return new folder button from the Move folder dialog
    return element(by.css('[ui-sref="new folder"]'));
  };

  this.getMoveFolderOKButton = function(){
    // Need to be fixed this should return OK button from the Move folder dialog
    return element(by.css('[ui-sref="ok"]'));
  };

  this.getMoveFolderCancelButton = function(){
    // Need to be fixed this should return Cancel button from the Move folder dialog
    return element(by.css('[ui-sref="cancel"]'));
  };

  this.getMoveFolderDialogSearchField = function(){
    return element(by.model('vm.query'));
  };

  this.getMoveFolderDialogDestinationFolder = function(parentFolder){
    return element(by.xpath('//div[@class="sidebar-folders"]//span[contains(text(),"'+parentFolder+'")]'));
  };

  this.getMoveFolderDialogDestinationFolderPlusMinusButton = function(parentFolder){
    return element(by.xpath('//div[@class="sidebar-folders"]//span[contains(text(),"'+parentFolder+'")]/parent::div//span[@class="pointer ng-scope"]'));
  };

  this.checkMoveFolderDialogUserDefineFolder = function(parentFolder,newFolderName){
    return element(by.xpath('//div[@class="sidebar-folders"]//span[contains(text(),"'+parentFolder+'")]/parent::div/parent::li//span[contains(text(),"'+newFolderName+'")]'));
  };

  this.checkMoveFolderDialogErrorNotification = function(){
    return element(by.binding('::vm.message'));
  };

  this.getMoveFolderDialogErrorNotificationText = function(){
    return element(by.binding('::vm.message')).getText().then(function(value){
      return value;
    });
  };

  this.getMoveFolderDialogErrorNotificationOKbutton = function(){
    return element(by.css('[ng-click="vm.ok()"]'));
  };

  this.getMoveFolderDialog = function(parentFolder){
    expect(commonFunctions.getMoveFolderDialogDestinationFolder(parentFolder).isDisplayed()).toBe(true);
    commonFunctions.getMoveFolderDialogDestinationFolder(parentFolder).click();
    commonFunctions.getMoveFolderOKButton().click();
    if(expect(commonFunctions.getMoveFolderDialogErrorNotificationText()).toEqual(folderAlreadyExist)){
      expect(commonFunctions.getMoveFolderDialogErrorNotificationOKbutton().isPresent()).toBe(true);
      commonFunctions.getMoveFolderDialogErrorNotificationOKbutton().click();
      commonFunctions.getMoveFolderDialogDestinationFolder(sentFolder).click();
      commonFunctions.getMoveFolderOKButton().click();
    };
  };


};
module.exports = new commonFunctions();
