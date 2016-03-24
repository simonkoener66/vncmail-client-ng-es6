var homePage = require("../page/homePage.js");
var loginPage = require("../page/loginPage.js");
var commonFunctions = require("../commonFunctions/commonFunctions.js");
var mailLeftPanelPage = require("../page/mailLeftPanelPage.js");
var navigationPage = require("../page/navigationPage.js");
var mailListPanelPage = require("../page/mailListPanelPage.js");
var mailDetailPanelPage = require("../page/mailDetailPanelPage.js");

describe('Protractor Suit to test Mail list', function() {

  afterEach(function() {
    browser.waitForAngular();
  });

  it('Login to Uxf', function() {
      commonFunctions.logIn();
  });

  it('Clicking on Inbox folder', function(){
    mailLeftPanelPage.getInboxFolder();
    expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/mail/inbox');
  });

  it('Delete the mail', function() {
      mailLeftPanelPage.getInboxFolder().click();
      mailListPanelPage.getFirstMail().click();
      mailListPanelPage.getDeleteButton().click();
      expect(mailListPanelPage.getDeleteNotificationMessage()).toEqual('conversation moved to Trash');
  });

  it("Mail List panel should display received emails with Sender's Avtar,Email details,Star button,Read/Unread button & Tags(If any).",function(){
      describe("Protractor suite to test Mail List Panel",function(){
          it("It should display sender's avtar in size equal to the email three lines in mail list panel.",function(){
            commonFunctions.navigationToMailPage();
            expect(mailListPanelPage.getMailListUserAvtar().isPresent()).toBe(true);
          });

          it("It should display email details like user-name, email subject name,body in bold in mail list panel.",function(){
            commonFunctions.navigationToMailPage();
            expect(mailListPanelPage.getMailListSenderName().isPresent()).toBe(true);
            expect(mailListPanelPage.getMailListMailSubject().isPresent()).toBe(true);
            expect(mailListPanelPage.getMailListMailBodyText().isPresent()).toBe(true);
          });

          it("It should fill star button with black colour.",function(){
            commonFunctions.navigationToMailPage();
            expect(mailListPanelPage.getMailListStarButton().isPresent()).toBe(true);
          });

          it("It should display email content in mail detail view.",function(){
            commonFunctions.navigationToMailPage();
            expect(mailListPanelPage.getMailListUserAvtar().isPresent()).toBe(true);
            mailListPanelPage.getMailListUserAvtar().click();
            expect(mailListPanelPage.getMailDetailMailSubject().isPresent()).toBe(true);
          });

          it("It should display sender's name & If email contains any conversation then it should display >> sign after sender's name.",function(){
            commonFunctions.navigationToMailPage();
            expect(mailListPanelPage.getMailListConversationImage().isPresent()).toBe(true);
            mailListPanelPage.getMailListConversationImage().click();
            expect(mailListPanelPage.checkOpenOfMailListConversations().isPresent()).toBe(true);
            expect(mailListPanelPage.getMailListConversations().isPresent()).toBe(true);
            mailListPanelPage.getMailListConversations().click();
            expect(mailListPanelPage.getMailDetailMailSubject().isPresent()).toBe(true);
          });

          it('It should display no of tags with its name and colour.',function(){
            commonFunctions.navigationToMailPage();
            expect(mailListPanelPage.checkMailListTags().isPresent()).toBe(true);
            expect(mailListPanelPage.chechMailListFirstTag()).toContain('Tag');
          });

          it('It should display plus sign with total no of tags with default colour background.',function(){
            commonFunctions.navigationToMailPage();
            expect(mailListPanelPage.checkMailListTags().isPresent()).toBe(true);
            expect(mailListPanelPage.checkForMoreTags()).toContain('+');
          });

          it('It should display attachment image only if email contains attachment(s).',function(){
            commonFunctions.navigationToMailPage();
            expect(mailListPanelPage.checkMailListAttachmentImage().isPresent()).toBe(true);
            mailListPanelPage.checkMailListAttachmentImage().click();
            expect(mailListPanelPage.getMailDetailMailAttachments().isPresent()).toBe(true);
          });

          it('It should display current time with AM/PM at the end of first line in the row in the mail list panel.',function(){
            commonFunctions.navigationToMailPage();
            expect(mailListPanelPage.checkMailListMailCurrentTime().isPresent()).toBe(true);
          });

          it('It should Flag/Unflag email(s) as important by displaying proper message.',function(){
            commonFunctions.navigationToMailPage();
            expect(mailListPanelPage.getMailListStarButton().isPresent()).toBe(true);
            mailListPanelPage.getMailListStarButton().click();
            expect(commonFunctions.getNotificationToastMessage().isDisplayed()).toBe(true);
            mailListPanelPage.getMailListStarButton().click();
            expect(commonFunctions.getNotificationToastMessage().isDisplayed()).toBe(true);
          });

          it('It should display mail subject upto 60 characters long.For more than 60 characters it should be shortened by two horizontal dots.',function(){
            commonFunctions.navigationToMailPage();
            expect(mailListPanelPage.getMailListSubjectShortenDots().isPresent()).toBe(true);
            mailListPanelPage.getMailListSubjectShortenDots().click();
            expect(mailListPanelPage.getMailListSubjectCharacterCount()).toEqual(60);
          });

          it('It should display mail body upto 60 characters long.For more than 60 characters it should be shortened by two horizontal dots.',function(){
            commonFunctions.navigationToMailPage();
            expect(mailListPanelPage.getMailListBodyShortenDots().isPresent()).toBe(true);
            mailListPanelPage.getMailListBodyShortenDots().click();
            expect(mailListPanelPage.getMailListBodyCharacterCount()).toEqual(60);
          });
      });
  });

});
