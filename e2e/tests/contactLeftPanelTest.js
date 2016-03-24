var homePage = require("../page/homePage.js");
var loginPage = require("../page/loginPage.js");
var commonFunctions = require("../commonFunctions/commonFunctions.js");
var navigationPage = require("../page/navigationPage.js");
var mailLeftPanelPage = require("../page/mailLeftPanelPage.js");
var mailListPanelPage = require("../page/mailListPanelPage.js");
var mailDetailPanelPage = require("../page/mailDetailPanelPage.js");
var contactLeftPanelPage = require("../page/contactLeftPanelPage.js");
var contactListPanelPage = require("../page/contactListPanelPage.js");
var contactDetailPanelPage = require("../page/contactDetailPanelPage.js");
var contactName='Jay Rawal', result, company='VNC', contactsFolderName='Contacts', messageNoResultFound='No results found.';
var tagName='Tag1', tagSuggestionOptionNewTag='Create new tag', tagSuggestionOptionRemoveTag='Remove Tag', filterOption='J';
var pressControlPlusW = browser.actions().keyDown(protractor.Key.CONTROL).sendKeys('w');
var parentFolder='Inbox', newFolderName='Test', sentFolder='Sent', draftsFolder='Drafts', junkFolder='Junk', trashFolder='Trash', newTestFolder='NewTest';
var invalidEmail='jaydeep123@', validEmail='jaydeep@', shareMailSubjectText = 'Share Created:';
var contactFirstName='FirstName', contactLastName='LastName', contactCreatedNotification='Contact Created', newContact, contactWindowHeader;
var contactFileAsLastFirstOption='Last, First', contactFileAsFirstLastOption='First Last', contactFileAsCompanyOption='Company', contactFileAsLastFirstCompanyOption='Last, First (Company)';
var contactFileAsFirstLastCompanyOption='First Last (Company)', contactFileAsCompanyLastFirstOption='Company (Last, First)', contactFileAsCompanyFirstLastOption='Company (First Last)';
var contactPrefix='Prefix', contactMiddleName='Middle', contactMaidenName='Maiden', contactSuffix='Suffix', contactNickName='Nickname', contactDepartment='Department';
var contactPhoneMobile='Mobile', contactPhoneWork='Work', contactPhoneWorkFax='Work Fax', contactPhoneCompany='Company', contactPhoneHome='Home', contactPhoneHomeFax='Home Fax', contactPhonePager='Pager';
var contactPhoneCallback='Callback', contactPhoneAssistant='Assistant', contactPhoneCar='Car', contactPhoneOther='Other', contactPhoneOtherFax='Other Fax';
var contactIMXmpp='XMPP', contactIMYahoo='Yahoo!', contactIMAol='AOL', contactIMMsn='MSN', contactIMOther='Other Settings';
var contactAddressUrlHome='Home', contactAddressUrlWork='Work', contactAddressUrlOther='Other Settings';
var contactOtherBirthday='Birthday', contactOtherAnniversary='Anniversary', contactOtherCustom='Custom';
var userDefineNoteForDeclineShare = 'Share is Decline', trashFolder= 'Trash', searchText='Jaydeep', filterDefaultSelect = 'all', createNewAddressbookDialogHeader = 'Create new address book', editAddressbookDialogHeaderText = 'Address book properties', editFolderText = 'testEdit', addShareSuccessMessage = 'Share added successfully';
var sharedItem='Shared item', shareOwner='Owner', shareGrantee='Grantee', shareRole='Role', shareAllowedActions='Allowed actions';

describe('Protractor Suit to test contact Page', function() {
  afterEach(function() {
    browser.waitForAngular();
  });


  var navigationToContact = function(){
    navigationPage.activateNavigationMenu();
    navigationPage.getContactsNavigationMenu().click();
  };

  var contactShareCreate =function(){
    //Curently this code share contact book with same user but after devlope a code we correct it for use it globally
    expect(contactLeftPanelPage.getContactsFolder().isPresent()).toBe(true);
    contactLeftPanelPage.getContactsFolder();
    mailLeftPanelPage.getShareFolderDialog(contactsFolderName);
    expect(mailLeftPanelPage.getShareWithOptions().isPresent()).toBe(true);
    mailLeftPanelPage.getShareWithUserOrGroupOption().click();
    mailLeftPanelPage.getShareWithNextButton().click();
    mailLeftPanelPage.getEnterContactsField().sendKeys(validEmail);
    mailLeftPanelPage.getSuggestion().click();
    mailLeftPanelPage.getSelectRoleViewerOption().click();
    mailLeftPanelPage.getSelectRoleNextButton().click();
    mailLeftPanelPage.getAddNoteToMessageTextField().sendKeys('Add note to message user define note option.');
    mailLeftPanelPage.getShareButton().click();
    //need to be develop because Share is not created and dialog not closes, also toast message notification is not displaying.
    expect(mailLeftPanelPage.getShareWithOptions().isPresent()).toBe(false);
    expect(mailLeftPanelPage.getShareCreatedToastMessage().isEnabled()).toBe(true);
  };

  it('Login to Uxf', function() {
      commonFunctions.logIn();
  });

  it('Check for Contacts option selected in Navigation Menu', function(){
    commonFunctions.navigationToContactsPage();
  });

  it('Clicking on Contacts folder', function(){
    commonFunctions.navigationToContactsPage();
    contactLeftPanelPage.getContactsFolder();
    expect(browser.getCurrentUrl()).toContain(browser.params.serverUrl.url+'/contacts/list/detail');
  });

  it('It should open Contact edit window (popup or a bootstrap model) for editing of Contacts.',function(){
      describe("Protractor suite to test Contact Edit window",function(){

          //Following is test case TA1 and common testcase to run before other Test cases[i.e. TB1, TC1 etc.]
          it('Popup window header should display selected contact name',function(){
            commonFunctions.navigationToContactsPage();
            expect(contactLeftPanelPage.getContactsFolder().isPresent()).toBe(true);
            contactLeftPanelPage.getContactsFolder();
            contactName = 'Jay Rawal';
            contactListPanelPage.getContactNameFromContactListPanel(contactName).click();
            contactListPanelPage.getContactListEditButton();
            expect(contactLeftPanelPage.checkContactEditWindowOpen().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactEditWindowHeader()).toContain(contactName);
          });

          it('Popup should display different buttons at the bottom of the window',function(){
            expect(contactLeftPanelPage.getContactSaveButton().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactCloseButton().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactPrintButton().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactDeleteButton().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactTagButton().isPresent()).toBe(true);
          });

          it('Popup should ask for confirmation if any changes made in saved contacts o/w closes edit window',function(){
            contactLeftPanelPage.getContactCloseButton().click();
            expect(contactLeftPanelPage.getContactsFolder().isPresent()).toBe(true);
            contactLeftPanelPage.getContactsFolder();
            contactName = 'Jay Rawal';
            contactListPanelPage.getContactNameFromContactListPanel(contactName).click();
            contactListPanelPage.getContactListEditButton();
            expect(contactLeftPanelPage.checkContactEditWindowOpen().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactEditWindowHeader()).toContain(contactName);
            expect(contactLeftPanelPage.getContactFirstNameField().isDisplayed()).toBe(true);
            contactLeftPanelPage.getContactFirstNameField().clear();
            contactLeftPanelPage.getContactCloseButton().click();
            expect(contactLeftPanelPage.checkContactConfirmationDialogOpen().isPresent()).toBe(true);
            contactLeftPanelPage.getContactConfirmationDialogNoButton().click();
            expect(contactLeftPanelPage.checkContactConfirmationDialogOpen().isPresent()).toBe(false);
            expect(contactLeftPanelPage.checkContactEditWindowOpen().isPresent()).toBe(false);
          });

          it('It should update the contact with proper message display',function(){
            expect(contactLeftPanelPage.getContactCompanyField().isDisplayed()).toBe(true);
	          result = contactLeftPanelPage.getContactCompanyFieldValue();
	           result.isPresent().then(function(value){
	            if(value == true){
                contactLeftPanelPage.getContactCompanyField().clear();
              };
            });
	          contactLeftPanelPage.getContactCompanyField().sendKeys(company);
            expect(contactLeftPanelPage.getContactSaveButton().isEnabled()).toBe(true);
            contactLeftPanelPage.getContactSaveButton().click();
            expect(contactLeftPanelPage.checkContactEditWindowOpen().isPresent()).toBe(false);
          });

          it('It should print the contact',function(){
            expect(contactLeftPanelPage.getContactPrintButton().isEnabled()).toBe(true);
            contactLeftPanelPage.getContactPrintButton().click();
            expect(browser.getCurrentUrl()).toContain(browser.params.serverUrl.url+'/h/printcontacts?id');
            pressControlPlusW.perform();
            expect(browser.getCurrentUrl()).toContain(browser.params.serverUrl.url+'/contacts/list/detail');
          });

          it('It should delete the contact with proper message display',function(){
            expect(contactLeftPanelPage.getContactDeleteButton().isEnabled()).toBe(true);
            contactLeftPanelPage.getContactDeleteButton().click();
            expect(browser.getCurrentUrl()).toContain(browser.params.serverUrl.url+'/contacts/list/detail');
          });

          it('It should tag contact with proper message display',function(){
            expect(contactLeftPanelPage.getContactTagButton().isEnabled()).toBe(true);
            contactLeftPanelPage.getContactTagButton().click();
            expect(contactLeftPanelPage.getContactTagSuggestionOption(tagSuggestionOptionNewTag).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactTagSuggestionOption(tagSuggestionOptionRemoveTag).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactTagSuggestionOption(tagName).isPresent()).toBe(true);
            contactLeftPanelPage.getContactTagSuggestionOption(tagName).click();
            expect(contactLeftPanelPage.getContactTaggedToastMessage()).toEqual('Contact tagged');
            expect(contactLeftPanelPage.checkContactEditWindowOpen().isPresent()).toBe(true);
            contactLeftPanelPage.getContactRemoveTagCancelButton(tagName).click();
            expect(contactListPanelPage.getContactUntaggedToastMessage()).toEqual('Untagged Contact');
            expect(contactLeftPanelPage.checkContactEditWindowOpen().isPresent()).toBe(true);
          });
      });
  });

  it('It should send Share Created E-Mail Invitation for Contacts.',function(){
      describe("Protractor suite to test share created E-Mail Invitation for Contacts",function(){

          //Following is test case TA1a and is the common testcase to run before other Test cases[i.e. TA1b, TA2 etc.]
          it('It should send share invitation mail to entered email address with toast message "Share Created".', function(){
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
          });

          it('It should contain share created detail with Accept and Decline buttons',function(){
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

  it("Share Created E-Mail Accept share dialog should display information about created share.",function(){
      describe("Protractor suite to test Share Created E-Mail Accept share dialog.",function(){

          it('It should send share invitation mail to entered email address with toast message "Share Created".', function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(contactsFolderName);
            commonFunctions.checkShareFolderDialogOpen(newFolderName);
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
          });

          it("It should send user define note to reply owner for share acceptance.",function(){
            commonFunctions.navigationToMailPage();
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
            commonFunctions.navigationToContactsPage();
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

  it("Share address book dialog User or Groups(Internal Contacts) option in share with",function(){
      describe("Protractor suite to test Share address book dialog User or Groups(Internal Contacts).",function(){

          it('It should check next button disabled for Blank/Invalid data and no select role for option User or Group(Internal contact).', function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder;
            commonFunctions.checkShareFolderDialogOpen(contactsFolderName);
            expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
            commonFunctions.getShareWithUserOrGroupOption().click();
            commonFunctions.getShareWithNextButton().click();
            expect(commonFunctions.getEnterContactsField().value).toEqual(null);
            commonFunctions.getEnterContactsField().sendKeys(invalidEmail);
            //need to be fixed. Next button should be disabled If mandatory field is empty/Invalid and no role is selected.
            expect(commonFunctions.getSelectRoleNextButton().isEnabled()).toBe(false);
            //need to be fixed. By default "Viewer" option should be selected.
            expect(commonFunctions.getSelectRoleViewerOption().isSelected()).toBe(true);
            //need to be fixed. Next button should be disabled If mandatory field is empty/Invalid and no role is selected.
            expect(commonFunctions.getSelectRoleNextButton().isEnabled()).toBe(false);
          });

          it('It should check next button enabled for valid data with select role option for option User or Group(Internal contact).', function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder;
            commonFunctions.checkShareFolderDialogOpen(contactsFolderName);
            expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
            commonFunctions.getShareWithUserOrGroupOption().click();
            commonFunctions.getShareWithNextButton().click();
            commonFunctions.getEnterContactsField().sendKeys(validEmail);
            mailLeftPanelPage.getSuggestion().click();
            commonFunctions.getSelectRoleViewerOption().click();
            expect(commonFunctions.getSelectRoleNextButton().isEnabled()).toBe(true);
          });

          it('It should check share folder select role options.', function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder;
            commonFunctions.checkShareFolderDialogOpen(contactsFolderName);
            expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
            commonFunctions.getShareWithUserOrGroupOption().click();
            commonFunctions.getShareWithNextButton().click();
            expect(commonFunctions.getSelectRoleViewerOption().isSelected()).toBe(false);
            expect(commonFunctions.getSelectRoleManagerOption().isSelected()).toBe(false);
            expect(commonFunctions.getSelectRoleAdminOption().isSelected()).toBe(false);
            expect(commonFunctions.getSelectRoleNoneOption().isSelected()).toBe(false);
          });

          it('It should check share folder add note to message options with share button disabled.', function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder;
            commonFunctions.checkShareFolderDialogOpen(contactsFolderName);
            expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
            commonFunctions.getShareWithUserOrGroupOption().click();
            commonFunctions.getShareWithNextButton().click();
            commonFunctions.getEnterContactsField().sendKeys(validEmail);
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
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder;
            commonFunctions.checkShareFolderDialogOpen(contactsFolderName);
            expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
            commonFunctions.getShareWithUserOrGroupOption().click();
            commonFunctions.getShareWithNextButton().click();
            commonFunctions.getEnterContactsField().sendKeys();
            mailLeftPanelPage.getSuggestion().click();
            commonFunctions.getSelectRoleViewerOption().click();
            commonFunctions.getSelectRoleNextButton().click();
            commonFunctions.getAddNoteToMessageTextField().sendKeys('Add note to message user define note option.');
            commonFunctions.getShareButton().click();
            //need to be develop because Share is not created and dialog not closes, also toast message notification is not displaying.
            expect(commonFunctions.getShareWithOptions().isPresent()).toBe(false);
            expect(commonFunctions.getShareCreatedToastMessage().isEnabled()).toBe(true);
          });
      });
  });

  it('Contact list should display list of contacts/message as per selected filter.',function(){
      describe("Protractor suite to test Contact list on selected filter",function(){

          it('It should create/import 500-contacts in contacts folder',function(){
            //Need to be fix. Following code should compose 500 contacts.
            //code...
          });

          it('It should always display contacts from a tag or address book based on filter selected.', function(){
            commonFunctions.navigationToContactsPage();
            expect(contactLeftPanelPage.getContactLeftPanelFolderList().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactsFolder().isPresent()).toBe(true);
            contactLeftPanelPage.getContactsFolder();
            contactListPanelPage.getContactListFirstContact().click();
            expect(commonFunctions.getTagList().isPresent()).toBe(true);
            //need to be fixed. Because on clicking tag name from tag list It should display contacts in list panel accordingly.
            commonFunctions.getTagFromTagList(tagName);
          });

          it('Contacts should be display in by default ordered by alphabets based on (File As field) in contact list panel.',function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder();
            result = contactListPanelPage.getContactNameFromContactListPanel(contactName);
	          result.isPresent().then(function(value){
	            if(value == true){
	               contactListPanelPage.getContactNameFromContactListPanel(contactName).click();
                 contactListPanelPage.getContactListHeaderDeleteButton().click();
               };
            });
            //need to be fixed. Following should open contact compose window through floating compose button from contact page.
            commonFunctions.getFloatingCompose();
            expect(mailLeftPanelPage.getComposeContactWindow().isPresent()).toBe(true);
            mailLeftPanelPage.getCloseComposeContactWindow().click();
            contactLeftPanelPage.getContactFirstNameField().sendKeys(contactFirstName);
            contactLeftPanelPage.getContactLastNameField().sendKeys(contactLastName);
            contactLeftPanelPage.getContactWindowFileAsDropDown().click();
            contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsLastFirstOption).click();
            expect(contactLeftPanelPage.getContactSaveButton().isEnabled()).toBe(true);
            contactLeftPanelPage.getContactSaveButton().click();
            newContact = contactFirstName + contactLastName;
            contactListPanelPage.getContactNameFromContactListPanel(newContact).click();
            contactListPanelPage.getContactListEditButton().click();
            expect(contactLeftPanelPage.checkContactEditWindowOpen().isPresent()).toBe(true);
            contactWindowHeader = contactLeftPanelPage.getContactEditWindowHeader();
            contactLeftPanelPage.getContactCloseButton().click();
            //need to be fixed. Following should check contact name as per value selected from contact window file as option.
            expect(contactListPanelPage.getContactListContactName(newContact)).toEqual(contactWindowHeader);
          });

          it('It should disable filter button option if no results found message is displayed in the contact list panel.',function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder();
            expect(contactListPanelPage.getContactListNoResultFoundMessage().isPresent()).toBe(true);
            //need to be fixed. Because If no contacts are found then filter options should be disabled
            expect(contactListPanelPage.getContactListFilterButton().isEnabled()).toBe(false);
            contactLeftPanelPage.getEmailedContactsFolder();
            result = expect(contactListPanelPage.getContactListNoResultFoundMessage().isPresent()).toBe(true);
            //need to be fixed. Because If no contacts are found then filter options should be disabled
            expect(contactListPanelPage.getContactListFilterButton().isEnabled()).toBe(false);
          });

          it('Initially it should fetch and display 100 contacts and then as user scrolls down in the list panel for more contacts.',function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder();
            //Following should click on 99th contact in the contact list panel and after clicking it loads next 100 contacts in list panel.
            contactListPanelPage.getContactListLastContact(99);
          });

          it('It should display filter options e.g All, 123, A, B..Z in contact list for searching contacts.',function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder();
            expect(contactListPanelPage.getContactListFilterButton().isEnabled()).toBe(true);
            contactListPanelPage.getContactListFilterButton().click();
            expect(contactListPanelPage.getContactListFilterSuggestion().isPresent()).toBe(true);
            contactListPanelPage.getOptionFromFilterSuggestion(filterOption);
            contactListPanelPage.getContactListAllContactsOption().click();
          });

          it('It should allow to select multiple contacts via ctrl or shift keys.',function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder();
            contactListPanelPage.getContactListFirstContact().click();
            browser.actions().mouseMove(contactListPanelPage.getContactNameFromContactListPanel(contactName)).keyDown(protractor.Key.CONTROL).click().perform();
            expect(contactListPanelPage.getContactListFirstContact().isSelected()).toBe(true);
            expect(contactListPanelPage.getContactNameFromContactListPanel(contactName).isSelected()).toBe(true);
            contactLeftPanelPage.getContactsFolder();
            contactListPanelPage.getContactListFirstContact().click();
            browser.actions().mouseMove(contactListPanelPage.getContactNameFromContactListPanel(contactName)).keyDown(protractor.Key.SHIFT).click().perform();
            expect(contactListPanelPage.getContactListFirstContact().isSelected()).toBe(true);
            expect(contactListPanelPage.getContactNameFromContactListPanel(contactName).isSelected()).toBe(true);
          });

          it('It should display a tag if contact(s) is(are) tagged.',function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder();
            contactListPanelPage.getContactNameFromContactListPanel(contactName).click();
            result = contactDetailPanelPage.getContactDetailPanelTag();
	          result.isPresent().then(function(value){
              if(value == true){
	                contactListPanelPage.getContactNameFromContactListPanel(contactName).click();
        	        contactListPanelPage.getContactListHeaderTagButton().click();
	                contactListPanelPage.getContactListHeaderTagButtonOption(tagSuggestionOptionRemoveTag).click();
              };
            });
            contactListPanelPage.getContactNameFromContactListPanel(contactName).click();
            contactListPanelPage.getContactListHeaderTagButton().click();
            contactListPanelPage.getContactListHeaderTagButtonOption(tagName).click();
            contactListPanelPage.getContactNameFromContactListPanel(contactName).click();
            expect(contactDetailPanelPage.getContactDetailPanelTag().isPresent()).toBe(true);
          });
      });
  });

  it('It should display contact application view.',function(){
      describe("Protractor suite to test Contact application view",function(){

          it('It should create/import 500-contacts in contacts folder',function(){
            //Need to be fix. Following code should compose 500 contacts.
            //code...
          });

          it('It should open contacts application from Navigation bar & display application name as Contacts in Header', function(){
            commonFunctions.navigationToContactsPage();
            expect(contactLeftPanelPage.getContactLeftPanelFolderList().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactsFolder().isPresent()).toBe(true);
            expect(commonFunctions.getTagList().isPresent()).toBe(true);
            contactLeftPanelPage.getContactsFolder();
            expect(browser.getCurrentUrl()).toContain(browser.params.serverUrl.url+'/contacts/list');
          });

          it('It should display no of contacts of “Contacts” folder/"No result found" message if nothing found in Contact list panel.',function(){
            commonFunctions.navigationToContactsPage();
            expect(contactLeftPanelPage.getContactLeftPanelFolderList().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactsFolder().isPresent()).toBe(true);
            contactLeftPanelPage.getContactsFolder();
            expect(browser.getCurrentUrl()).toContain(browser.params.serverUrl.url+'/contacts/list');
            result = contactListPanelPage.getContactListNoResultFoundMessage();
            result.isPresent().then(function(value){
              if(value == true){
                  expect(contactListPanelPage.getContactListNoResultFoundMessage()).toEqual(messageNoResultFound);
              };
            });
            contactListPanelPage.getContactListFirstContact().click();
            expect(contactListPanelPage.getContactListFirstContactText()).toEqual(contactDetailPanelPage.getContactDetailContactName());
          });

          it('Contacts should be display in by default ordered by alphabets based on (File As field) in contact list panel.',function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder();
            result = contactListPanelPage.getContactNameFromContactListPanel(contactName);
            result.isPresent().then(function(value){
              if(value == true){
                contactListPanelPage.getContactNameFromContactListPanel(contactName).click();
                contactListPanelPage.getContactListHeaderDeleteButton().click();
              };
            });
            //need to be fixed. Following should open contact compose window through floating compose button from contact page.
            commonFunctions.getFloatingCompose();
            expect(mailLeftPanelPage.getComposeContactWindow().isPresent()).toBe(true);
            mailLeftPanelPage.getCloseComposeContactWindow().click();
            contactLeftPanelPage.getContactFirstNameField().sendKeys(contactFirstName);
            contactLeftPanelPage.getContactLastNameField().sendKeys(contactLastName);
            contactLeftPanelPage.getContactWindowFileAsDropDown().click();
            contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsLastFirstOption).click();
            expect(contactLeftPanelPage.getContactSaveButton().isEnabled()).toBe(true);
            contactLeftPanelPage.getContactSaveButton().click();
            newContact = contactFirstName + contactLastName;
            contactListPanelPage.getContactNameFromContactListPanel(newContact).click();
            contactListPanelPage.getContactListEditButton().click();
            expect(contactLeftPanelPage.checkContactEditWindowOpen().isPresent()).toBe(true);
            contactWindowHeader = contactLeftPanelPage.getContactEditWindowHeader();
            contactLeftPanelPage.getContactCloseButton().click();
            //need to be fixed. Following should check contact name as per value selected from contact window file as option.
            expect(contactListPanelPage.getContactListContactName(newContact)).toEqual(contactWindowHeader);
          });

          it('Initially it should fetch and display 100 contacts and then as user scrolls down in the list panel for more contacts.',function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder();
            //Following should click on 99th contact in the contact list panel and after clicking it loads next 100 contacts in list panel.
            contactListPanelPage.getContactListLastContact(99);
          });

          it('It should display filter options e.g All, 123, A, B..Z in contact list for searching contacts.',function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder();
            expect(contactListPanelPage.getContactListFilterButton().isEnabled()).toBe(true);
            contactListPanelPage.getContactListFilterButton().click();
            expect(contactListPanelPage.getContactListFilterSuggestion().isPresent()).toBe(true);
            contactListPanelPage.getOptionFromFilterSuggestion(filterOption);
            contactListPanelPage.getContactListAllContactsOption().click();
          });
      });
  });

  it('It should display contact compose view.',function(){
      describe("Protractor suite to test Contact compose window (popup or bootstrap model)",function(){

          //Common test case to run before running each following test cases.
          it('It should open contact compose window from Floating button on contact application page',function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder().click();
            //need to be fixed. Following should open contact compose window.
            commonFunctions.getFloatingCompose();
            expect(contactLeftPanelPage.getComposeContactWindow().isPresent()).toBe(true);
            composeContact(NavigationMenu, contactNavigation, contactFolder, floatingCompose, composeContactWindow);
          });

          it('It should close popup If no changes has made/If any changes are made then It should open confirmation dialog before closing the window.', function(){
            expect(contactLeftPanelPage.getContactCancelButton().isEnabled()).toBe(true);
            contactLeftPanelPage.getContactCancelButton().click();
            commonFunctions.navigationToContactsPage();
            //need to be fixed. Following should open contact compose window.
            commonFunctions.getFloatingCompose();
            expect(contactLeftPanelPage.getComposeContactWindow().isPresent()).toBe(true);
            contactLeftPanelPage.getContactFirstNameField().sendKeys(contactFirstName);
            contactLeftPanelPage.getContactCancelButton().click();
            expect(contactLeftPanelPage.checkContactConfirmationDialogOpen().isPresent()).toBe(true);
            contactLeftPanelPage.getContactConfirmationDialogCancelButton().click();
          });

          it('It should save contact details with displaying proper message.',function(){
            contactLeftPanelPage.getContactsFolder().click();
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
            expect(contactLeftPanelPage.getContactSaveButton().isPresent()).toBe(true);
            contactLeftPanelPage.getContactSaveButton().click();
            expect(contactLeftPanelPage.getComposeContactWindow().isPresent()).toBe(false);
            expect(commonFunctions.getNotificationToastMessage().isPresent()).toBe(true);
            expect(commonFunctions.getNotificationToastMessageText()).toEqual(contactCreatedNotification);
          });

          it('It should display default contact avatar with green plus sign in bottom which allowed to change avatar by uploading new image.',function(){
            expect(contactLeftPanelPage.getComposeContactDefaultAvtar().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getComposeContactAvtarPlusButton().isEnabled()).toBe(true);
            contactLeftPanelPage.getComposeContactAvtarPlusButton().click();
            expect(contactLeftPanelPage.checkUploagImageDialogOpening().isPresent()).toBe(true);
            contactLeftPanelPage.getUploadImageDialogBrowseButton().click();
            //Need to be fixed. Following code should upload user avtar.
          });

          it('File As parameter drop down should have different options.',function(){
            expect(contactLeftPanelPage.getContactWindowFileAsDropDown().isPresent()).toBe(true);
            contactLeftPanelPage.getContactWindowFileAsDropDown().click();
            expect(contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsLastFirstOption).isPresent()).toBe();
            expect(contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsFirstLastOption).isPresent()).toBe();
            expect(contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsCompanyOption).isPresent()).toBe();
            expect(contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsLastFirstCompanyOption).isPresent()).toBe();
            expect(contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsFirstLastCompanyOption).isPresent()).toBe();
            expect(contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsCompanyLastFirstOption).isPresent()).toBe();
            expect(contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsCompanyFirstLastOption).isPresent()).toBe();
            contactLeftPanelPage.getContactConfirmationDialogCancelButton().click();
          });

          it('It should display First/Last Name, Company values in format as per option selected from File As drop down.',function(){
            contactLeftPanelPage.getContactsFolder().click();
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
            contactLeftPanelPage.getContactCompanyField().sendKeys(company);
            contactLeftPanelPage.getContactWindowFileAsDropDown().click();
            //need to check for contact window header.
            contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsLastFirstOption).click();
            expect(contactLeftPanelPage.getContactEditWindowHeader()).toEqual(contactLastName+', '+contactFirstName);
            contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsFirstLastOption).click();
            expect(contactLeftPanelPage.getContactEditWindowHeader()).toEqual(contactFirstName+' '+contactLastName);
            contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsCompanyOption).click();
            expect(contactLeftPanelPage.getContactEditWindowHeader()).toEqual(company);
            contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsLastFirstCompanyOption).click();
            expect(contactLeftPanelPage.getContactEditWindowHeader()).toEqual(contactLastName +', '+ contactFirstName +' (' + company +')');
            contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsFirstLastCompanyOption).click();
            expect(contactLeftPanelPage.getContactEditWindowHeader()).toEqual(contactFirstName +' '+ contactLastName +' (' + company +')');
            contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsCompanyLastFirstOption).click();
            expect(contactLeftPanelPage.getContactEditWindowHeader()).toEqual(company +' (' + contactLastName + ',' + contactFirstName + ')');
            contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsCompanyFirstLastOption).click();
            expect(contactLeftPanelPage.getContactEditWindowHeader()).toEqual(company +' (' + contactFirstName + contactLastName + ')');
            contactLeftPanelPage.getContactConfirmationDialogCancelButton().click();
            contactLeftPanelPage.getContactConfirmationDialogNoButton().click();
          });

          it('It should have options like “Prefix First Middle (Maiden) Last, Suffix “Nickname” Job Title – Department” etc.',function(){
            contactLeftPanelPage.getContactDetailMenuButton().click();
            expect(contactLeftPanelPage.getContactDetailMenuButtonOptions(contactPrefix).isPresent()).toBe(true);
            contactLeftPanelPage.getContactDetailMenuButtonOptions(contactPrefix).click();
            expect(contactLeftPanelPage.getContactPrefixField().isEnabled()).toBe(true);
            contactLeftPanelPage.getContactDetailMenuButton().click();
            expect(contactLeftPanelPage.getContactDetailMenuButtonOptions(contactMiddleName).isPresent()).toBe(true);
            contactLeftPanelPage.getContactDetailMenuButtonOptions(contactMiddleName).click();
            expect(contactLeftPanelPage.getContactMiddleNameField().isEnabled()).toBe(true);
            contactLeftPanelPage.getContactDetailMenuButton().click();
            expect(contactLeftPanelPage.getContactDetailMenuButtonOptions(contactMaidenName).isPresent()).toBe(true);
            contactLeftPanelPage.getContactDetailMenuButtonOptions(contactMaidenName).click();
            expect(contactLeftPanelPage.getContactMaidenNameField().isEnabled()).toBe(true);
            contactLeftPanelPage.getContactDetailMenuButton().click();
            expect(contactLeftPanelPage.getContactDetailMenuButtonOptions(contactSuffix).isPresent()).toBe(true);
            contactLeftPanelPage.getContactDetailMenuButtonOptions(contactSuffix).click();
            expect(contactLeftPanelPage.getContactSuffixField().isEnabled()).toBe(true);
            contactLeftPanelPage.getContactDetailMenuButton().click();
            expect(contactLeftPanelPage.getContactDetailMenuButtonOptions(contactNickName).isPresent()).toBe(true);
            contactLeftPanelPage.getContactDetailMenuButtonOptions(contactNickName).click();
            expect(contactLeftPanelPage.getContactNickNameField().isEnabled()).toBe(true);
            contactLeftPanelPage.getContactDetailMenuButton().click();
            expect(contactLeftPanelPage.getContactDetailMenuButtonOptions(contactDepartment).isPresent()).toBe(true);
            contactLeftPanelPage.getContactDetailMenuButtonOptions(contactDepartment).click();
            expect(contactLeftPanelPage.getContactDepartmentField().isEnabled()).toBe(true);
            contactLeftPanelPage.getContactConfirmationDialogCancelButton().click();
            contactLeftPanelPage.getContactConfirmationDialogNoButton().click();
          });

          it('It should open a popup window to select the Address Book to store contact into.',function(){
            contactLeftPanelPage.getContactsFolder().click();
            result = contactListPanelPage.getContactListContactName(contactFirstName);
            result.isPresent().then(function(value){
              if(value == true){
                contactListPanelPage.getContactNameFromContactListPanel(contactFirstName).click();
                expect(contactListPanelPage.getContactListHeaderDeleteButton().isEnabled()).toBe(true);
                contactListPanelPage.getContactListHeaderDeleteButton().click();
              };
            });
            commonFunctions.getFloatingCompose();
            contactLeftPanelPage.getContactFirstNameField().sendKeys(contactFirstName);
            contactLeftPanelPage.getContactLastNameField().sendKeys(contactLastName);
            contactLeftPanelPage.getContactCompanyField().sendKeys(company);
            contactLeftPanelPage.getContactLocationField().click();
            expect(contactLeftPanelPage.checkChooseContactsFolderDialogOpen().isPresent()).toBe(true);
            contactLeftPanelPage.getChooseContactsFolderDialogSearchField().sendKeys(contactsFolderName);
            contactLeftPanelPage.getChooseContactsFolderDialogFolderName(contactsFolderName).click();
            expect(contactLeftPanelPage.getChooseContactsFolderDialogOkButton().isEnabled()).toBe(true);
            contactLeftPanelPage.getChooseContactsFolderDialogOkButton().click();
            expect(contactLeftPanelPage.checkChooseContactsFolderDialogOpen().isPresent()).toBe(false);
            contactLeftPanelPage.getContactSaveButton().click();
            contactLeftPanelPage.getContactsFolder();
            expect(contactListPanelPage.getContactNameFromContactListPanel(contactFirstName).isPresent()).toBe(true);
          });

          it('Plus icon should display near to Email, Phone, IM, Address, URL and Other fields to add more records in respective fields.',function(){
            contactLeftPanelPage.getContactEmailFieldPlusButton().click();
            //need to be fixed. Following should check newly added email field of contact compose/edit window.
            expect(contactLeftPanelPage.checkContactNewAddedEmailField().isPresent()).toBe(true);
            contactLeftPanelPage.getContactPhoneFieldPlusButton().click();
            //need to be fixed. Following should check newly added phone field of contact compose/edit window.
            expect(contactLeftPanelPage.checkContactNewAddedPhoneField().isPresent()).toBe(true);
            contactLeftPanelPage.getContactIMFieldPlusButton().click();
            //need to be fixed. Following should check newly added IM field of contact compose/edit window.
            expect(contactLeftPanelPage.checkContactNewAddedIMField().isPresent()).toBe(true);
            contactLeftPanelPage.getContactAddressFieldPlusButton().click();
            //need to be fixed. Following should check newly added Address field of contact compose/edit window.
            expect(contactLeftPanelPage.checkContactNewAddedAddressField().isPresent()).toBe(true);
            contactLeftPanelPage.getContactURLFieldPlusButton().click();
            //need to be fixed. Following should check newly added URL field of contact compose/edit window.
            expect(contactLeftPanelPage.checkContactNewAddedURLField().isPresent()).toBe(true);
            contactLeftPanelPage.getContactOtherFieldPlusButton().click();
            //need to be fixed. Following should check newly added other field of contact compose/edit window.
            expect(contactLeftPanelPage.checkContactNewAddedOtherField().isPresent()).toBe(true);
            contactLeftPanelPage.getContactConfirmationDialogCancelButton().click();
          });

          it('Minus icon should display near to Email, Phone, IM, Address, URL and Other fields to remove that records in respective fields.',function(){
            contactLeftPanelPage.getContactEmailFieldMinusButton().click();
            //need to be fixed. Following should remove newly added email field of contact compose/edit window.
            expect(contactLeftPanelPage.checkContactNewAddedEmailField().isPresent()).toBe(false);
            contactLeftPanelPage.getContactPhoneFieldMinusButton().click();
            //need to be fixed. Following should remove newly added phone field of contact compose/edit window.
            expect(contactLeftPanelPage.checkContactNewAddedPhoneField().isPresent()).toBe(false);
            contactLeftPanelPage.getContactIMFieldMinusButton().click();
            //need to be fixed. Following should remove newly added IM field of contact compose/edit window.
            expect(contactLeftPanelPage.checkContactNewAddedIMField().isPresent()).toBe(false);
            contactLeftPanelPage.getContactAddressFieldMinusButton().click();
            //need to be fixed. Following should remove newly added Address field of contact compose/edit window.
            expect(contactLeftPanelPage.checkContactNewAddedAddressField().isPresent()).toBe(false);
            contactLeftPanelPage.getContactURLFieldMinusButton().click();
            //need to be fixed. Following should remove newly added URL field of contact compose/edit window.
            expect(contactLeftPanelPage.checkContactNewAddedURLField().isPresent()).toBe(false);
            contactLeftPanelPage.getContactOtherFieldMinusButton().click();
            //need to be fixed. Following should remove newly added other field of contact compose/edit window.
            expect(contactLeftPanelPage.checkContactNewAddedOtherField().isPresent()).toBe(false);
            contactLeftPanelPage.getContactConfirmationDialogCancelButton().click();
          });

          it('Phone field drop down should contain different options to save different phone numbers.',function(){
            contactLeftPanelPage.getContactPhoneFieldDropDown().click();
            expect(contactLeftPanelPage.getContactPhoneFieldDropDownOption(contactPhoneMobile).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactPhoneFieldDropDownOption(contactPhoneWork).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactPhoneFieldDropDownOption(contactPhoneWorkFax).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactPhoneFieldDropDownOption(contactPhoneCompany).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactPhoneFieldDropDownOption(contactPhoneHome).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactPhoneFieldDropDownOption(contactPhoneHomeFax).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactPhoneFieldDropDownOption(contactPhonePager).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactPhoneFieldDropDownOption(contactPhoneCallback).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactPhoneFieldDropDownOption(contactPhoneAssistant).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactPhoneFieldDropDownOption(contactPhoneCar).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactPhoneFieldDropDownOption(contactPhoneOther).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactPhoneFieldDropDownOption(contactPhoneOtherFax).isPresent()).toBe(true);
            contactLeftPanelPage.getContactConfirmationDialogCancelButton().click();
          });

          it('IM field drop down contains options like:- XMPP; Yahoo!; AOL; MSN and Other.',function(){
            contactLeftPanelPage.getContactIMFieldDropDown().click();
            expect(contactLeftPanelPage.getContactIMFieldDropDownOption(contactIMXmpp).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactIMFieldDropDownOption(contactIMYahoo).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactIMFieldDropDownOption(contactIMAol).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactIMFieldDropDownOption(contactIMMsn).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactIMFieldDropDownOption(contactIMOther).isPresent()).toBe(true);
            contactLeftPanelPage.getContactConfirmationDialogCancelButton().click();
          });

          it('Address should have a group of fields for Street,City,State,Postal Code & Country with three types:-Home; Work and Other.',function(){
            contactLeftPanelPage.getContactIMFieldDropDown().click();
            expect(contactLeftPanelPage.getContactAddressStreetField().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactAddressCityField().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactAddressStateField().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactAddressPostalCodeField().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactAddressCountryField().isPresent()).toBe(true);
            contactLeftPanelPage.getContactAddressFieldDropDown().click();
            expect(contactLeftPanelPage.getContactAddressFieldDropDownOption(contactAddressUrlHome).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactAddressFieldDropDownOption(contactAddressUrlWork).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactAddressFieldDropDownOption(contactAddressUrlOther).isPresent()).toBe(true);
            contactLeftPanelPage.getContactConfirmationDialogCancelButton().click();
          });

          it('URL should have three options(drop down) and values are:- Home; Work and Other.',function(){
            contactLeftPanelPage.getContactURLFieldDropDown().click();
            expect(contactLeftPanelPage.getContactURLFieldDropDownOption(contactAddressUrlHome).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactURLFieldDropDownOption(contactAddressUrlWork).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactURLFieldDropDownOption(contactAddressUrlOther).isPresent()).toBe(true);
            contactLeftPanelPage.getContactConfirmationDialogCancelButton().click();
          });

          it('Other should have three options(drop down) like:- Birthday(with date picker); Anniversary(with date picker) and Other(without datepicker).',function(){
            expect(contactLeftPanelPage.getContactOtherFieldDatePickerDropDown().isPresent()).toBe(true);
            contactLeftPanelPage.getContactOtherFieldDropDown().click();
            expect(contactLeftPanelPage.getContactOtherFieldDropDownOption(contactOtherBirthday).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactOtherFieldDropDownOption(contactOtherAnniversary).isPresent()).toBe(true);
            expect(contactLeftPanelPage.getContactOtherFieldDropDownOption(contactOtherCustom).isPresent()).toBe(true);
            contactLeftPanelPage.getContactConfirmationDialogCancelButton().click();
          });

          it('Notes should allow user to add any notes for contact.',function(){
            expect(contactLeftPanelPage.getContactNotesField().isPresent()).toBe(true);
            contactLeftPanelPage.getContactConfirmationDialogCancelButton().click();
          });
      });
  });

  it('It should open Share address book dialog.',function(){
      describe("Protractor suite to test Share address book dialog",function(){

          var shareAddressBookDailog = function(){
            commonFunctions.navigationToContactsPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            commonFunctions.checkShareFolderDialogOpen(contactsFolderName);
            expect(commonFunctions.getShareWithOptions().isPresent()).toBe(true);
          };

          it('It should pre-filled folder name in folder name field in Share folder dialog.', function(){
            shareAddressBookDailog();
            commonFunctions.getShareWithCancelButton().click();
          });

          it('It should check share folder share with options.', function(){
            shareAddressBookDailog();
            expect(commonFunctions.getShareWithUserOrGroupOption().isSelected()).toBe(false);
            expect(commonFunctions.getShareWithGuestsOption().isSelected()).toBe(false);
            expect(commonFunctions.getShareWithPublicOption().isSelected()).toBe(false);
            commonFunctions.getShareWithUserOrGroupOption().click();
            expect(commonFunctions.getShareWithUserOrGroupOption().isSelected()).toBe(true);
            expect(commonFunctions.getShareWithGuestsOption().isSelected()).toBe(true);
            expect(commonFunctions.getShareWithPublicOption().isSelected()).toBe(false);
            commonFunctions.getShareWithGuestsOption().click();
            expect(commonFunctions.getShareWithUserOrGroupOption().isSelected()).toBe(false);
            expect(commonFunctions.getShareWithGuestsOption().isSelected()).toBe(true);
            expect(commonFunctions.getShareWithPublicOption().isSelected()).toBe(false);
            commonFunctions.getShareWithPublicOption().click();
            expect(commonFunctions.getShareWithUserOrGroupOption().isSelected()).toBe(false);
            expect(commonFunctions.getShareWithGuestsOption().isSelected()).toBe(false);
            expect(commonFunctions.getShareWithPublicOption().isSelected()).toBe(true);
            commonFunctions.getShareWithCancelButton();
          });

          it('It should check next button disabled with no share with options selected in Share dialog.', function(){
            shareAddressBookDailog();
            expect(commonFunctions.getShareWithUserOrGroupOption().isSelected()).toBe(false);
            expect(commonFunctions.getShareWithGuestsOption().isSelected()).toBe(false);
            expect(commonFunctions.getShareWithPublicOption().isSelected()).toBe(false);
            //need to be fixed. Next button should be disabled If no share with option is selected.
            expect(commonFunctions.getShareWithNextButton().isEnabled()).toBe(false);
          });

          it('Public option should enabled with contact page.', function(){
            shareAddressBookDailog();
            commonFunctions.getShareWithPublicOption().click();
            expect(commonFunctions.getShareWithUserOrGroupOption().isSelected()).toBe(false);
            expect(commonFunctions.getShareWithGuestsOption().isSelected()).toBe(false);
            expect(commonFunctions.getShareWithPublicOption().isSelected()).toBe(true);
            commonFunctions.getShareWithCancelButton();
          });
      });
    });

  it('It should display Address book drop down menu options',function(){
      describe("Protractor suite to test Address book drop down menu options",function(){


          var addressbookDropdown = function(){
            commonFunctions.navigationToContactsPage();
          };

          it('New Address-book dialog box from dropdown.', function(){
            addressbookDropdown();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(contactsFolderName);
            expect(contactLeftPanelPage.getAddressbookDropdown().isPresent()).toBe(true);
            contactLeftPanelPage.getOptionFromAddressbookDropdown(1).click();
            expect(contactLeftPanelPage.getCreateNewAddressBookdialogbox().isPresent()).toBe(true);
            //Check a folder is selected or not is pending because functionality is yet not developed
          });

          it('share Address-book dialog box from dropdown.', function(){
            addressbookDropdown();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(contactsFolderName);
            expect(contactLeftPanelPage.getAddressbookDropdown().isPresent()).toBe(true);
            contactLeftPanelPage.getOptionFromAddressbookDropdown(2).click();
            expect(contactLeftPanelPage.contactLeftPanelPage.getShareAddressBookdialogbox().isPresent()).toBe(true);
          });

          it('Edit/Rename Address-book dialog box from dropdown for system Folder.', function(){
            addressbookDropdown();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(contactsFolderName);
            expect(contactLeftPanelPage.getAddressbookDropdown().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getOptionFromAddressbookDropdown(4).isEnabled()).toBe(false);
          });

          it('Rename Address-book dialog box from dropdown for User define Folder.', function(){
            addressbookDropdown();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(newFolderNamess);
            expect(contactLeftPanelPage.getAddressbookDropdown().isPresent()).toBe(true);
            contactLeftPanelPage.getOptionFromAddressbookDropdown(4).click();
            expect(contactLeftPanelPage.contactLeftPanelPage.renameEditAddressBookdialogbox().isPresent()).toBe(true);
          });

          it('Delete Address-book dialog box from dropdown for system Folder.', function(){
            addressbookDropdown();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(contactsFolderName);
            expect(contactLeftPanelPage.getAddressbookDropdown().isPresent()).toBe(true);
            expect(contactLeftPanelPage.getOptionFromAddressbookDropdown(3).isEnabled()).toBe(false);
          });

          it('Delete Address-book dialog box from dropdown for User define Folder.', function(){
            addressbookDropdown();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(newFolderNamess);
            expect(contactLeftPanelPage.getAddressbookDropdown().isPresent()).toBe(true);
            contactLeftPanelPage.getOptionFromAddressbookDropdown(3).click();
            //check deleted addressbook is moved in trash is pending because need to devlop funsnality first .
          });

          it('Edit Address-book dialog box from dropdown.', function(){
            addressbookDropdown();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(contactsFolderName);
            expect(contactLeftPanelPage.getAddressbookDropdown().isPresent()).toBe(true);
            contactLeftPanelPage.getOptionFromAddressbookDropdown(5).click();
            expect(contactLeftPanelPage.contactLeftPanelPage.getShareAddressBookdialogbox().isPresent()).toBe(true);
          });

          it('Expand Address-book dialog box from dropdown.', function(){
            addressbookDropdown();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(contactsFolderName);
            expect(contactLeftPanelPage.getAddressbookDropdown().isPresent()).toBe(true);
            if(expect(contactLeftPanelPage.getOptionFromAddressbookDropdown(6).isEnabled()).toBe(true)){
              contactLeftPanelPage.getOptionFromAddressbookDropdown(6).click();
            }
            //Check all the folders are expended or not is pending
          });
      });
    });

  it('It should Decline created share.',function(){
      describe("Protractor suite to test Decline share dialog",function(){

          it("It should send user define note to reply owner for share Decline.",function(){
            commonFunctions.navigationToContactsPage();
            commonFunctions.contactShareCreate();
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain("Share Created:");
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain("Share Created:");
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
            commonFunctions.navigationToContactsPage();
            commonFunctions.contactShareCreate();
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain("Share Created:");
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain("Share Created:");
            //need to be fixed. Following should click Decline share button in share created email in mail detail view.
            mailDetailPanelPage.getMailDetailDeclineShareButton().click();
            expect(commonFunctions.checkOpeningOfDeclineShareDialog().isPresent()).toBe(true);
            expect(mailLeftPanelPage.getStanderdMessageForDeclineShareOption().isSelected()).toBe(true);
            mailDetailPanelPage.getYesButtonFromDeclineShareDailog.click();
            //need to be fixed for check Decline mail is send or not and mail is moved in Trash or not. we have to create method for this because this methad calls many place
          });

          it("It should not send mail to reply owner for decline of share.",function(){
            commonFunctions.navigationToContactsPage();
            commonFunctions.contactShareCreate();
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain("Share Created:");
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain("Share Created:");
            //need to be fixed. Following should click Decline share button in share created email in mail detail view.
            mailDetailPanelPage.getMailDetailDeclineShareButton().click();
            expect(commonFunctions.checkOpeningOfDeclineShareDialog().isPresent()).toBe(true);
            getNoNotificationForDeclineShareOption().click();
            mailDetailPanelPage.getYesButtonFromDeclineShareDailog.click();
            //need to be fixed for check Decline mail is send or not and mail is moved in Trash or not. we have to create method for this because this methad calls many place
          });

          it("It should display notification message about share Decline.",function(){
            commonFunctions.navigationToContactsPage();
            commonFunctions.contactShareCreate();
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain("Share Created:");
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain("Share Created:");
            //need to be fixed. Following should click Decline share button in share created email in mail detail view.
            mailDetailPanelPage.getMailDetailDeclineShareButton().click();
            expect(commonFunctions.checkOpeningOfDeclineShareDialog().isPresent()).toBe(true);
            mailDetailPanelPage.getYesButtonFromDeclineShareDailog.click();
            expect(mailDetailPanelPage.getNotificitionMessageOnDeclineShare()).toEqual('No of message(s) moved to Trash');
            //need to be fixed for check Decline mail is send or not and mail is moved in Trash or not. we have to create method for this because this methad calls many place
          });

          it("It should  close the share decline dialog.",function(){
            commonFunctions.navigationToContactsPage();
            commonFunctions.contactShareCreate();
            commonFunctions.navigationToMailPage();
            mailLeftPanelPage.checkLeftSideUserDefineFolders(parentFolder).click();
            expect(mailListPanelPage.getMailListFirstmailSubject()).toContain("Share Created:");
            mailListPanelPage.getFirstMail().click();
            expect(mailDetailPanelPage.getMailDetailMailSubjectText()).toContain("Share Created:");
            //need to be fixed. Following should click Decline share button in share created email in mail detail view.
            mailDetailPanelPage.getMailDetailDeclineShareButton().click();
            expect(commonFunctions.checkOpeningOfDeclineShareDialog().isPresent()).toBe(true);
            mailDetailPanelPage.getNoButtonFromDeclineShareDailog.click();
            expect(commonFunctions.checkOpeningOfDeclineShareDialog().isPresent()).toBe(false);
            expect(mailListPanelPage.getFirstMail().isSelected()).toBe(true);
          });

      });
    });

  it('Trash folder right-click options.',function(){
      describe("Protractor suite to test Trash folder right-click options",function(){


          it("Expand all should be disabled if Trash folder is empty and it should enable if Trash folder isn't empty & on clicking on it it should expand all the filders.",function(){
            commonFunctions.navigationToContactsPage();
            mailLeftPanelPage.getTrashFolder();
            if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(true)) {
              mailLeftPanelPage.getTrashFolder();
              mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(trashFolder);
              expect(mailLeftPanelPage.getSystemFolderDropDownExpandAllOption().isEnabled()).toBe(true);
              mailLeftPanelPage.getSystemFolderDropDownExpandAllOption().click();
            }
            else {
              mailLeftPanelPage.getTrashFolder();
              mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(trashFolder);
              expect(mailLeftPanelPage.getSystemFolderDropDownExpandAllOption().isEnabled()).toBe(false);
            }
          });

          it("Empty Trash should be disabled if Trash folder is empty and it should enable if Trash folder isn't empty & on clicking on it it should delete all the items from Trash.",function(){
            commonFunctions.navigationToContactsPage();
            mailLeftPanelPage.getTrashFolder();
            if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(true)) {
              mailLeftPanelPage.getTrashFolder();
              mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(trashFolder);
              expect(mailLeftPanelPage.getEmptyTrashOption().isEnabled()).toBe(true);
              mailLeftPanelPage.getEmptyTrashOption().click();
              if (expect(mailLeftPanelPage.getEmptyTrashConfirmationDialog().isPresent()).toBe(true)) {
                expect(mailLeftPanelPage.getEmptyTrashConfirmationDialog().isPresent()).toBe(true);
                mailLeftPanelPage.getEmptyTrashConfirmationDialogCancelButton().click();
                expect(mailLeftPanelPage.getEmptyTrashConfirmationDialog().isPresent()).toBe(false);
                mailLeftPanelPage.getTrashFolder();
                mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(trashFolder);
                expect(mailLeftPanelPage.getEmptyTrashOption().isEnabled()).toBe(true);
                mailLeftPanelPage.getEmptyTrashOption().click();
                expect(mailLeftPanelPage.getEmptyTrashConfirmationDialog().isPresent()).toBe(true);
                mailLeftPanelPage.getEmptyTrashConfirmationDialogOkButton().click();
                expect(commonFunctions.getNotificationToastMessageText()).toEqual('Folder '+ trashFolder + ' emptied');
              }
            }
            else {
              mailLeftPanelPage.getTrashFolder();
              mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(trashFolder);
              expect(mailLeftPanelPage.getEmptyTrashOption().isEnabled()).toBe(false);
            }
          });

          it("Recover deleted items should be close in case of clicking on close button.",function(){
            commonFunctions.navigationToContactsPage();
            mailLeftPanelPage.getTrashFolder();
            mailLeftPanelPage.getTrashFolder();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(trashFolder);
            expect(mailLeftPanelPage.getRecoverDeletedItemsOption().isEnabled()).toBe(true);
            mailLeftPanelPage.getRecoverDeletedItemsOption().click();
            expect(mailLeftPanelPage.getRecoverDeletedItemsDialog().isPresent()).toBe(true);
            mailLeftPanelPage.getRecoverDeletedItemsCloseDialog().click();
          });

          it("It should search deleted entry.",function(){
            mailLeftPanelPage.getTrashFolder();
            commonFunctions.navigationToContactsPage();
            mailLeftPanelPage.getTrashFolder();
            mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(trashFolder);
            expect(mailLeftPanelPage.getRecoverDeletedItemsOption().isEnabled()).toBe(true);
            mailLeftPanelPage.getRecoverDeletedItemsOption().click();
            expect(mailLeftPanelPage.getRecoverDeletedItemsDialog().isPresent()).toBe(true);
            mailLeftPanelPage.getRecoverDeletedItemsSearcheDialog().sendKeys(searchText);
            mailLeftPanelPage.getRecoverDeletedItemssearchButtonDialog().click();
            //Script for recover funsnality is pending because this funsnality is yet not developed and we need to take a look on devlopment so we devlop it once funsnality is developed.
            mailLeftPanelPage.getRecoverDeletedItemsCloseDialog().click();
          });
      });
    });

  it('Address Book in sidebar of contact page.',function(){
      describe("Protractor suite to test Address Book in sidebar of contact page.",function(){

          it("It should select contacts as per the filter.",function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder();
            if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
              expect(contactListPanelPage.getContactListNoResultFoundMessage().isPresent()).toBe(true);
              expect(contactListPanelPage.getContactListFilterButton().isEnabled()).toBe(false);
              //create contact script so we can go through the script.
            }
            if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(true)) {
              expect(contactListPanelPage.getContactListFilterButton().isEnabled()).toBe(true);
              contactListPanelPage.getContactListFilterButton().click();
              expect(contactListPanelPage.getContactListFilterSuggestion().isPresent()).toBe(true);
              contactListPanelPage.getOptionFromFilterSuggestion(filterOption);
              if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
                expect(contactListPanelPage.getContactListNoResultFoundMessage().isPresent()).toBe(true);
              }
            }

          });

          it('Initially it should fetch and display 100 contacts and then as user scrolls down in the list panel for more contacts.',function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder();
            if (expect(contactListPanelPage.getContactListLastContact(99).isPresent()).toBe(true)) {
              //Following should click on 99th contact in the contact list panel and after clicking it loads next 100 contacts in list panel.
              contactListPanelPage.getContactListLastContact(99);
            }
          });

          it('Initially it should fetch and display 100 contacts and then as user scrolls down in the list panel for more contacts it should also work after filter apply.',function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder();
            if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(true)) {
              expect(contactListPanelPage.getContactListFilterButton().isEnabled()).toBe(true);
              contactListPanelPage.getContactListFilterButton().click();
              expect(contactListPanelPage.getContactListFilterSuggestion().isPresent()).toBe(true);
              contactListPanelPage.getOptionFromFilterSuggestion(filterOption);
              if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
                expect(contactListPanelPage.getContactListNoResultFoundMessage().isPresent()).toBe(true);
              }
            }
            if (expect(contactListPanelPage.getContactListLastContact(99).isPresent()).toBe(false)) {
              // Wright a script to import more then 100 contacts with same filter ex: import more then 100 contacts which start with "j".
            }
            //Following should click on 99th contact in the contact list panel and after clicking it loads next 100 contacts in list panel.
            contactListPanelPage.getContactListLastContact(99);

          });

          it("It should select ALL as a by default value of filter",function(){
            commonFunctions.navigationToContactsPage();
            contactLeftPanelPage.getContactsFolder();
            if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
              // insert a script for import a contact
            }
            else {
              contactListPanelPage.getContactListFilterButton().click();
              expect(contactListPanelPage.getContactListFilterSuggestion().isPresent()).toBe(true);
              expect(contactListPanelPage.getSelectedContactFilterText()).toEqual(filterDefaultSelect);
            }
          });
          // Contacts are alphabetically sorted or not is still pending because we have no idea how to test it through the protractor scripts.
      });
    });

  it('Tags in sidebar of contact page.',function(){
      describe("Protractor suite to test Tags in sidebar of contact page.",function(){

          it("It should select contact from the tags",function(){
            commonFunctions.navigationToContactsPage();
            if (expect(mailLeftPanelPage.checkForNoTags(tagName).isPresent()).toBe(false)) {
              // create tag script to create
              // script for tag a contacts with neawly created tag so we can go further with the scripts
            }
            expect(mailLeftPanelPage.checkForNoTags(tagName).isPresent()).toBe(true);
            mailLeftPanelPage.getTagFromTagList(tagName);
            if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
              expect(contactListPanelPage.getContactListNoResultFoundMessage().isPresent()).toBe(true);
              expect(contactListPanelPage.getContactListFilterButton().isEnabled()).toBe(false);
            }
            if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(true)) {
              expect(contactListPanelPage.getContactListFilterButton().isEnabled()).toBe(true);
              contactListPanelPage.getContactListFilterButton().click();
              expect(contactListPanelPage.getTagNameFromFirstContact()).toEqual(tagName);
              expect(contactListPanelPage.getContactListFilterSuggestion().isPresent()).toBe(true);
              contactListPanelPage.getOptionFromFilterSuggestion(filterOption);
              contactListPanelPage.getContactListFilterButton().click();
              expect(contactListPanelPage.getTagNameFromFirstContact()).toEqual(tagName);
              if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
                expect(contactListPanelPage.getContactListNoResultFoundMessage().isPresent()).toBe(true);
              }
            }
          });

          it('Initially it should fetch and display 100 contacts and then as user scrolls down in the list panel for more contacts it should also work after filter apply.',function(){
            commonFunctions.navigationToContactsPage();
            expect(mailLeftPanelPage.checkForNoTags(tagName).isPresent()).toBe(true);
            mailLeftPanelPage.getTagFromTagList(tagName);
            if (expect(contactListPanelPage.getContactListLastContact(99).isPresent()).toBe(false)) {
              // Wright a script to import more then 100 contacts with same filter ex: import more then 100 contacts which start with "j".
            }
            //Following should click on 99th contact in the contact list panel and after clicking it loads next 100 contacts in list panel.
            contactListPanelPage.getContactListLastContact(99);

          });
      });
    });

    it('New Address book dialog.',function(){
      describe("Protractor suite to test New Address book dialog.",function(){

        it('It should test new New Address book dialog is opened or not and it should close on clicking cancel button',function(){
          commonFunctions.navigationToContactsPage();
          expect(contactLeftPanelPage.getContactsFolder().isPresent()).toBe(true);
          contactLeftPanelPage.getContactsFolder();
          mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(contactsFolderName);
          expect(contactLeftPanelPage.getAddressbookDropdown().isPresent()).toBe(true);
          contactLeftPanelPage.getOptionFromAddressbookDropdown().click(1);
          expect(contactLeftPanelPage.getCreateNewAddressBookdialogbox().isPresent()).toBe(true);
          expect(contactLeftPanelPage.getCreateNewAddressbookDialogHeader()).toEqual(createNewAddressbookDialogHeader);
          expect(contactLeftPanelPage.getCancelButtonFromCreateNewAddressbookDialog().isPresent()).toBe(true);
          getCancelButtonFromCreateNewAddressbookDialog().click();
          expect(contactLeftPanelPage.getCreateNewAddressBookdialogbox().isPresent()).toBe(false);
        });

        it('It should create new addressbook',function(){
          commonFunctions.navigationToContactsPage();
          expect(contactLeftPanelPage.getContactsFolder().isPresent()).toBe(true);
          if (expect(mailLeftPanelPage.checkLeftSideUserDefineFolders(newFolderName).isPresent()).toBe(true)) {
            //Delete folder script so we can go through the script
          }
          contactLeftPanelPage.getContactsFolder();
          mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(contactsFolderName);
          expect(contactLeftPanelPage.getAddressbookDropdown().isPresent()).toBe(true);
          contactLeftPanelPage.getOptionFromAddressbookDropdown().click(1);
          expect(contactLeftPanelPage.getCreateNewAddressBookdialogbox().isPresent()).toBe(true);
          expect(contactLeftPanelPage.getCreateNewAddressbookDialogHeader()).toEqual(createNewAddressbookDialogHeader);
          expect(contactLeftPanelPage.getCancelButtonFromCreateNewAddressbookDialog().isPresent()).toBe(true);
          contactLeftPanelPage.getTextboxFromCreateNewAddressbookDialog().sendKeys(newFolderName);
          contactLeftPanelPage.getOkButtonFromCreateNewAddressbookDialog().click();
        });

        // We haven't mockups for this so I can't under stand how we use colour option and I did RND for this but I didn't get any solution and Idea about it so we develope script for this once we develope the funsnality.

      });
    });

    it('Edit Address book dialog.',function(){
      describe("Protractor suite to test Edit Address book dialog.",function(){

        it('It should test Edit Address book dialog is opened or not and it should close on clicking cancel button',function(){
          commonFunctions.navigationToContactsPage();
          expect(contactLeftPanelPage.getContactsFolder().isPresent()).toBe(true);
          contactLeftPanelPage.getContactsFolder();
          mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(contactsFolderName);
          expect(contactLeftPanelPage.getAddressbookDropdown().isPresent()).toBe(true);
          contactLeftPanelPage.getOptionFromAddressbookDropdown().click(4); // value can be change after the development.
          expect(contactLeftPanelPage.getEditAddressBookdialogbox().isPresent()).toBe(true);
          expect(contactLeftPanelPage.getEditAddressbookDialogHeader()).toEqual(editAddressbookDialogHeaderText);
          expect(contactLeftPanelPage.getCancelButtonFromEditAddressbookDialog().isPresent()).toBe(true);
          expect(contactLeftPanelPage.getOkButtonFromEditAddressbookDialog().isPresent()).toBe(true);
          expect(contactLeftPanelPage.getShareButtonFromEditAddressbookDialog().isPresent()).toBe(true);
          contactLeftPanelPage.getCancelButtonFromEditAddressbookDialog().click();
          expect(contactLeftPanelPage.getCreateNewAddressBookdialogbox().isPresent()).toBe(false);
        });

        it('It should OPEN Share dialog from edit Address book dialog and it should close on clicking cancel button',function(){
          commonFunctions.navigationToContactsPage();
          expect(contactLeftPanelPage.getContactsFolder().isPresent()).toBe(true);
          contactLeftPanelPage.getContactsFolder();
          mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(contactsFolderName);
          expect(contactLeftPanelPage.getAddressbookDropdown().isPresent()).toBe(true);
          contactLeftPanelPage.getOptionFromAddressbookDropdown().click(4); // value can be change after the development.
          expect(contactLeftPanelPage.getEditAddressBookdialogbox().isPresent()).toBe(true);
          expect(contactLeftPanelPage.getShareButtonFromEditAddressbookDialog().isPresent()).toBe(true);
          contactLeftPanelPage.getShareButtonFromEditAddressbookDialog().click();
          expect(contactLeftPanelPage.getShareAddressBookdialogbox().isPresent()).toBe(false);
        });

        it('It should OPEN Edit Address book dialog is opened or not and it should close on clicking OK button',function(){
          commonFunctions.navigationToContactsPage();
          expect(contactLeftPanelPage.getContactsFolder().isPresent()).toBe(true);
          contactLeftPanelPage.getContactsFolder();
          mailLeftPanelPage.getUserFolderDropDownOutsideSystemFolder(contactsFolderName);
          expect(contactLeftPanelPage.getAddressbookDropdown().isPresent()).toBe(true);
          contactLeftPanelPage.getOptionFromAddressbookDropdown().click(4); // value can be change after the development.
          expect(contactLeftPanelPage.getEditAddressBookdialogbox().isPresent()).toBe(true);
          expect(contactLeftPanelPage.getEditAddressbookDialogHeader()).toEqual(editAddressbookDialogHeaderText);
          expect(contactLeftPanelPage.getCancelButtonFromEditAddressbookDialog().isPresent()).toBe(true);
          expect(contactLeftPanelPage.getOkButtonFromEditAddressbookDialog().isPresent()).toBe(true);
          expect(contactLeftPanelPage.getShareButtonFromEditAddressbookDialog().isPresent()).toBe(true);
          contactLeftPanelPage.getEditAddressbookTextbox().sendKeys(editFolderText);
          expect(contactLeftPanelPage.getColourDropDownForEditAddressbook().isPresent()).toBe(true);
          contactLeftPanelPage.selectColourFromDropDownofEditAddressbook(1).click();
          contactLeftPanelPage.getOkButtonFromEditAddressbookDialog().click();
          expect(contactLeftPanelPage.getCreateNewAddressBookdialogbox().isPresent()).toBe(false);
          expect(contactLeftPanelPage.getEditAddressbookSuccessMessage()).toEqual('Address book ' + editFolderText + ' has been updated');
        });

      });
    });

    it('Find Share dialog.',function(){
      describe("Protractor suite to test Find Share dialog.",function(){

        it('It should test Find Share dialog is opened or not and it should close on clicking cancel button',function(){
          commonFunctions.navigationToContactsPage();
          contactLeftPanelPage.getContactListHorizontalDots().click();
          expect(contactLeftPanelPage.getContactListHorizontalDotsDropDown().isPresent()).toBe(true);
          contactLeftPanelPage.setContactListDropDown(2).click(); // passed argument is set as per the Zimbra but it can be changed in uxf after functionality is developed
          expect(contactLeftPanelPage.getFindShareDialog().isPresent()).toBe(true);
          expect(contactLeftPanelPage.getOkBottonOfFindShareDialog().isPresent()).toBe(true);
          expect(contactLeftPanelPage.getCancelBottonOfFindShareDialog().isPresent()).toBe(true);
          contactLeftPanelPage.getCancelBottonOfFindShareDialog().click();
          expect(contactLeftPanelPage.getFindShareDialog().isPresent()).toBe(false);
        });

        it('It should add Share.',function(){
          commonFunctions.navigationToContactsPage();
          contactLeftPanelPage.getContactListHorizontalDots().click();
          expect(contactLeftPanelPage.getContactListHorizontalDotsDropDown().isPresent()).toBe(true);
          contactLeftPanelPage.setContactListDropDown(2).click(); // passed argument is set as per the Zimbra but it can be changed in uxf after functionality is developed
          expect(contactLeftPanelPage.getFindShareDialog().isPresent()).toBe(true);
          expect(contactLeftPanelPage.getFirstCheckboxFindShareDialog().isPresent()).toBe(true);
          if (expect(contactLeftPanelPage.getFirstCheckboxFindShareDialog().isPresent()).toBe(true)) {
            contactLeftPanelPage.getFirstCheckboxFindShareDialog().click();
            expect(contactLeftPanelPage.getOkBottonOfFindShareDialog().click();
            expect(contactLeftPanelPage.getFindShareSuccessMessage()).toEqual(addShareSuccessMessage);
            expect(contactLeftPanelPage.getFindShareDialog().isPresent()).toBe(false);

          }
        });

        it('It should search Share',function(){
          commonFunctions.navigationToContactsPage();
          contactLeftPanelPage.getContactListHorizontalDots().click();
          expect(contactLeftPanelPage.getContactListHorizontalDotsDropDown().isPresent()).toBe(true);
          contactLeftPanelPage.setContactListDropDown(2).click(); // passed argument is set as per the Zimbra but it can be changed in uxf after functionality is developed
          expect(contactLeftPanelPage.getFindShareDialog().isPresent()).toBe(true);
          contactLeftPanelPage.getFindShareSearchTextBox().sendKeys(validEmail);
          mailLeftPanelPage.getSuggestion().click();
          // above script search the share for perticular user but we have to talk a look how we can identify that search results are from that user only so we develope next script after develope this functionality
          expect(contactLeftPanelPage.getOkBottonOfFindShareDialog().click();
          expect(contactLeftPanelPage.getFindShareDialog().isPresent()).toBe(false);
        });


      });
    });

    it('Contact detail panel',function(){
      describe("Protractor suite to test Contact detail panel.",function(){

        it('Contacts should be display in by default ordered by alphabets based on (File As field) in contact list panel.',function(){
          commonFunctions.navigationToContactsPage();
          contactLeftPanelPage.getContactsFolder();
          result = contactListPanelPage.getContactNameFromContactListPanel(contactName);
          result.isPresent().then(function(value){
            if(value == true){
               contactListPanelPage.getContactNameFromContactListPanel(contactName).click();
               contactListPanelPage.getContactListHeaderDeleteButton().click();
             };
          });
          //need to be fixed. Following should open contact compose window through floating compose button from contact page.
          commonFunctions.getFloatingCompose();
          expect(mailLeftPanelPage.getComposeContactWindow().isPresent()).toBe(true);
          mailLeftPanelPage.getCloseComposeContactWindow().click();
          contactLeftPanelPage.getContactFirstNameField().sendKeys(contactFirstName);
          contactLeftPanelPage.getContactLastNameField().sendKeys(contactLastName);
          contactLeftPanelPage.getContactWindowFileAsDropDown().click();
          contactLeftPanelPage.getContactWindowFileAsOption(contactFileAsLastFirstOption).click();
          expect(contactLeftPanelPage.getContactSaveButton().isEnabled()).toBe(true);
          contactLeftPanelPage.getContactSaveButton().click();
          newContact = contactFirstName + contactLastName;
          contactListPanelPage.getContactNameFromContactListPanel(newContact).click();
          contactListPanelPage.getContactListEditButton().click();
          expect(contactLeftPanelPage.checkContactEditWindowOpen().isPresent()).toBe(true);
          contactWindowHeader = contactLeftPanelPage.getContactEditWindowHeader();
          contactLeftPanelPage.getContactCloseButton().click();
          //need to be fixed. Following should check contact name as per value selected from contact window file as option.
          expect(contactListPanelPage.getContactListContactName(newContact)).toEqual(contactWindowHeader);
        });

        it('It should display default contact avatar with green plus sign in bottom which allowed to change avatar by uploading new image.',function(){
          expect(contactLeftPanelPage.getComposeContactDefaultAvtar().isPresent()).toBe(true);
          expect(contactLeftPanelPage.getComposeContactAvtarPlusButton().isEnabled()).toBe(true);
          contactLeftPanelPage.getComposeContactAvtarPlusButton().click();
          expect(contactLeftPanelPage.checkUploagImageDialogOpening().isPresent()).toBe(true);
          contactLeftPanelPage.getUploadImageDialogBrowseButton().click();
          //Need to be fixed. Following code should upload user avtar.
        });

      });
    });
>>>>>>> origin/vncuxfautotest
});
