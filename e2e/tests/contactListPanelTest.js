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
var testTag = 'testtag', tagMessage = 'tagged', moveToFolderOption = 'contact', tagOptionNewTag='New tag', tagOptionRemoveAllTag='Remove All Tag';


describe('Protractor Suit to test contact Page', function() {
  afterEach(function() {
    browser.waitForAngular();
  });

  it('Login to Uxf', function() {
      commonFunctions.logIn();
  });

  it('Check for Contacts option selected in Navigation Menu', function(){
    commonFunctions.navigationToContactsPage();
  });

  it('Clicking on Contacts folder', function(){
    contactLeftPanelPage.getContactsFolder();
    expect(browser.getCurrentUrl()).toContain(browser.params.serverUrl.url+'/contacts/list/detail');
  });

  it('It should Tag the contacts.',function(){
      describe("Protractor suite to test Tag with the contacts",function(){

        it('Tag a single contact', function(){
          commonFunctions.navigationToContactsPage();
          if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
            //Create contact function so we can go through the tag contact script
          }
          contactListPanelPage.getContactListFirstContact().click();
          contactListPanelPage.getContactListHeaderTagButton().click();
          expect(contactListPanelPage.checkContactListHeaderTagMenuOpen().isPresent()).toBe(true);
          if (expect(contactListPanelPage.getContactListHeaderTagButtonOption(testTag).isPresent()).toBe(false)) {
            //Create tag function so we can go through the tag contact script
          }
          contactListPanelPage.getContactListHeaderTagButtonOption(testTag).click();
          expect(commonFunctions.getNotificationToastMessageText()).toEqual('1'+ tagMessage + testTag);
        });

        it('Open Create Tag dialog ', function(){
          commonFunctions.navigationToContactsPage();
          if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
            //Create contact function so we can go through the tag contact script
          }
          contactListPanelPage.getContactListFirstContact().click();
          contactListPanelPage.getContactListHeaderTagButton().click();
          expect(contactListPanelPage.checkContactListHeaderTagMenuOpen().isPresent()).toBe(true);
          contactListPanelPage.getContactListHeaderTagButtonOption(tagOptionNewTag).click();
          expect(commonFunctions.checkCreateNewTagDialogOpen().isPresent()).toBe(true);
        });

        it('remove tag from the contact', function(){
          commonFunctions.navigationToContactsPage();
          if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
            //Create contact function so we can go through the tag contact script
          }
          contactListPanelPage.getContactListFirstContact().click();
          contactListPanelPage.getContactListHeaderTagButton().click();
          expect(contactListPanelPage.checkContactListHeaderTagMenuOpen().isPresent()).toBe(true);
          if (expect(contactListPanelPage.getContactListHeaderTagButtonOption(tagOptionRemoveAllTag).isEnabled()).toBe(true)) {
            contactListPanelPage.getContactListHeaderTagButtonOption(tagOptionRemoveAllTag).click();
            expect(commonFunctions.getNotificationToastMessageText()).toEqual('Tag '+ testTag + ' is removed from 1 contacts.');
          }
          else {
            expect(contactListPanelPage.getContactListHeaderTagButtonOption(tagOptionRemoveAllTag).isEnabled()).toBe(false);
          }
        });
     });
  });

  it('Delete button in Contact panel list',function(){
      describe("Protractor suite to test Delete button in Contact panel list.",function(){

        it("Delete the contact with help of delete button",function(){
          commonFunctions.navigationToContactsPage();
          contactLeftPanelPage.ContactsFolder().click();
          if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(true)) {
            contactListPanelPage.getContactListFirstContact().click();
            expect(contactListPanelPage.getContactListHeaderDeleteButton().isEnabled(true);
            contactListPanelPage.getContactListHeaderDeleteButton().click();
            expect(contactListPanelPage.getContactDeleteMessage()).toEqual('1 contact(s) have been moved to trash');
          }
          else {
            expect(contactListPanelPage.getContactListHeaderDeleteButton().isEnabled(false);
          }
        });

    });
  });

  it('Floating compose button for create new contact',function(){
      describe("Protractor suite to test Floating compose button.",function(){

        it("Floating compose button",function(){
          commonFunctions.navigationToContactsPage();
          navigationPage.activateNavigationMenu();
          commonFunctions.getFloatingCompose();
          expect(contactLeftPanelPage.CreateNewAddressBookdialogbox().isPresent()).toBe(true);
        });

    });
  });

  it('Contact view toolbar buttons',function(){
      describe("Protractor suite to test toolbar buttons of Contact view.",function(){

        it("Contact view buttons should disabled in case of none contacts selected.",function(){
          commonFunctions.navigationToContactsPage();
          if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
            expect(contactListPanelPage.getContactListNoResultFoundMessage().isPresent()).toBe(true);
            expect(contactListPanelPage.getContactListEditButton().isPresent()).toBe(false);
            expect(contactListPanelPage.getContactListHeaderDeleteButton().isPresent()).toBe(false);
            expect(contactListPanelPage.getContactListMoveButton().isPresent()).toBe(false);
            expect(contactListPanelPage.getContactListHeaderTagButton().isPresent()).toBe(false);
            expect(contactListPanelPage.getContactListPrintButton().isPresent()).toBe(false);
          }
          else {
            expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(true);
            expect(contactListPanelPage.getContactListEditButton().isPresent()).toBe(true);
            expect(contactListPanelPage.getContactListHeaderDeleteButton().isPresent()).toBe(true);
            expect(contactListPanelPage.getContactListMoveButton().isPresent()).toBe(true);
            expect(contactListPanelPage.getContactListHeaderTagButton().isPresent()).toBe(true);
            expect(contactListPanelPage.getContactListPrintButton().isPresent()).toBe(true);
          }
        });

        it("Contact view buttons should disabled in case of selecting multiple contacts ",function(){
          //we have to check the development means we have to check the code what changes is or what effects happening in case of multiple contact selection so we can create a scripts on bases of that
        });

        it("Delete contact option ",function(){
            commonFunctions.navigationToContactsPage();
            if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
              //Create contact function so we can go through the script.
            }
            else {
              contactListPanelPage.getContactListHeaderDeleteButton().click();
              // Add a function to finde contact from trash so we can identify that contact is moved in trash or not.
            }
        });

        it("Move contact option ",function(){
            commonFunctions.navigationToContactsPage();
            if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
              expect(contactListPanelPage.getContactListMoveButton().isPresent()).toBe(false);
              //Create contact function so we can go through the script.
            }
            else {
              contactListPanelPage.getContactListMoveButton().click();
              expect(contactListPanelPage.getContactListMoveButtonDropdownlist().isPresent()).toBe(false);
              contactListPanelPage.selectContactListMoveButtonDropdownoption(moveToFolderOption);
              //Here nee to attach a move folder fumction so we can test that contact is moved or not.
            }
        });

        it('Tag a single contact', function(){
          commonFunctions.navigationToContactsPage();
          if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
              expect(contactListPanelPage.getContactListHeaderTagButton().isPresent()).toBe(false);
            //Create contact function so we can go through the tag contact script
          }
          contactListPanelPage.getContactListFirstContact().click();
          contactListPanelPage.getContactListHeaderTagButton().click();
          expect(contactListPanelPage.checkContactListHeaderTagMenuOpen().isPresent()).toBe(true);
          if (expect(contactListPanelPage.getContactListHeaderTagButtonOption(testTag).isPresent()).toBe(false)) {
            //Create tag function so we can go through the tag contact script
          }
          contactListPanelPage.getContactListHeaderTagButtonOption(testTag).click();
          expect(commonFunctions.getNotificationToastMessageText()).toEqual('1'+ tagMessage + testTag);
        });

        it('Print a contact', function(){
          commonFunctions.navigationToContactsPage();
          if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
            expect(contactListPanelPage.getContactListPrintButton().isPresent()).toBe(false);
            //Create contact function so we can go through the tag contact script
          }
          contactListPanelPage.getContactListFirstContact().click();
          contactListPanelPage.getContactListPrintButton().click();
          expect(contactListPanelPage.getContactListPrintButtonDropdownlist().isPresent()).toBe(true);
        });

        it('Print a contact', function(){
          commonFunctions.navigationToContactsPage();
          if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
            expect(contactListPanelPage.getContactListPrintButton().isPresent()).toBe(false);
            //Create contact function so we can go through the tag contact script
          }
          contactListPanelPage.getContactListFirstContact().click();
          contactListPanelPage.getContactListPrintButton().click();
          expect(contactListPanelPage.getContactListPrintButtonDropdownlist().isPresent()).toBe(true);
          contactListPanelPage.selectContactListPrintButtonDropdownoption(1);
          // right expect statment after the print funsnality is develop
        });

        it('Print a selected contacts', function(){
          commonFunctions.navigationToContactsPage();
          if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
            expect(contactListPanelPage.getContactListPrintButton().isPresent()).toBe(false);
            //Create contact function so we can go through the tag contact script
          }
          contactListPanelPage.getContactListFirstContact().click();
          contactListPanelPage.getContactListPrintButton().click();
          expect(contactListPanelPage.getContactListPrintButtonDropdownlist().isPresent()).toBe(true);
          contactListPanelPage.selectContactListPrintButtonDropdownoption(1);
          // right expect statment after the print funsnality is develop
        });

        it('Print contacts', function(){
          commonFunctions.navigationToContactsPage();
          if (expect(contactListPanelPage.getContactListFirstContact().isPresent()).toBe(false)) {
            expect(contactListPanelPage.getContactListPrintButton().isPresent()).toBe(false);
            //Create contact function so we can go through the tag contact script
          }
          contactListPanelPage.getContactListFirstContact().click();
          contactListPanelPage.getContactListPrintButton().click();
          expect(contactListPanelPage.getContactListPrintButtonDropdownlist().isPresent()).toBe(true);
          contactListPanelPage.selectContactListPrintButtonDropdownoption(2);
          // right expect statment after the print funsnality is develop
        });

    });
  });


});
