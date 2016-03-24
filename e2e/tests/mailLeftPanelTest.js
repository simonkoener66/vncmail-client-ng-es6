
var homePage = require("../page/homePage.js");
var loginPage = require("../page/loginPage.js");
var commonFunctions = require("../commonFunctions/commonFunctions.js");
var mailLeftPanelPage = require("../page/mailLeftPanelPage.js");
var navigationPage = require("../page/navigationPage.js");
var mailListPanelPage = require("../page/mailListPanelPage.js");
var mailDetailPanelPage = require("../page/mailDetailPanelPage.js");
var today = new Date();
var enter = browser.actions().sendKeys(protractor.Key.ENTER);
var parentFolder='Inbox', newFolderName='Test', sentFolder='Sent', draftsFolder='Drafts', junkFolder='Junk', trashFolder='Trash', newTestFolder='NewTest',childFolder='123', existFolder, result;
var emptyTrashNotification = 'Folder "Trash" emptied', tagName='Tag1', noCreatedTag='Tag123', createTagText= 'TestTag', createTagMorecolorText= 'colorTag', moreTagColor = 10;
var userDefineNoteForDeclineShare = 'Share is Decline', userJay='jay@', subject='Testing New Mail', composeMailBody=' Hello EveryOne', messageNoResultFound='No results found.';
var draftSubject='Saving New Mail as Draft', AddNoteToMessageText='Add note to message user define note option.', shareMailSubjectText='Share Created:';
var sharedItem='Shared item', shareOwner='Owner', shareGrantee='Grantee', shareRole='Role', shareAllowedActions='Allowed actions';

describe('Protractor Suit to test Mail Page', function() {
  afterEach(function() {
    browser.waitForAngular();
  });

  var checkUserDefineFolderExistance = function(){
    existFolder = mailLeftPanelPage.checkFolderExistInside(1,newFolderName);
    if(existFolder==true){
      mailLeftPanelPage.getInsideUserDefineDeleteOption(1,newFolderName);
    };
    mailLeftPanelPage.createNewFolder(newFolderName,parentFolder);
  };

  var checkMailsInsideUsaerDefineFolder = function(){
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

  var shareCreate = function(){
    mailLeftPanelPage.checkLeftSideUserDefineFolders(1).click();
    mailLeftPanelPage.getShareFolderDialog(newFolderName);
    expect(mailLeftPanelPage.getShareWithOptions().isPresent()).toBe(true);
    mailLeftPanelPage.getShareWithUserOrGroupOption().click();
    mailLeftPanelPage.getShareWithNextButton().click();
    mailLeftPanelPage.getEnterContactsField().sendKeys('jay@');
    mailLeftPanelPage.getSuggestion().click();
    mailLeftPanelPage.getSelectRoleViewerOption().click();
    mailLeftPanelPage.getSelectRoleNextButton().click();
    mailLeftPanelPage.getAddNoteToMessageTextField().sendKeys('Add note to message user define note option.');
    mailLeftPanelPage.getShareButton().click();
    //need to be develop because Share is not created and dialog not closes, also toast message notification is not displaying.
    expect(mailLeftPanelPage.getShareWithOptions().isPresent()).toBe(false);
    expect(mailLeftPanelPage.getShareCreatedToastMessage().isEnabled()).toBe(true);
  };

  var navigationToMail = function(){
    navigationPage.activateNavigationMenu();
    navigationPage.getMailNavigationMenu().click();
  };

  it('Login to Uxf', function() {
      commonFunctions.logIn();
  });

  it('Check for Mail option selected in Navigation Menu', function(){
    commonFunctions.navigationToMailPage();
  });

  it('Clicking on Inbox folder', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.getInboxFolder();
    expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/mail/inbox');
  });

  it('Clicking on Sent folder', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.getSentFolder();
    expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/mail/sent');
  });

  it('Clicking on Draft folder', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.getDraftFolder();
    expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/mail/draft');
  });

  it('Clicking on Junk folder', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.getJunkFolder();
    expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/mail/junk');
  });

  it('Clicking on Trash folder', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.getTrashFolder();
    expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/mail/trash');
  });

  it('Check for the list of no user define folders', function(){
    commonFunctions.navigationToMailPage();
    expect(mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).isPresent()).toBe(false);
    expect(mailLeftPanelPage.checkLeftSideUserDefineFolders(sentFolder).isPresent()).toBe(false);
    expect(mailLeftPanelPage.checkLeftSideUserDefineFolders(draftsFolder).isPresent()).toBe(false);
    expect(mailLeftPanelPage.checkLeftSideUserDefineFolders(junkFolder).isPresent()).toBe(false);
    expect(mailLeftPanelPage.checkLeftSideUserDefineFolders(trashFolder).isPresent()).toBe(false);
  });

  it('Checking for "No Result Found Message" in Inbox Folder', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.getInboxFolder();
    expect(mailLeftPanelPage.getNoResultFoundMessage()).toEqual(messageNoResultFound);
  });

  it('Checking display of Unread Mails in Inbox Folder parenthesis', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.getInboxFolder();
    mailLeftPanelPage.makeMailsUnread().click();
    var Text = mailLeftPanelPage.getInboxFolderText();
    expect(Text).toEqual("Inbox (");
  });

  it('Comparing Number of Unread Mails in Inbox Folder parenthesis', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.getInboxFolder();
    var mailunreadcount =  mailLeftPanelPage.getUnreadMailCount();
    expect(mailunreadcount).toEqual(mailLeftPanelPage.getInboxFolderNumber());
  });

  it('Checking display of Unread Mails in Inbox Folder parenthesis after email Read', function(){
    commonFunctions.navigationToMailPage();
    var countBeforeMailRead =  mailLeftPanelPage.getInboxFolderNumber();
    mailLeftPanelPage.makeMailsRead().click();
    var countAfterMailRead =  mailLeftPanelPage.getInboxFolderNumber();
    expect(countAfterMailRead).toEqual(countBeforeMailRead-1);
  });

  it('Checking display of Unread Mails in Inbox Folder parenthesis after email Unread', function(){
    commonFunctions.navigationToMailPage();
    var countBeforeMailUnread =  mailLeftPanelPage.getInboxFolderNumber();
    mailLeftPanelPage.makeMailsUnread().click();
    var countAfterMailUnread =  mailLeftPanelPage.getInboxFolderNumber();
    expect(countAfterMailUnread).toEqual(countBeforeMailUnread+1);
  });

  it('Comparing Number of Unread Mails in Inbox Folder parenthesis after new email received', function(){
    commonFunctions.navigationToMailPage();
    var countBeforeNewMailReceived =  mailLeftPanelPage.getInboxFolderNumber();
    mailLeftPanelPage.getComposeMail().click();
    mailLeftPanelPage.setToField(userJay);
    mailLeftPanelPage.getSuggestion().click();
    mailLeftPanelPage.setCCField(userJay);
    mailLeftPanelPage.getSuggestion().click();
    mailLeftPanelPage.getSuggestion().click();
    mailLeftPanelPage.setSubject(subject);
    expect(mailLeftPanelPage.sendEmail().isEnabled()).toBe(true);
    mailLeftPanelPage.getComposeWindowMailBody().sendKeys(composeMailBody);
    mailLeftPanelPage.sendEmail().click();
    expect(mailLeftPanelPage.getComposeMailWindow().isPresent()).toBe(false);
    mailLeftPanelPage.getRefreshEmailButton().click();
    var countAfterNewMailReceived =  mailLeftPanelPage.getInboxFolderNumber();
    expect(countAfterNewMailReceived).toEqual(countBeforeNewMailReceived);
  });

  it('It should display + sign after number in Inbox Folder parenthesis for unread emails greater than 99.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.getInboxFolder();
    var countBeforeNewMailReceived =  mailLeftPanelPage.getInboxFolderNumber();
    expect(countBeforeNewMailReceived).toEqual(99);
    mailLeftPanelPage.getComposeMail().click();
    mailLeftPanelPage.setToField(userJay);
    mailLeftPanelPage.getSuggestion().click();
    mailLeftPanelPage.setCCField(userJay);
    mailLeftPanelPage.getSuggestion().click();
    mailLeftPanelPage.setSubject(subject);
    expect(mailLeftPanelPage.sendEmail().isEnabled()).toBe(true);
    mailLeftPanelPage.getComposeWindowMailBody().sendKeys(composeMailBody);
    mailLeftPanelPage.sendEmail().click();
    expect(mailLeftPanelPage.getComposeMailWindow().isPresent()).toBe(false);
    mailLeftPanelPage.getRefreshEmailButton().click();
    var countAfterNewMailReceived =  mailLeftPanelPage.getInboxFolderSplittedText();
    expect(countAfterNewMailReceived).toEqual("(99+)");
  });

  it('Checking display of Saved Draft Mails number in Draft Folder parenthesis', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.getInboxFolder();
    mailLeftPanelPage.getComposeMail().click();
    mailLeftPanelPage.setToField(userJay);
    mailLeftPanelPage.getSuggestion().click();
    mailLeftPanelPage.setCCField(userJay);
    mailLeftPanelPage.getSuggestion().click();
    mailLeftPanelPage.setSubject(draftSubject);
    //mailLeftPanelPage.saveEmailAsDraft().click();
    mailLeftPanelPage.getCloseComposeMail().click();
    mailLeftPanelPage.getComposeMailConfirmButton().click();
    var text = mailLeftPanelPage.getDraftFolderText();
    expect(text).toEqual("Drafts (1)");
  });

  it('Comparing Number of Saved Draft Mails in Draft Folder parenthesis after sent email from Drafts folder', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.getDraftFolder();
    var countBeforeNewMailSent =  mailLeftPanelPage.getDraftFolderNumber();
    mailLeftPanelPage.getDraftEdit().click();
    var countAfterNewMailSent =  mailLeftPanelPage.getDraftFolderNumber();
    expect(countAfterNewMailSent).toEqual(countBeforeNewMailSent);
  });

  it('Comparing Number of Saved Draft Mails in Draft Folder parenthesis after saving new email as Draft', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.getDraftFolder();
    var countDraftMailBeforeSave =  mailLeftPanelPage.getDraftFolderNumber();
    mailLeftPanelPage.getInboxFolder().click();
    mailLeftPanelPage.getComposeMail().click();
    mailLeftPanelPage.setToField(userJay);
    mailLeftPanelPage.getSuggestion().click();
    mailLeftPanelPage.setCCField(userJay);
    mailLeftPanelPage.getSuggestion().click();
    mailLeftPanelPage.setSubject(draftSubject);
    //mailLeftPanelPage.saveEmailAsDraft().click();
    mailLeftPanelPage.getCloseComposeMail().click();
    mailLeftPanelPage.getComposeMailConfirmButton().click();
    var countDraftMailAfterSave =  mailLeftPanelPage.getDraftFolderNumber();
    expect(countDraftMailAfterSave).toEqual(countDraftMailBeforeSave+1);
  });

  it('It should display + sign after number in Drafts Folder parenthesis for Saved Emails greater than 99.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.getDraftFolder();
    var countDraftMailBeforeSave =  mailLeftPanelPage.getDraftFolderNumber();
    expect(countDraftMailBeforeSave).toEqual(99);
    mailLeftPanelPage.getComposeMail().click();
    mailLeftPanelPage.setToField(userJay);
    mailLeftPanelPage.getSuggestion().click();
    mailLeftPanelPage.setCCField(userJay);
    mailLeftPanelPage.getSuggestion().click();
    mailLeftPanelPage.setSubject(draftSubject);
    mailLeftPanelPage.getCloseComposeMail().click();
    mailLeftPanelPage.getComposeMailConfirmButton().click();
    var countDraftMailAfterSave =  mailLeftPanelPage.getDraftFolderSplittedText();
    expect(countDraftMailAfterSave).toEqual("(99+)");
  });

  it('It should expand all the parent folders that contains child folder inside.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.getExpandAll().click();
    //Need to be fixed to develop functionality for create folder.
    expect(mailLeftPanelPage.getFolderCollapseButton(parentFolder).isPresent()).toBe(true);
    mailLeftPanelPage.getFolderCollapseButton(parentFolder).click();
    expect(mailLeftPanelPage.getFolderCollapseButton(sentFolder).isPresent()).toBe(true);
    mailLeftPanelPage.getFolderCollapseButton(sentFolder).click();
    //remain to assert
  });

  it('Check for opening of create new folder dialog', function(){
    commonFunctions.navigationToMailPage();
    commonFunctions.createNewFolder('myNewfodler','Calendar');
  });

  it('It should collapse the child folders tree structure and display only Parent folder.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    expect (mailLeftPanelPage.getFolderCollapseButton(parentFolder).isDisplayed()).toBe(true);
  });

  it('It should open share folder dialog.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
  });

  it('It should open edit folder dialog.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkEditFolderDialogOpen(newFolderName);
  });

  it('It should open move folder dialog.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkMoveFolderDialogOpen(newFolderName);
  });

  it('It should delete user define folder with displaying proper message.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.getDeleteOption(newFolderName);
  });

  it('It should open create new folder dialog.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkCreateNewFolderDialogOpen(newFolderName);
  });

  it('It should pre-filled folder name in folder name field in Share folder dialog.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
    commonFunctions.getShareDialogPrefilledField(newFolderName);
  });

  it('It should check share folder share with options.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
    expect(commonFunctions.getShareWithUserOrGroupOption().isSelected()).toBe(false);
    expect(commonFunctions.getShareWithGuestsOption().isSelected()).toBe(false);
    expect(commonFunctions.getShareWithPublicOption().isSelected()).toBe(false);
  });

  it('It should check next button disabled with no share with options selected in Share dialog.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
    expect(commonFunctions.getShareWithUserOrGroupOption().isSelected()).toBe(false);
    expect(commonFunctions.getShareWithGuestsOption().isSelected()).toBe(false);
    expect(commonFunctions.getShareWithPublicOption().isSelected()).toBe(false);
    //need to be fixed. Next button should be disabled If no share with option is selected.
    expect(commonFunctions.getShareWithNextButton().isEnabled()).toBe(false);
  });

  it('It should check public option disabled in Share dialog for only Mail.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
    expect(commonFunctions.getShareWithUserOrGroupOption().isEnabled()).toBe(true);
    expect(commonFunctions.getShareWithGuestsOption().isEnabled()).toBe(true);
    //need to be fixed. Next button should be disabled If no share with option is selected.
    expect(commonFunctions.getShareWithPublicOption().isEnabled()).toBe(false);
  });

  it('It should check next button disabled for Blank/Invalid data and no select role for option User or Group(Internal contact).', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
    commonFunctions.getShareWithUserOrGroupOption().click();
    commonFunctions.getShareWithNextButton().click();
    expect(commonFunctions.getEnterContactsField().value).toEqual(null);
    commonFunctions.getEnterContactsField().sendKeys('jay123@');
    //need to be fixed. Next button should be disabled If mandatory field is empty/Invalid and no role is selected.
    expect(commonFunctions.getSelectRoleNextButton().isEnabled()).toBe(false);
    //need to be fixed. By default "Viewer" option should be selected.
    expect(commonFunctions.getSelectRoleViewerOption().isSelected()).toBe(true);
    //need to be fixed. Next button should be disabled If mandatory field is empty/Invalid and no role is selected.
    expect(commonFunctions.getSelectRoleNextButton().isEnabled()).toBe(false);
  });

  it('It should check next button enabled for valid data with select role option for option User or Group(Internal contact).', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
    commonFunctions.getShareWithUserOrGroupOption().click();
    commonFunctions.getShareWithNextButton().click();
    commonFunctions.getEnterContactsField().sendKeys(userJay);
    mailLeftPanelPage.getSuggestion().click();
    commonFunctions.getSelectRoleViewerOption().click();
    expect(commonFunctions.getSelectRoleNextButton().isEnabled()).toBe(true);
  });

  it('It should check share folder select role options.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
    commonFunctions.getShareWithUserOrGroupOption().click();
    commonFunctions.getShareWithNextButton().click();
    expect(commonFunctions.getSelectRoleViewerOption().isSelected()).toBe(false);
    expect(commonFunctions.getSelectRoleManagerOption().isSelected()).toBe(false);
    expect(commonFunctions.getSelectRoleAdminOption().isSelected()).toBe(false);
    expect(commonFunctions.getSelectRoleNoneOption().isSelected()).toBe(false);
  });

  it('It should check share folder add note to message options with share button disabled.', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
    commonFunctions.getShareWithUserOrGroupOption().click();
    commonFunctions.getShareWithNextButton().click();
    commonFunctions.getEnterContactsField().sendKeys(userJay);
    mailLeftPanelPage.getSuggestion().click();
    commonFunctions.getSelectRoleViewerOption().click();
    commonFunctions.getSelectRoleNextButton().click();
    expect(commonFunctions.getAddNoteToMessageTextField().isSelected()).toBe(false);
    expect(commonFunctions.getAddNoteSendStandardMessageOption().isSelected()).toBe(false);
    expect(commonFunctions.getAddNoteDoNotSendMailOption().isSelected()).toBe(false);
    //need to be Fixed. Because If any add note to message option is not filled/selected then Share button should be disabled.
    expect(commonFunctions.getShareButton().isEnabled()).toBe(false);
  });

  it('It should send share invitation mail to entered email address with toast message "Share Created".', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
    commonFunctions.getShareWithUserOrGroupOption().click();
    commonFunctions.getShareWithNextButton().click();
    commonFunctions.getEnterContactsField().sendKeys(userJay);
    mailLeftPanelPage.getSuggestion().click();
    commonFunctions.getSelectRoleViewerOption().click();
    commonFunctions.getSelectRoleNextButton().click();
    commonFunctions.getAddNoteToMessageTextField().sendKeys(AddNoteToMessageText);
    commonFunctions.getShareButton().click();
    //need to be develop because Share is not created and dialog not closes, also toast message notification is not displaying.
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(false);
    expect(commonFunctions.getShareCreatedToastMessage().isEnabled()).toBe(true);
  });

  it('It should check next button disabled for Blank/Invalid data and no select role for option Guests(External contact,View only).', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
    commonFunctions.getShareWithGuestsOption().click();
    commonFunctions.getShareWithNextButton().click();
    expect(commonFunctions.getEnterContactsField().value).toEqual(null);
    commonFunctions.getEnterContactsField().sendKeys('jay123@');
    //need to be fixed. Next button should be disabled If mandatory field is empty/Invalid and no role is selected.
    expect(commonFunctions.getSelectRoleNextButton().isEnabled()).toBe(false);
    //need to be fixed. By default "Viewer" option should be selected.
    expect(commonFunctions.getSelectRoleViewerOption().isSelected()).toBe(true);
    //need to be fixed. Next button should be disabled If mandatory field is empty/Invalid and no role is selected.
    expect(commonFunctions.getSelectRoleNextButton().isEnabled()).toBe(false);
  });

  it('It should check next button enabled for valid data with select role option for option Guests(External contact,View only).', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
    commonFunctions.getShareWithGuestsOption().click();
    commonFunctions.getShareWithNextButton().click();
    commonFunctions.getEnterContactsField().sendKeys(userJay);
    mailLeftPanelPage.getSuggestion().click();
    commonFunctions.getSelectRoleViewerOption().click();
    expect(commonFunctions.getSelectRoleNextButton().isEnabled()).toBe(true);
  });

  it('It should check share folder add note to message options with share button disabled for Guests(External contact,View only).', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    commonFunctions.getShareWithGuestsOption().click();
    commonFunctions.getShareWithNextButton().click();
    commonFunctions.getEnterContactsField().sendKeys(userJay);
    mailLeftPanelPage.getSuggestion().click();
    commonFunctions.getSelectRoleViewerOption().click();
    commonFunctions.getSelectRoleNextButton().click();
    expect(commonFunctions.getAddNoteToMessageTextField().isSelected()).toBe(false);
    expect(commonFunctions.getAddNoteSendStandardMessageOption().isSelected()).toBe(false);
    expect(commonFunctions.getAddNoteDoNotSendMailOption().isSelected()).toBe(false);
    //need to be Fixed. Because If any add note to message option is not filled/selected then Share button should be disabled.
    expect(commonFunctions.getShareButton().isEnabled()).toBe(false);
  });

  it('It should check share folder add note to message options with share button enabled for Guests(External contact,View only).', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    commonFunctions.getShareWithGuestsOption().click();
    commonFunctions.getShareWithNextButton().click();
    commonFunctions.getEnterContactsField().sendKeys(userJay);
    mailLeftPanelPage.getSuggestion().click();
    commonFunctions.getSelectRoleViewerOption().click();
    commonFunctions.getSelectRoleNextButton().click();
    commonFunctions.getAddNoteToMessageTextField().sendKeys('Please Accept the Share.');
    expect(commonFunctions.getAddNoteSendStandardMessageOption().isSelected()).toBe(false);
    expect(commonFunctions.getAddNoteDoNotSendMailOption().isSelected()).toBe(false);
    expect(commonFunctions.getShareButton().isEnabled()).toBe(true);
    commonFunctions.getAddNoteToMessageTextField().clear();
    commonFunctions.getAddNoteSendStandardMessageOption().click();
    expect(commonFunctions.getAddNoteToMessageTextField().value).toEqual(null);
    expect(commonFunctions.getAddNoteDoNotSendMailOption().isSelected()).toBe(false);
    expect(commonFunctions.getShareButton().isEnabled()).toBe(true);
    commonFunctions.getAddNoteDoNotSendMailOption().click();
    expect(commonFunctions.getAddNoteToMessageTextField().value).toEqual(null);
    expect(commonFunctions.getAddNoteSendStandardMessageOption().isSelected()).toBe(false);
    expect(commonFunctions.getShareButton().isEnabled()).toBe(true);
  });

  it('It should send share invitation mail to entered email address with toast message "Share Created" for Guests(External contact,View only).', function(){
    commonFunctions.navigationToMailPage();
    mailLeftPanelPage.checkLeftSideUserDefineFoldersparentFolder).click();
    commonFunctions.checkShareFolderDialogOpen(newFolderName);
    commonFunctions.getShareWithGuestsOption().click();
    commonFunctions.getShareWithNextButton().click();
    commonFunctions.getEnterContactsField().sendKeys(userJay);
    mailLeftPanelPage.getSuggestion().click();
    commonFunctions.getSelectRoleViewerOption().click();
    commonFunctions.getSelectRoleNextButton().click();
    commonFunctions.getAddNoteToMessageTextField().sendKeys('Adding note in user define add note to message text field.');
    commonFunctions.getShareButton().click();
    //need to be develop because Share is not created and dialog not closes, also toast message notification is not displaying.
    expect(commonFunctions.getShareWithOptions().isPresent()).toBe(false);
    expect(commonFunctions.getShareCreatedToastMessage().isEnabled()).toBe(true);
  });

  it('It should check for Empty/Blank folder name in edit folder dialog with "Add share" & "OK" buttons disabled.', function(){
    commonFunctions.navigationToMailPage();
    //Need to be fixed. Following should open Edit dialog.
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkEditFolderDialogOpen(newFolderName);
    //Remain to check disabled of 'Add share' & 'OK' buttons.
  });

  it('It should display list of folder name(s) with radio buttons along with buttons create new folder, ok & cancel.', function(){
    commonFunctions.navigationToMailPage();
    //Need to be fixed. Following should open Move dialog.
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.checkMoveFolderDialogOpen(newFolderName);
    //Remain to check disabled of 'Create new folder & ok' buttons, If no folder is selected from the list of radio options.
  });

  it('It should delete & move selected folder(s) with its child folders(If any) to Trash with display proper message.', function(){
    commonFunctions.navigationToMailPage();
    //Need to be fixed. Following should delete & move selected folder to Trash with displaying proper message.
    expect(mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).isPresent()).toBe(true);
    mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
    commonFunctions.getDeleteOption(newFolderName);
    expect(mailLeftPanelPage.checkLeftSideUserDefineFolders(trashFolder).isPresent()).toBe(true);
    mailLeftPanelPage.checkLeftSideUserDefineFolders(trashFolder).click();
    expect(mailLeftPanelPage.getDeleteFolder().isPresent()).toBe(true);
  });

  it('It should check for no tags in tag list.', function(){
    commonFunctions.navigationToMailPage();
    commonFunctions.checkForNoTags(noCreatedTag);
  });

  it('It should check list of tags in the tag list.', function(){
    commonFunctions.navigationToMailPage();
    expect(commonFunctions.getTagList().isPresent()).toBe(true);
  });

  it('It should display No result found message in mail list panel, If no emails tagged for the created Tags.',function(){
    commonFunctions.navigationToMailPage();
    expect(commonFunctions.getTagList().isPresent()).toBe(true);
    commonFunctions.getTagFromTagList(tagName);
    expect(mailLeftPanelPage.getNoResultFoundMessage()).toEqual(messageNoResultFound);
  });

  it('It should display list of emails tagged for the selected Tags in the mail list panel.',function(){
    commonFunctions.navigationToMailPage();
    expect(commonFunctions.getTagList().isPresent()).toBe(true);
    commonFunctions.getTagFromTagList(tagName);
    expect(mailListPanelPage.getMailListFirstmailSubject()).toEqual(messageNoResultFound);
  });

  it('It should open create new tag dialog for creating of new tag.',function(){
    commonFunctions.navigationToMailPage();
    //Need to be fixed. Following should open Create New Tag dialog.
	  commonFunctions.getCreateNewTagDialogFromTagContextMenu();
	  //Remain to check disabled of OK' & 'Cancel' buttons for Empty tag names.
  });

  it('Check for the application name display in header part selected from Navigation Menu.', function(){
    commonFunctions.navigationToMailPage();
    commonFunctions.navigationToContactsPage();
    commonFunctions.navigationToTasksPage();
    commonFunctions.navigationToCalendarPage();
  });

  it('It should display current date and month name in the header.',function(){
    commonFunctions.navigationToMailPage();
    expect(commonFunctions.getHeaderDate()).toEqual(today.getDate());
    expect(commonFunctions.getHeaderMonth()).toEqual(commonFunctions.getMonthName(today.getMonth()));
  });

  it('It should display search bar for searching items in application.',function(){
    commonFunctions.navigationToMailPage();
    expect(mailLeftPanelPage.getHeaderSearchBar().isPresent()).toBe(true);
  });

  it('It should display application icons and redirect user to particular application page when clicking on it.',function(){
    commonFunctions.navigationToMailPage();
    expect(commonFunctions.getHeaderMailIcon().isPresent()).toBe(true);
    //need to be fixed. It should redirect user to mail application page.
    commonFunctions.getHeaderMailIcon().click();
    expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/mail/inbox');
    expect(commonFunctions.getHeaderCalendarIcon().isPresent()).toBe(true);
    //need to be fixed. It should redirect user to calendar application page.
    commonFunctions.getHeaderCalendarIcon().click();
    expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/calendar/month');
    expect(commonFunctions.getHeaderTasksIcon().isPresent()).toBe(true);
    //need to be fixed. It should redirect user to tasks application page.
    commonFunctions.getHeaderTasksIcon().click();
    expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/tasks/list');
  });

  it('It should display user image in avtar and on clicking avtar user should get option to logout.',function(){
    commonFunctions.navigationToMailPage();
    commonFunctions.logOut();
  });

  it('Header Search bar should search and display result/message according to the valid/Invalid data entered.',function(){
      describe("Protractor suite to test Header Search Bar",function(){
          it('It should display message No results found if searching with No data or only with white spaces.',function(){
              commonFunctions.navigationToMailPage();
              mailLeftPanelPage.getHeaderSearchBar().click();
              mailLeftPanelPage.getHeaderSearchBar().clear();
              enter.perform();
              //need to fix. For Blank search it should display No results found message in mail list panel.
              expect(mailLeftPanelPage.getNoResultFoundMessage()).toEqual(messageNoResultFound);
              mailLeftPanelPage.getHeaderSearchBar().clear();
              mailLeftPanelPage.getHeaderSearchBar().sendKeys('     ');
              enter.perform();
              //need to fix. For Blank search it should display No results found message in mail list panel.
              expect(mailLeftPanelPage.getNoResultFoundMessage()).toEqual(messageNoResultFound);
          });

          it('It should display message No results found If searching with wrong data.',function(){
              commonFunctions.navigationToMailPage();
              mailLeftPanelPage.getHeaderSearchBar().clear();
              mailLeftPanelPage.getHeaderSearchBar().sendKeys('abcdefgh12345678');
              enter.perform();
              //need to fix. For Blank search it should display No results found message in mail list panel.
              expect(mailLeftPanelPage.getNoResultFoundMessage()).toEqual(messageNoResultFound);
          });

          it('It should display search result in mail list panel according to the keyword entered in the search bar.',function(){
              commonFunctions.navigationToMailPage();
              mailLeftPanelPage.getHeaderSearchBar().clear();
              mailLeftPanelPage.getHeaderSearchBar().sendKeys('Test');
              enter.perform();
              expect(mailLeftPanelPage.getSearchResultFilterButton().isPresent()).toBe(true);
          });

          it('It should save search data with applied filters(If any) & display result in a popup when searching with same keyword.',function(){
              commonFunctions.navigationToMailPage();
              mailLeftPanelPage.getHeaderSearchBar().clear();
              mailLeftPanelPage.getHeaderSearchBar().sendKeys('Test');
              enter.perform();
              expect(mailLeftPanelPage.getSearchResultFilterButton().isPresent()).toBe(true);
              mailLeftPanelPage.getSearchResultFilterButton().click();
              mailLeftPanelPage.getSearchFilterOption('Save this search').click();
              mailLeftPanelPage.getHeaderSearchBar().clear();
              mailLeftPanelPage.getHeaderSearchBar().sendKeys('Test');
              enter.perform();
              //need to be fix. It should display popup for saved search result.
              expect((mailLeftPanelPage.getSavedSearchPopup()).isPresent()).toBe(true);
          });

          it('It should display result according to filter apply & If nothing found then display message No results found.',function(){
              commonFunctions.navigationToMailPage();
              mailLeftPanelPage.getHeaderSearchBar().clear();
              mailLeftPanelPage.getHeaderSearchBar().sendKeys('Test');
              enter.perform();
              expect(mailLeftPanelPage.getSearchResultFilterButton().isPresent()).toBe(true);
              mailLeftPanelPage.getSearchResultFilterButton().click();
              mailLeftPanelPage.getSearchFilterOption('Attachment').click();
              mailLeftPanelPage.getSearchResultFilterButton().click();
              mailLeftPanelPage.getSearchFilterOption('Unread').click();
              //need to fix.For nothing found according to selected filter, it should display No results found message in mail list panel.
              expect(mailLeftPanelPage.getNoResultFoundMessage()).toEqual(messageNoResultFound);
          });

          it('It should display search result according to the text entered & no of search and result should be match.',function(){
              commonFunctions.navigationToMailPage();
              mailLeftPanelPage.getHeaderSearchBar().clear();
              mailLeftPanelPage.getHeaderSearchBar().sendKeys('Test');
              enter.perform();
              expect(mailLeftPanelPage.getSearchResultFilterButton().isPresent()).toBe(true);
              var totalSearchMailCount = mailLeftPanelPage.getSearchResultCount();
              var searchResultNumber = mailLeftPanelPage.getSearchResultNumber();
              expect(searchResultNumber).toEqual(totalSearchMailCount);
          });

          it('It should allow to search in Contacts, search in Calendar and search in Tasks from search result.',function(){
              commonFunctions.navigationToMailPage();
              mailLeftPanelPage.getHeaderSearchBar().clear();
              mailLeftPanelPage.getHeaderSearchBar().sendKeys('Test');
              enter.perform();
              expect(mailLeftPanelPage.getSearchResultFilterButton().isPresent()).toBe(true);
              //need to fix. It should display search options like search in Contacts/Calendar/Tasks after search result.
              expect((mailLeftPanelPage.getSearchInContactsOption()).isPresent()).toBe(true);
              expect((mailLeftPanelPage.getSearchInCalendarOption()).isPresent()).toBe(true);
              expect((mailLeftPanelPage.getSearchInTasksOption()).isPresent()).toBe(true);
          });
      });
  });

  it('Application icons in header part should redirect user to particular application page.',function(){
      describe("Protractor suite to test Application icons in header part",function(){
          it('It should redirect user on Mail application page.',function(){
            commonFunctions.navigationToMailPage();
            expect(commonFunctions.getHeaderMailIcon().isPresent()).toBe(true);
            commonFunctions.getHeaderMailIcon().click();
            expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/mail/inbox');
          });

          it('It should redirect user on Calendar application page.',function(){
            commonFunctions.navigationToMailPage();
            expect(commonFunctions.getHeaderCalendarIcon().isPresent()).toBe(true);
            commonFunctions.getHeaderCalendarIcon().click();
            expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/calendar/month');
          });

          it('It should redirect user on Tasks application page.',function(){
            commonFunctions.navigationToMailPage();
            expect(commonFunctions.getHeaderTasksIcon().isPresent()).toBe(true);
            commonFunctions.getHeaderTasksIcon().click();
            expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/tasks/list');
          });

          it('It should check bubble presence/absence on respective application icons.',function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getHeaderMailIcon().click();
            expect(commonFunctions.getMailIconBubble()).toEqual(0);
            commonFunctions.getHeaderCalendarIcon().click();
            expect(commonFunctions.getCalendarIconBubble()).toEqual(0);
            commonFunctions.getHeaderTasksIcon().click();
            expect(commonFunctions.getTasksIconBubble()).toEqual(0);
          });

          it('It should redirect user on Contacts application page.',function(){
            commonFunctions.navigationToMailPage();
            expect(commonFunctions.getHeaderContactsIcon().isPresent()).toBe(true);
            commonFunctions.getHeaderContactsIcon().click();
            expect(browser.getCurrentUrl()).toContain(browser.params.serverUrl.url+'/contacts/list');
          });

          it('It should redirect user on Preferences application page.',function(){
            commonFunctions.navigationToMailPage();
            expect(commonFunctions.getHeaderPreferencesIcon().isPresent()).toBe(true);
            commonFunctions.getHeaderPreferencesIcon().click();
            expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/preferences/import');
          });
      });
  });

  it('User Avtar in header part should display user image(If set) or display name initials in avtar as per contact details saved.',function(){
      describe("Protractor suite to test User avtar in header part",function(){
          it('It should display user image in avtar.',function(){
            commonFunctions.navigationToMailPage();
            expect(mailLeftPanelPage.getUserAvtarImage().isPresent()).toBe(true);
          });

          it("It should display user's forename's & surname's first letter in Avtar.",function(){
            commonFunctions.navigationToMailPage();
            expect(mailLeftPanelPage.getUserAvtarInitials()).toEqual('JR');
          });

          it("It should display user's forename's first letter in the Avtar, If only forename is given.",function(){
            commonFunctions.navigationToMailPage();
            expect(mailLeftPanelPage.getUserAvtarInitials()).toEqual('J');
          });

          it("It should display user's surname's first letter in the Avtar, If only surname is given.",function(){
            commonFunctions.navigationToMailPage();
            expect(mailLeftPanelPage.getUserAvtarInitials()).toEqual('R');
          });

          it('It should display default avtar if both forename and surname are absent.',function(){
            commonFunctions.navigationToMailPage();
            expect(mailLeftPanelPage.getUserAvtarDefaultImage().isPresent()).toBe(true);
          });

          it('It should open drop down with option to logout.',function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.logOut();
          });
      });
  });

  it("Floating Compose button should open compose window for currently opened application.",function(){
      describe("Protractor suite to test Floating Compose Button",function(){
          it("It should open new compose mail dialog when clicking on floating compose button from mail application page.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getFloatingCompose();
            expect(mailLeftPanelPage.getComposeMailWindow().isPresent()).toBe(true);
            //need to be fix. Compose mail window should be closed by clicking folllowing window cancel button.
            mailLeftPanelPage.getCloseComposeMail().click();
            browser.getCurrentUrl();
          });

          it("It should open new create contact dialog when clicking on floating compose button from contact application page.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getHeaderContactsIcon().click();
            commonFunctions.getFloatingCompose();
	          expect(contactLeftPanelPage.getComposeContactWindow().isPresent()).toBe(true);
            contactLeftPanelPage.getCloseComposeContactWindow().click();
          });

          it("It should open new create appointment dialog when clicking on floating compose button from calendar application page.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getHeaderCalendarIcon().click();
            commonFunctions.getFloatingCompose();
            expect(mailLeftPanelPage.getComposeCalendarWindow().isPresent()).toBe(true);
            mailLeftPanelPage.getCloseComposeCalendarWindow().click();
          });

          it("It should open new create task dialog when clicking on floating compose button from tasks application page.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getHeaderTasksIcon().click();
            commonFunctions.getFloatingCompose();
            expect(mailLeftPanelPage.getComposeTasksWindow().isPresent()).toBe(true);
            mailLeftPanelPage.getCloseComposeTasksWindow().click();
          });
      });
  });

  it("Compose mail dialog should allow user to compose new mail.",function(){
      describe("Protractor suite to test Compose mail dialog",function(){

          it("It should check for the User or Groups name suggestion list and fill them in To, CC & BCC field.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getFloatingCompose();
            expect(mailLeftPanelPage.getComposeMailWindow().isPresent()).toBe(true);
            mailLeftPanelPage.setToField(userJay);
            mailLeftPanelPage.getSuggestion().click();
            mailLeftPanelPage.setCCField(userJay);
            mailLeftPanelPage.getSuggestion().click();
          });

          it("It should fill subject name and check enabled/disabled of send button.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getFloatingCompose();
            expect(mailLeftPanelPage.getComposeMailWindow().isPresent()).toBe(true);
            //need to be fixed. By default Send button should be disabled if Subject is empty.
            expect(mailLeftPanelPage.sendEmail().isEnabled()).toBe(false);
            expect(mailLeftPanelPage.getComposeWindowFooterFontButton().isPresent()).toBe(true);
            expect(mailLeftPanelPage.getComposeWindowFooterAttachmentButton().isPresent()).toBe(true);
            expect(mailLeftPanelPage.getComposeWindowFooterMoreOptionsButton().isPresent()).toBe(true);
            expect(mailLeftPanelPage.saveEmailAsDraft().isPresent()).toBe(true);
            expect(mailLeftPanelPage.sendEmail().isPresent()).toBe(true);
            mailLeftPanelPage.setToField(userJay);
            mailLeftPanelPage.getSuggestion().click();
            mailLeftPanelPage.setCCField(userJay);
            mailLeftPanelPage.getSuggestion().click();
            mailLeftPanelPage.setSubject(subject);
            expect(mailLeftPanelPage.sendEmail().isEnabled()).toBe(true);
            mailLeftPanelPage.getComposeWindowMailBody().sendKeys(composeMailBody);
          });

          it("It should provide user to have different font style options like bold, italic, underline etc.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getFloatingCompose();
            expect(mailLeftPanelPage.getComposeMailWindow().isPresent()).toBe(true);
            mailLeftPanelPage.getComposeWindowFooterFontButton().click();
            //need to be fixed. [Note:-More actions have not defined yet.]
            expect(mailLeftPanelPage.checkComposeWindowFooterFontButtonOptions().isPresent()).toBe(true);
          });

          it("It should attach your attachment(s) to email.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getFloatingCompose();
            expect(mailLeftPanelPage.getComposeMailWindow().isPresent()).toBe(true);
            mailLeftPanelPage.getComposeWindowFooterAttachmentButton().click();
          });

          it("It should provide and display more options to user.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getFloatingCompose();
            expect(mailLeftPanelPage.getComposeMailWindow().isPresent()).toBe(true);
            mailLeftPanelPage.getComposeWindowFooterMoreOptionsButton().click();
            //need to be fixed. [Note:-More actions have not defined yet.]
            expect(mailLeftPanelPage.checkComposeWindowFooterMoreOptionsButtonOptions().isPresent()).toBe(true);
          });

          it("It should save mail in draft folder with successfull message “Draft saved”.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getFloatingCompose();
            expect(mailLeftPanelPage.getComposeMailWindow().isPresent()).toBe(true);
            mailLeftPanelPage.setToField(userJay);
            mailLeftPanelPage.getSuggestion().click();
            mailLeftPanelPage.setCCField(userJay);
            mailLeftPanelPage.getSuggestion().click();
            mailLeftPanelPage.setSubject(subject);
            expect(mailLeftPanelPage.sendEmail().isEnabled()).toBe(true);
            mailLeftPanelPage.getComposeWindowMailBody().sendKeys(composeMailBody);
            mailLeftPanelPage.saveEmailAsDraft().click();
            //need to be fix. Following should check draft saved message notification displayed.
            expect(commonFunctions.getNotificationToastMessage().isPresent()).toBe(true);
            mailLeftPanelPage.getCloseComposeMail().click();
            mailLeftPanelPage.getComposeMailConfirmButton().click();
            mailLeftPanelPage.getDraftFolder();
            mailLeftPanelPage.getDraftFolderFirstSavedMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toEqual(subject);
          });

          it("It should send email with successful message “Message sent”.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getFloatingCompose();
            expect(mailLeftPanelPage.getComposeMailWindow().isPresent()).toBe(true);
            //need to be fixed. By default Send button should be disabled if Subject is empty.
            expect(mailLeftPanelPage.sendEmail().isEnabled()).toBe(false);
            mailLeftPanelPage.setToField(userJay);
            mailLeftPanelPage.getSuggestion().click();
            mailLeftPanelPage.setCCField(userJay);
            mailLeftPanelPage.getSuggestion().click();
            mailLeftPanelPage.setSubject(subject);
            expect(mailLeftPanelPage.sendEmail().isEnabled()).toBe(true);
            mailLeftPanelPage.getComposeWindowMailBody().sendKeys(composeMailBody);
            mailLeftPanelPage.sendEmail().click();
            expect(commonFunctions.getNotificationToastMessage().isPresent()).toBe(true);
            mailLeftPanelPage.getRefreshEmailButton().click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toEqual(subject);
          });
      });
  });

  it("It should display Parent/Child user define folders in left side panel.",function(){
      describe("Protractor suite to test left side user define folders.",function(){

          it("It should not display list of user define folders.",function(){
            commonFunctions.navigationToMailPage();
            //Following should check user define folders created outside system folders in left side panel.
            expect(mailLeftPanelPage.checkLeftSideUserDefineFolders(newTestFolder).isPresent()).toBe(false);
            //Following should check user define folders created inside sytem folders in left side panel.
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(false);
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(sentFolder).isPresent()).toBe(false);
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(draftsFolder).isPresent()).toBe(false);
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(junkFolder).isPresent()).toBe(false);
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(trashFolder).isPresent()).toBe(false);
          });

          it("It should display list of user define folders with absence of folder tree structure.",function(){
            commonFunctions.navigationToMailPage();
            //Following should check absence of tree structure in user define folders outside system folders in left side panel.
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(newTestFolder).isPresent()).toBe(false);
            //Following should check absence of tree structure in user define folders inside system folders in left side panel.
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageInsideSystemFolder(parentFolder).isPresent()).toBe(false);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(sentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageInsideSystemFolder(parentFolder).isPresent()).toBe(false);
          });

          it("It should display list of user define folders with presence of folder tree structure.",function(){
            commonFunctions.navigationToMailPage();
            //Following should check presence of tree structure in user define folders outside system folders in left side panel.
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(newTestFolder).isPresent()).toBe(true);
            //Following should check presence of tree structure in user define folders inside system folders in left side panel.
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageInsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(sentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageInsideSystemFolder(parentFolder).isPresent()).toBe(true);
          });

          it("It should expand the folder and display its child folders.",function(){
            commonFunctions.navigationToMailPage();
            //Following should display child folders created inside user define folders outside system folders in left side panel.
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(newTestFolder).click();
            //Following should display child folders created inside user define folders inside system folders in left side panel.
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            mailLeftPanelPage.getFolderExpandCollpseImageInsideSystemFolder(parentFolder).click();
          });

          it("It should collapse the child folders tree structure and display only Parent folder.",function(){
            commonFunctions.navigationToMailPage();
            //Following should display only parent user define folder outside system folders in left side panel.
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(newTestFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(newTestFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(newTestFolder).click();
            //Following should display only parent user define folder inside system folders in left side panel.
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            mailLeftPanelPage.getFolderExpandCollpseImageInsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageInsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageInsideSystemFolder(parentFolder).click();
          });

          it("It should display data of user define folder/No results found message in mail list panel.",function(){
            commonFunctions.navigationToMailPage();
            //Following should display data/No results found message for user define folder outside system folders in left side panel.
            mailLeftPanelPage.checkLeftSideUserDefineFolders(newTestFolder).click();
            expect(mailLeftPanelPage.getNoResultFoundMessage()).toEqual(messageNoResultFound);
            //Following should display data/No results found message for user define folder inside system folders in left side panel.
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.getuserDefineFolderInsideSystemFolder('Test').isPresent()).toBe(true);
            mailLeftPanelPage.getuserDefineFolderInsideSystemFolder('Test').click();
            expect(mailLeftPanelPage.getNoResultFoundMessage()).toEqual(messageNoResultFound);
          });

          it("It should maintain folder tree hierarchy and create new child folders inside its respective parent folder.",function(){
            commonFunctions.navigationToMailPage();
            expect(mailLeftPanelPage.checkLeftSideUserDefineFolders(newTestFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(newTestFolder);
            var newFolderName = 'ABC';
            commonFunctions.createNewFolder(newFolderName,newTestFolder);
            mailLeftPanelPage.checkLeftSideUserDefineFolders(newTestFolder).click();
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(newTestFolder).isPresent()).toBe(true);
          });
      });
  });

  it("It should display Unread messages number in parenthesis for user define folders in left side panel.",function(){
      describe("Protractor suite to test Unread messages for User defined folders.",function(){

          it("Checking display of Unread Mails in User define folder parenthesis",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.checkUserDefineFolderExistance();
            commonFunctions.checkMailsInsideUsaerDefineFolder();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getuserDefineFolderInsideSystemFolder(newFolderName).isPresent()).toBe(true);
            mailLeftPanelPage.getuserDefineFolderInsideSystemFolder(newFolderName).click();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            mailLeftPanelPage.getMarkAllAsReadOption().click();
            mailLeftPanelPage.getuserDefineFolderInsideSystemFolder(newFolderName).click();
            mailLeftPanelPage.makeMailsUnread().click();
            expect(mailLeftPanelPage.checkUserDefineParanthesisInsideSystemFolder(parentFolder,newFolderName).isPresent()).toBe(true);
          });

          it("Comparing Number of Unread Mails in User define folder parenthesis",function(){
            commonFunctions.navigationToMailPage();
            result = mailLeftPanelPage.checkUserDefineParanthesisInsideSystemFolder(parentFolder,newFolderName);
	          result.isPresent().then(function(value){
              if(value == false){
	               mailLeftPanelPage.makeMailsUnread().click();
              };
            });
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getuserDefineFolderInsideSystemFolder(newFolderName).isPresent()).toBe(true);
            mailLeftPanelPage.getuserDefineFolderInsideSystemFolder(newFolderName).click();
            expect(mailLeftPanelPage.getUnreadMailCount()).toEqual(mailLeftPanelPage.getUserDefineParanthesisNumberInsideSystemFolder(parentFolder,newFolderName));
          });

          it("Comparing Number of Unread Mails in User define folder parenthesis after new email received",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getuserDefineFolderInsideSystemFolder(newFolderName).isPresent()).toBe(true);
            var countBeforeNewMailReceivedInside =  mailLeftPanelPage.getUserDefineParanthesisNumberInsideSystemFolder(parentFolder,newFolderName);
            mailLeftPanelPage.getComposeMail().click();
            mailLeftPanelPage.setToField(userJay);
            mailLeftPanelPage.getSuggestion().click();
            mailLeftPanelPage.setCCField(userJay);
            mailLeftPanelPage.getSuggestion().click();
            mailLeftPanelPage.setSubject(subject);
            expect(mailLeftPanelPage.sendEmail().isEnabled()).toBe(true);
            mailLeftPanelPage.getComposeWindowMailBody().sendKeys(composeMailBody);
            mailLeftPanelPage.sendEmail().click();
            expect(mailLeftPanelPage.getComposeMailWindow().isPresent()).toBe(false);
            mailLeftPanelPage.getRefreshEmailButton().click();
            var countAfterNewMailReceivedInside =  mailLeftPanelPage.getUserDefineParanthesisNumberInsideSystemFolder(parentFolder,newFolderName);
            expect(countAfterNewMailReceivedInside).toEqual(countBeforeNewMailReceivedInside);
          });

          it("Checking display of Unread Mails in User define folder parenthesis after email Read",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getuserDefineFolderInsideSystemFolder(newFolderName).isPresent()).toBe(true);
            var countBeforeMailReadInside =  mailLeftPanelPage.getUserDefineParanthesisNumberInsideSystemFolder(parentFolder,newFolderName);
            mailLeftPanelPage.makeMailsRead().click();
            var countAfterMailReadInside =  mailLeftPanelPage.getUserDefineParanthesisNumberInsideSystemFolder(parentFolder,newFolderName);
            expect(countAfterMailReadInside).toEqual((countBeforeMailReadInside) + 1);
          });

          it("Checking display of Unread Mails in User define folder parenthesis after email Unread",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getuserDefineFolderInsideSystemFolder(newFolderName).isPresent()).toBe(true);
            var countBeforeMailUnreadInside =  mailLeftPanelPage.getUserDefineParanthesisNumberInsideSystemFolder(parentFolder,newFolderName);
            mailLeftPanelPage.makeMailsUnread().click();
            var countAfterMailUnreadInside =  mailLeftPanelPage.getUserDefineParanthesisNumberInsideSystemFolder(parentFolder,newFolderName);
            expect(countAfterMailUnreadInside).toEqual((countBeforeMailUnreadInside) + 1);
          });

          it("It should display + sign after number in User define folder parenthesis for unread emails greater than 99.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getuserDefineFolderInsideSystemFolder(newFolderName).isPresent()).toBe(true);
            var countBeforeNewMailReceivedInside =  mailLeftPanelPage.getUserDefineParanthesisTextInsideSystemFolder(parentFolder,newFolderName);
            expect(countBeforeNewMailReceivedInside).toEqual("(99)");
            mailLeftPanelPage.getComposeMail().click();
            mailLeftPanelPage.setToField(userJay);
            mailLeftPanelPage.getSuggestion().click();
            mailLeftPanelPage.setCCField(userJay);
            mailLeftPanelPage.getSuggestion().click();
            mailLeftPanelPage.setSubject(subject);
            expect(mailLeftPanelPage.sendEmail().isEnabled()).toBe(true);
            mailLeftPanelPage.getComposeWindowMailBody().sendKeys(composeMailBody);
            mailLeftPanelPage.sendEmail().click();
            expect(mailLeftPanelPage.getComposeMailWindow().isPresent()).toBe(false);
            mailLeftPanelPage.getRefreshEmailButton().click();
            var countAfterNewMailReceivedInside =  mailLeftPanelPage.getUserDefineParanthesisTextInsideSystemFolder(parentFolder,newFolderName);
            expect(countAfterNewMailReceivedInside).toEqual("(99+)");
          });
      });
  });

  it("Share Created E-Mail Accept share dialog should display information about created share.",function(){
      describe("Protractor suite to test Share Created E-Mail Accept share dialog.",function(){

          it("It should send user define note to reply owner for share acceptance.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.mailShareCreate();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain(shareMailSubjectText);
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain(shareMailSubjectText);
            //need to be fixed. Following should click Accept share button in share created email in mail detail view.
            mailDetailPanelPage.getMailDetailAcceptShareButton().click();
            expect(commonFunctions.checkOpeningOfAcceptShareDialog().isPresent()).toBe(true);
            //need to be fixed. Following should send user define note message in accept dialog text field.
            commonFunctions.getAcceptShareDialogUserDefineNoteMessageTextField().sendKeys('Accepted');
            commonFunctions.getAcceptShareDialogDeclineButton().click();
            expect(commonFunctions.checkOpeningOfAcceptShareDialog().isPresent()).toBe(false);
          });

          it("It should send standard default message to reply owner for share acceptance.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain(shareMailSubjectText);
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain(shareMailSubjectText);
            //need to be fixed. Following should click Accept share button in share created email in mail detail view.
            mailDetailPanelPage.getMailDetailAcceptShareButton().click();
            expect(commonFunctions.checkOpeningOfAcceptShareDialog().isPresent()).toBe(true);
            //need to be fix. Following should select send standard message option in accept dialog.
            commonFunctions.getAcceptShareDialogSendStandardMessageOption().click();
            commonFunctions.getAcceptShareDialogDeclineButton().click();
            expect(commonFunctions.checkOpeningOfAcceptShareDialog().isPresent()).toBe(false);
          });

          it("It should not send mail to reply owner for share acceptance.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain(shareMailSubjectText);
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain(shareMailSubjectText);
            //need to be fixed. Following should click Accept share button in share created email in mail detail view.
            mailDetailPanelPage.getMailDetailAcceptShareButton().click();
            expect(commonFunctions.checkOpeningOfAcceptShareDialog().isPresent()).toBe(true);
            //need to be fix. Following should select do not send mail option in accept dialog.
            commonFunctions.getAcceptShareDialogDoNotSendMailOption().click();
            commonFunctions.getAcceptShareDialogDeclineButton().click();
            expect(commonFunctions.checkOpeningOfAcceptShareDialog().isPresent()).toBe(false);
          });

          it("It should send share accepted reply mail and move invitation mail to trash with successful message “No of message(s) moved to Trash”",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain(shareMailSubjectText);
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain(shareMailSubjectText);
            //need to be fixed. Following should click Accept share button in share created email in mail detail view.
            mailDetailPanelPage.getMailDetailAcceptShareButton().click();
            expect(commonFunctions.checkOpeningOfAcceptShareDialog().isPresent()).toBe(true);
            commonFunctions.getAcceptShareDialogUserDefineNoteMessageTextField().sendKeys('Accepted');
            //need to be fix. folllowing should click Accept button in accept share dialog.
            commonFunctions.getAcceptShareDialogAcceptButton().click();
            expect(commonFunctions.checkOpeningOfAcceptShareDialog().isPresent()).toBe(false);
            expect(commonFunctions.getNotificationToastMessageText()).toEqual("No of message(s) moved to Trash");
          });

          it("It should close the share accept dialog and return control to mail page application view.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain(shareMailSubjectText);
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain(shareMailSubjectText);
            //need to be fixed. Following should click Accept share button in share created email in mail detail view.
            mailDetailPanelPage.getMailDetailAcceptShareButton().click();
            expect(commonFunctions.checkOpeningOfAcceptShareDialog().isPresent()).toBe(true);
            commonFunctions.getAcceptShareDialogUserDefineNoteMessageTextField().sendKeys('Accepted');
            commonFunctions.getAcceptShareDialogSendStandardMessageOption().click();
            commonFunctions.getAcceptShareDialogDoNotSendMailOption().click();
            //need to be fix. folllowing should click decline button in accept share dialog.
            commonFunctions.getAcceptShareDialogDeclineButton().click();
            expect(commonFunctions.checkOpeningOfAcceptShareDialog().isPresent()).toBe(false);
          });
      });
  });

  it("User define folder drop down menu options should display different options.",function(){
      describe("Protractor suite to test User define folder drop down menu options.",function(){

          it("It should open Share folder dialog for sharing folder.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
            commonFunctions.checkUserDefineFolderExistance();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            commonFunctions.checkShareFolderDialogOpen(newFolderName);
          });

          it("It should open Edit folder properties dialog for editing of folder properties.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
            commonFunctions.checkUserDefineFolderExistance();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            commonFunctions.checkEditFolderDialogOpen(newFolderName);
          });

          it("It should open Move folder dialog for moving folder/folder data.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
            commonFunctions.checkUserDefineFolderExistance();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            commonFunctions.checkMoveFolderDialogOpen(newFolderName);
          });

          it("It should delete and move folder to Trash with successfull message.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
            commonFunctions.checkUserDefineFolderExistance();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            commonFunctions.getDeleteOption(newFolderName);
          });

          it("It should open create new folder dialog for creating new folder.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
            commonFunctions.checkUserDefineFolderExistance();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            commonFunctions.checkCreateNewFolderDialogOpen(newFolderName);
          });
      });
  });

  it("Delete folder option should delete folder with its child folders(If any) and move to Trash with displaying successful message.",function(){
      describe("Protractor suite to test Delete folder option.",function(){

          it("It should delete folder with its child(If any) to Trash with displaying successfull message.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
            commonFunctions.checkUserDefineFolderExistance();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            mailLeftPanelPage.getInsideUserDefineDeleteOption(parentFolder,newFolderName);
          });

          it("It should open confirmation dialog with displaying message before permanently deleting the folder from the Trash.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(trashFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(trashFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(trashFolder).click();
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(trashFolder).isPresent()).toBe(true);
            commonFunctions.checkUserDefineFolderExistance();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            mailLeftPanelPage.getInsideUserDefineDeleteOption(trashFolder,newFolderName);
          });
      });
  });

  it("System Folder Drop down menu options should display different options.",function(){
      describe("Protractor suite to test System Folder Drop down menu options.",function(){

          it("It should open create new folder dialog for creating new folder.",function(){
            commonFunctions.navigationToMailPage();
            existFolder = mailLeftPanelPage.checkFolderExistInside(parentFolder,newFolderName);
            if(existFolder==true){
              mailLeftPanelPage.getInsideUserDefineDeleteOption(parentFolder,newFolderName);
            };
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(parentFolder);
            commonFunctions.checkCreateNewFolderDialogOpen(newFolderName);
          });

          it("It should mark all the unread mails as read for the selected system folder.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            mailLeftPanelPage.makeMailsUnread().click();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(parentFolder);
            mailLeftPanelPage.getMarkAllAsReadOption().click();
            expect(mailLeftPanelPage.getUnreadMailCount()).toEqual(0);
          });

          it("It should open share folder dialog.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(parentFolder);
            commonFunctions.checkShareFolderDialogOpen(parentFolder);
          });

          it("It should open Edit folder properties dialog for editing of folder properties.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(parentFolder);
            commonFunctions.checkEditFolderDialogOpen(parentFolder);
          });

          it("It should expand all the parent folders that containing child folders.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(parentFolder);
            mailLeftPanelPage.getSystemFolderDropDownExpandAllOption().click();
          });

          it("It should only available for trash folder and open confirmation dialog with OK & cancel buttons.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(parentFolder);
            expect(mailLeftPanelPage.getEmptyTrashOption()).toBe(false);
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            mailListPanelPage.getFirstMail().click();
            mailListPanelPage.getDeleteButton().click();
            expect(mailListPanelPage.getDeleteNotificationMessage()).toEqual('conversation moved to Trash');
            mailLeftPanelPage.checkLeftSideUserDefineFolders(trashFolder).click();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(trashFolder);
            expect(mailLeftPanelPage.getEmptyTrashOption()).toBe(true);
            mailLeftPanelPage.getEmptyTrashOption().click();
            expect(mailLeftPanelPage.getEmptyTrashConfirmationDialog().isPresent()).toBe(true);
            mailLeftPanelPage.getEmptyTrashConfirmationDialogOkButton().click();
            expect(commonFunctions.getNotificationToastMessageText()).toEqual(emptyTrashNotification);
          });

          it("It should only available for trash folder and open recover deleted items dialog.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(parentFolder);
            expect(mailLeftPanelPage.getEmptyTrashOption()).toBe(false);
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            mailListPanelPage.getFirstMail().click();
            mailListPanelPage.getDeleteButton().click();
            expect(mailListPanelPage.getDeleteNotificationMessage()).toEqual('conversation moved to Trash');
            mailLeftPanelPage.checkLeftSideUserDefineFolders(trashFolder).click();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(trashFolder);
            expect(mailLeftPanelPage.getRecoverDeletedItemsOption()).toBe(true);
            mailLeftPanelPage.getRecoverDeletedItemsOption().click();
            expect(mailLeftPanelPage.getRecoverDeletedItemsDialog().isPresent()).toBe(true);
          });
      });
  });

  it("It should use for editing of folder properties.",function(){
      describe("Protractor suite to test Edit folder properties dialog for user define folders.",function(){

          it("For empty/blank folder name in edit folder dialog, Add share and OK buttons should be disabled.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
            commonFunctions.checkUserDefineFolderExistance();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            commonFunctions.checkEditFolderDialogOpen(newFolderName);
            commonFunctions.getEditFolderNameField().clear();
            expect(commonFunctions.getEditFolderAddShareButton().isEnabled()).toBe(false);
            //need to be fix. For Empty mandatory field add share button should be disabled.
            expect(commonFunctions.getEditFolderOkButton().isEnabled()).toBe(false);
            expect(commonFunctions.getEditFolderCancelButton().isEnabled()).toBe(true);
            commonFunctions.getEditFolderCancelButton().click();
          });

          it("It should enable Add share and OK buttons and allow user to save/edit these properties.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
            commonFunctions.checkUserDefineFolderExistance();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            commonFunctions.checkEditFolderDialogOpen(newFolderName);
            expect(commonFunctions.getEditFolderAddShareButton().isEnabled()).toBe(true);
            expect(commonFunctions.getEditFolderOkButton().isEnabled()).toBe(true);
            expect(commonFunctions.getEditFolderCancelButton().isEnabled()).toBe(true);
            commonFunctions.getEditFolderCancelButton().click();
          });

          it("It should disable colour drop down for child folders and allow parent folder to change folder colour.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
            commonFunctions.checkUserDefineFolderExistance();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            commonFunctions.createNewFolder(childFolder,newFolderName);
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.getUserDefineChildFolderTree(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getUserDefineChildFolderTree(parentFolder).click();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            commonFunctions.checkEditFolderDialogOpen(newFolderName);
            expect(commonFunctions.getEditFolderColorDropDown().isEnabled()).toBe(true);
            commonFunctions.getEditFolderCancelButton().click();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,childFolder);
            commonFunctions.checkEditFolderDialogOpen(childFolder);
            //need to be fixed. Because color drop down is disabled for child folder as child folder inherits parent folder color.
            expect(commonFunctions.getEditFolderColorDropDown().isEnabled()).toBe(false);
            commonFunctions.getEditFolderCancelButton().click();
          });

          it("It should open Add share dialog for sharing folder to Users or Groups or Guests.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
            commonFunctions.checkUserDefineFolderExistance();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            commonFunctions.checkEditFolderDialogOpen(newFolderName);
            commonFunctions.getEditFolderAddShareButton().click();
            expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
            commonFunctions.getShareWithCancelButton().click();
            commonFunctions.getEditFolderCancelButton().click();
          });

          it("It should close edit folder dialog with saving changes of folder properties.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
            commonFunctions.checkUserDefineFolderExistance();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            commonFunctions.checkEditFolderDialogOpen(newFolderName);
            expect(commonFunctions.getEditFolderOkButton().isEnabled()).toBe(true);
            commonFunctions.getEditFolderOkButton().click();
          });

          it("It should close edit folder dialog without saving changes of folder properties.",function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
            mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
            expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
            commonFunctions.checkUserDefineFolderExistance();
            mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
            commonFunctions.checkEditFolderDialogOpen(newFolderName);
            expect(commonFunctions.getEditFolderCancelButton().isEnabled()).toBe(true);
            commonFunctions.getEditFolderCancelButton().click();
          });
      });
  });

  it('It should send Share Created E-Mail Invitation for Contacts.',function(){
      describe("Protractor suite to test share created E-Mail Invitation for Contacts",function(){

          //Following is test case TA1a and is the common testcase to run before other Test cases[i.e. TA1b, TA2 etc.]
          it('It should send share invitation mail to entered email address with toast message "Share Created".', function(){
            commonFunctions.navigationToMailPage();
            expect(contactLeftPanelPage.getUserFolderDropDownOutsideSystemFolder().isPresent()).toBe(true);
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder();
            commonFunctions.checkShareFolderDialogOpen(parentFolder);
            expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
            commonFunctions.getShareWithUserOrGroupOption().click();
            commonFunctions.getShareWithNextButton().click();
            commonFunctions.getEnterContactsField().sendKeys('jaydeep@');
            mailLeftPanelPage.getSuggestion().click();
            commonFunctions.getSelectRoleViewerOption().click();
            commonFunctions.getSelectRoleNextButton().click();
            commonFunctions.getAddNoteToMessageTextField().sendKeys(AddNoteToMessageText);
            commonFunctions.getShareButton().click();
            //need to be develop because Share is not created and dialog not closes, also toast message notification is not displaying.
            expect(commonFunctions.getShareWithOptions().isPresent()).toBe(false);
            expect(commonFunctions.getShareCreatedToastMessage().isEnabled()).toBe(true);
          });

          it('It should contain share created detail with Accept and Decline buttons',function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            mailLeftPanelPage.getRefreshEmailButton().click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain(shareMailSubjectText);
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain(shareMailSubjectText);
            expect(mailDetailPanelPage.getMailDetailShareContentSharedItem(sharedItem).isPresent()).toBe(true);
            expect(mailDetailPanelPage.getMailDetailShareContentSharedItem(shareOwner).isPresent()).toBe(true);
            expect(mailDetailPanelPage.getMailDetailShareContentSharedItem(shareGrantee).isPresent()).toBe(true);
            expect(mailDetailPanelPage.getMailDetailShareContentSharedItem(shareRole).isPresent()).toBe(true);
            expect(mailDetailPanelPage.getMailDetailShareContentSharedItem(shareAllowedActions).isPresent()).toBe(true);
            // need to be fixed. Following shold check display of accept share button in mail detail view.
            expect(mailDetailPanelPage.getMailDetailAcceptShareButton().isPresent()).toBe(true);
            // need to be fixed. Following shold check display of decline share button in mail detail view.
            expect(mailDetailPanelPage.getMailDetailDeclineShareButton().isPresent()).toBe(true);
          });

          it('It should open accept share dialog for accepting of the shared created invitation.',function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            mailLeftPanelPage.getRefreshEmailButton().click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain(shareMailSubjectText);
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain(shareMailSubjectText);
            expect(mailDetailPanelPage.getMailDetailAcceptShareButton().isPresent()).toBe(true);
            //need to be fixed. Following should click on accept share button in mail detain view and open accept share dialog.
            mailDetailPanelPage.getMailDetailAcceptShareButton().click();
            expect(commonFunctions.checkOpeningOfAcceptShareDialog().isPresent()).toBe(true);
            commonFunctions.getAcceptShareDialogDeclineButton().click();
            expect(commonFunctions.checkOpeningOfAcceptShareDialog().isPresent()).toBe(false);
          });

          it('It should open decline share dialog for declining of the shared created invitation.',function(){
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            mailLeftPanelPage.getRefreshEmailButton().click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain(shareMailSubjectText);
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain(shareMailSubjectText);
            expect(mailDetailPanelPage.getMailDetailAcceptShareButton().isPresent()).toBe(true);
            //need to be fixed. Following should click on accept share button in mail detain view and open accept share dialog.
            mailDetailPanelPage.getMailDetailDeclineShareButton().click();
            expect(commonFunctions.checkOpeningOfDeclineShareDialog().isPresent()).toBe(true);
            commonFunctions.getDeclineShareDialogNoButton().click();
            expect(commonFunctions.checkOpeningOfDeclineShareDialog().isPresent()).toBe(false);
          });
      });
  });

  it('It should Create Tags.',function(){
      describe("Protractor suite to test Tags for Mail",function(){

          it('It should not allow to create tag with empty name as create(Ok) button should disabled.',function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getTagDropDown();
            expect(commonFunctions.getOkButtonForCreateTag().isEnabled()).toBe(true);
            commonFunctions.getCancelButtonForCreateTag().click();
          });

          it('It should create new Tag.',function(){
            commonFunctions.createNewTag();
            expect(commonFunctions.getTagFromTagList(createTagText).isPresent()).toBe(true);
          });

          it('It should  not create tag with same name and display an error message.',function(){
            commonFunctions.createNewTag();
            expect(commonFunctions.getErrorMessageForTag()).toEqual('A tag with that name exists. Please use another name. (Tag names are case-insensitive.)');
          });

          it('It should open more colour option with standard colours and custom colours',function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getTagDropDown();
            commonFunctions.getCreateTagTextbox().sendKeys(createTagMorecolorText);
            commonFunctions.getColourDropdownForCreateTag().click();
            commonFunctions.getColourListForCreateTag(moreTagColor).click();
            expect(commonFunctions.getMoreColoreForTag().isPresent()).toBe(true);
          });

          it('It should open more colour option with standard colours and custom colours and pick colour from it',function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.getTagDropDown();
            commonFunctions.getCreateTagTextbox().sendKeys(createTagMorecolorText);
            commonFunctions.getColourDropdownForCreateTag().click();
            commonFunctions.getColourListForCreateTag(moreTagColor).click();
            commonFunctions.getMoreColourListForCreateTag(1).click();
            commonFunctions.getOkButtonForCreateTag().click();
            expect(commonFunctions.getTagFromTagList(createTagMorecolorText).isPresent()).toBe(true);
          });
      });
  });

  it('It should Decline created share.',function(){
      describe("Protractor suite to test Decline share dialog",function(){

          it("It should send user define note to reply owner for share Decline.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.mailShareCreate();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain(shareMailSubjectText);
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain(shareMailSubjectText);
            //need to be fixed. Following should click Decline share button in share created email in mail detail view.
            mailDetailPanelPage.getMailDetailDeclineShareButton().click();
            expect(commonFunctions.checkOpeningOfDeclineShareDialog().isPresent()).toBe(true);
            mailDetailPanelPage.getUserNoteForDeclineShareOption().click();
            expect(mailDetailPanelPage.UserNoteForDeclineShare().isPresent()).toBe(true);
            mailDetailPanelPage.UserNoteForDeclineShare().sendKeys(userDefineNoteForDeclineShare);
            mailDetailPanelPage.getYesButtonFromDeclineShareDailog.click();
            //need to be fixed for check Decline mail is send or not and mail is moved in Trash or not. we have to create method for this because this methad calls many place
          });

          it("It should send standard default message to reply owner for share Decline.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.mailShareCreate();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain(shareMailSubjectText);
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain(shareMailSubjectText);
            //need to be fixed. Following should click Decline share button in share created email in mail detail view.
            mailDetailPanelPage.getMailDetailDeclineShareButton().click();
            expect(commonFunctions.checkOpeningOfDeclineShareDialog().isPresent()).toBe(true);
            expect(mailLeftPanelPage.getStanderdMessageForDeclineShareOption().isSelected()).toBe(true);
            mailDetailPanelPage.getYesButtonFromDeclineShareDailog.click();
            //need to be fixed for check Decline mail is send or not and mail is moved in Trash or not. we have to create method for this because this methad calls many place
          });

          it("It should not send mail to reply owner for decline of share.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.mailShareCreate();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain(shareMailSubjectText);
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain(shareMailSubjectText);
            //need to be fixed. Following should click Decline share button in share created email in mail detail view.
            mailDetailPanelPage.getMailDetailDeclineShareButton().click();
            expect(commonFunctions.checkOpeningOfDeclineShareDialog().isPresent()).toBe(true);
            getNoNotificationForDeclineShareOption().click();
            mailDetailPanelPage.getYesButtonFromDeclineShareDailog.click();
            //need to be fixed for check Decline mail is send or not and mail is moved in Trash or not. we have to create method for this because this methad calls many place
          });

          it("It should display notification message about share Decline.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.mailShareCreate();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain(shareMailSubjectText);
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain(shareMailSubjectText);
            //need to be fixed. Following should click Decline share button in share created email in mail detail view.
            mailDetailPanelPage.getMailDetailDeclineShareButton().click();
            expect(commonFunctions.checkOpeningOfDeclineShareDialog().isPresent()).toBe(true);
            mailDetailPanelPage.getYesButtonFromDeclineShareDailog.click();
            expect(mailDetailPanelPage.getNotificitionMessageOnDeclineShare()).toEqual('No of message(s) moved to Trash');
            //need to be fixed for check Decline mail is send or not and mail is moved in Trash or not. we have to create method for this because this methad calls many place
          });

          it("It should  close the share decline dialog.",function(){
            commonFunctions.navigationToMailPage();
            commonFunctions.mailShareCreate();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain(shareMailSubjectText);
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain(shareMailSubjectText);
            //need to be fixed. Following should click Decline share button in share created email in mail detail view.
            mailDetailPanelPage.getMailDetailDeclineShareButton().click();
            expect(commonFunctions.checkOpeningOfDeclineShareDialog().isPresent()).toBe(true);
            mailDetailPanelPage.getNoButtonFromDeclineShareDailog.click();
            expect(commonFunctions.checkOpeningOfDeclineShareDialog().isPresent()).toBe(false);
            expect(mailListPanelPage.getFirstMail().isSelected()).toBe(true);
          });

      });

   });

   it('Move folder dialog',function(){
     describe("Protractor suite to test Move folder dialog",function(){

       it("It should  close the Move folder dialog.",function(){
         commonFunctions.navigationToMailPage();
         mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
         expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
         mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
         expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
         commonFunctions.checkUserDefineFolderExistance();
         mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
         commonFunctions.checkMoveFolderDialogOpen(newFolderName);
         expect(commonFunctions.getMoveFolderNewButton().isPresent()).toBe(true);
         expect(commonFunctions.getMoveFolderOKButton().isPresent()).toBe(true);
         expect(commonFunctions.getMoveFolderCancelButton().isPresent()).toBe(true);
         commonFunctions.getMoveFolderCancelButton().click();
      });

      it("It should  Move the folder.",function(){
        commonFunctions.navigationToMailPage();
        mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
        expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
        mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
        expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
        commonFunctions.checkUserDefineFolderExistance();
        mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
        commonFunctions.checkMoveFolderDialogOpen(newFolderName);
        commonFunctions.getMoveFolderDialog(parentFolder,newFolderName);
      });

      it("It should  Open New Folder dialog from  Move folder dialog.",function(){
        commonFunctions.navigationToMailPage();
        mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
        expect(mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).isPresent()).toBe(true);
        mailLeftPanelPage.getFolderExpandCollpseImageOutsideSystemFolder(parentFolder).click();
        expect(mailLeftPanelPage.checkChildUserDefineFoldersInsideSystemFolder(parentFolder).isPresent()).toBe(true);
        commonFunctions.checkUserDefineFolderExistance();
        mailLeftPanelPage.getUserFolderDropDownInsideSystemFolder(parentFolder,newFolderName);
        commonFunctions.checkMoveFolderDialogOpen(newFolderName);
        expect(commonFunctions.getMoveFolderNewButton().isPresent()).toBe(true);
        commonFunctions.getMoveFolderNewButton().click();
        expect(mailLeftPanelPage.getNewFolderDialog().isPresent()).toBe(true);
      });
     });
   });

});
