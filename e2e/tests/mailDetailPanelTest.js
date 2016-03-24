var homePage = require("../page/homePage.js");
var loginPage = require("../page/loginPage.js");
var commonFunctions = require("../commonFunctions/commonFunctions.js");
var navigationPage = require ("../page/navigationPage.js");
var mailLeftPanelPage = require("../page/mailLeftPanelPage.js");
var mailListPanelPage = require("../page/mailListPanelPage.js");
var mailDetailPanelPage = require("../page/mailDetailPanelPage.js");
var userArjun='arjun@', userJaydeep='jaydeep@', userJay='jay@';
var enter = browser.actions().sendKeys(protractor.Key.ENTER);
var subject = 'LONGBODYDATALONGBODYDATALONGBODYDATALONGBODYDATALONGBODYDATALONGBODYDATALONGBODYDATALONGBODYDATA', composeMailBody=' Hello EveryOne';
var attachFilePath = '/home/vnc/Pictures/images_1.jpg', ToFieldValue, CcFieldValue, attachFileName='images_1.jpg';
var tooltipFrom='From:', tooltipTo='To:', tooltipCc='Cc:', tooltipDate='Date:', tooltipSubject='Subject:';


describe('Protractor test for Mail Detail Panel', function(){
  afterEach(function(){
      browser.waitForAngular();
  });

  it('Login to Uxf', function(){
    commonFunctions.logIn();
  });

  it('Clicking on Inbox folder', function(){
    mailLeftPanelPage.getInboxFolder();
    expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/mail/inbox');
  });

  it('It should display mail list mail details in mail detail view.',function(){
    describe('Protractor suite to test Mail Detail View',function(){

      it("It should display different email information details in mail detail panel",function(){
        commonFunctions.navigationToMailPage();
        commonFunctions.composeNewMail();
        mailLeftPanelPage.getInboxFolder();
        mailListPanelPage.getFirstMail().click();
        expect(mailDetailPanelPage.getMailDetailMailSubjectText().isPresent()).toBe(true);
        expect(mailDetailPanelPage.getMailDetailMailSubjectTextCount()).toEqual(50);
        expect(mailDetailPanelPage.checkMailDetailDateTime().isPresent()).toBe(true);
        expect(mailDetailPanelPage.checkMailDetailUserAvtar().isPresent()).toBe(true);
        browser.actions.moveToElement(getMailDetailFromToCCDropDownImage()).perform();
        expect(mailDetailPanelPage.checkMailDetailFromToCCToolTipMenu().isDisplayed()).toBe(true);
        expect(mailDetailPanelPage.checkMailDetailFromToCCToolTipMenuOption(tooltipFrom).isDisplayed()).toBe(true);
        expect(mailDetailPanelPage.checkMailDetailFromToCCToolTipMenuOption(tooltipTo).isDisplayed()).toBe(true);
        expect(mailDetailPanelPage.checkMailDetailFromToCCToolTipMenuOption(tooltipCc).isDisplayed()).toBe(true);
        expect(mailDetailPanelPage.checkMailDetailFromToCCToolTipMenuOption(tooltipDate).isDisplayed()).toBe(true);
        expect(mailDetailPanelPage.checkMailDetailFromToCCToolTipMenuOption(tooltipSubject).isDisplayed()).toBe(true);
        expect(mailDetailPanelPage.checkMailDetailAttachments().isPresent()).toBe(true);
        expect(mailDetailPanelPage.checkMailDetailTags(mailListPanelPage.chechMailListFirstTag()).isPresent()).toBe(true);
        //need to be fixed. It should display 5 of tags/user avtar initially. then have a text link which expands a section and displays all of them.
        expect(mailDetailPanelPage.checkMailDetailEmailBody().isPresent()).toBe(true);
      });

      it("It should open Reply dialog with details prefilled in respective fields along with different buttons.",function(){
        commonFunctions.navigationToMailPage();
        commonFunctions.composeNewMail();
        mailLeftPanelPage.getInboxFolder();
        mailListPanelPage.getFirstMail().click();
        expect(mailDetailPanelPage.getMailDetailMailSubject().isPresent()).toBe(true);
        mailDetailPanelPage.getMailDetailReplyButton().click();
        //need to be fixed. After clicking reply button in mail detail panel, Reply compose window should get open with prefilled values.
        expect(mailLeftPanelPage.getReplyMailWindow().isPresent()).toBe(true);
        mailLeftPanelPage.checkToFieldPrefilled();
        expect(mailLeftPanelPage.getSubjectField().getAttribute('value')).toEqual(ToFieldValue);
        mailLeftPanelPage.checkSubjectFieldPrefilled();
        expect(mailLeftPanelPage.getSubjectField().getAttribute('value')).toEqual('Re: '+subject);
        mailLeftPanelPage.checkComposeWindowMailBodyPrefilled();
        expect(mailLeftPanelPage.getComposeWindowMailBody().getAttribute('value')).toContain(ToFieldValue);
        expect(mailLeftPanelPage.getComposeWindowMailBody().getAttribute('value')).toContain(subject);
        expect(mailLeftPanelPage.getComposeWindowMailBody().getAttribute('value')).toContain(composeMailBody);
        //need to be fixed. It should Display BCC button between CC & Subject Field and on clicking It should enable BCC field.
        expect(mailLeftPanelPage.getBCCFieldButton().isPresent()).toBe(true);
        mailLeftPanelPage.getBCCFieldButton().click();
        expect(mailLeftPanelPage.getBCCField().isPresent()).toBe(true);
        expect(mailLeftPanelPage.getComposeWindowFooterFontButton().isPresent()).toBe(true);
        expect(mailLeftPanelPage.getComposeWindowFooterAttachmentButton().isPresent()).toBe(true);
        expect(mailLeftPanelPage.getComposeWindowFooterMoreOptionsButton().isPresent()).toBe(true);
        expect(mailLeftPanelPage.saveEmailAsDraft().isPresent()).toBe(true);
        expect(mailLeftPanelPage.sendEmail().isPresent()).toBe(true);
        expect(mailLeftPanelPage.saveEmailAsDraft().isEnabled()).toBe(false);
      });

      it("It should open Reply All dialog with details prefilled in respective fields along with different buttons.",function(){
        commonFunctions.navigationToMailPage();
        commonFunctions.composeNewMail();
        mailLeftPanelPage.getInboxFolder();
        mailListPanelPage.getFirstMail().click();
        expect(mailDetailPanelPage.getMailDetailMailSubject().isPresent()).toBe(true);
        mailDetailPanelPage.getMailDetailReplyAllButton().click();
        //need to be fixed. After clicking reply all button in mail detail panel, Reply all compose window should get open with prefilled values.
        expect(mailLeftPanelPage.getReplyAllMailWindow().isPresent()).toBe(true);
        mailLeftPanelPage.checkToFieldPrefilled();
        expect(mailLeftPanelPage.getToField().getAttribute('value')).toEqual(ToFieldValue);
        mailLeftPanelPage.checkCcFieldPrefilled();
        expect(mailLeftPanelPage.getCcField().getAttribute('value')).toEqual(CcFieldValue);
        mailLeftPanelPage.checkSubjectFieldPrefilled();
        expect(mailLeftPanelPage.getSubjectField().getAttribute('value')).toEqual('Re: '+subject);
        mailLeftPanelPage.checkComposeWindowMailBodyPrefilled();
        expect(mailLeftPanelPage.getComposeWindowMailBody().getAttribute('value')).toContain(ToFieldValue);
        expect(mailLeftPanelPage.getComposeWindowMailBody().getAttribute('value')).toContain(subject);
        expect(mailLeftPanelPage.getComposeWindowMailBody().getAttribute('value')).toContain(composeMailBody);
        //need to be fixed. It should Display BCC button between CC & Subject Field and on clicking It should enable BCC field.
        expect(mailLeftPanelPage.getBCCFieldButton().isPresent()).toBe(true);
        mailLeftPanelPage.getBCCFieldButton().click();
        expect(mailLeftPanelPage.getBCCField().isPresent()).toBe(true);
        expect(mailLeftPanelPage.getComposeWindowFooterFontButton().isPresent()).toBe(true);
        expect(mailLeftPanelPage.getComposeWindowFooterAttachmentButton().isPresent()).toBe(true);
        expect(mailLeftPanelPage.getComposeWindowFooterMoreOptionsButton().isPresent()).toBe(true);
        expect(mailLeftPanelPage.saveEmailAsDraft().isPresent()).toBe(true);
        expect(mailLeftPanelPage.sendEmail().isPresent()).toBe(true);
        expect(mailLeftPanelPage.saveEmailAsDraft().isEnabled()).toBe(false);
      });

      it("It should open Forward dialog with details prefilled in respective fields along with different buttons.",function(){
        commonFunctions.navigationToMailPage();
        commonFunctions.composeNewMail();
        mailLeftPanelPage.getInboxFolder();
        mailListPanelPage.getFirstMail().click();
        expect(mailDetailPanelPage.getMailDetailMailSubject().isPresent()).toBe(true);
        mailDetailPanelPage.getMailDetailForwardButton().click();
        //need to be fixed. After clicking forward button in mail detail panel, Forward compose window should get open with prefilled values.
        expect(mailLeftPanelPage.getForwardMailWindow().isPresent()).toBe(true);
        mailLeftPanelPage.checkSubjectFieldPrefilled();
        expect(mailLeftPanelPage.getSubjectField().getAttribute('value')).toEqual('Re: '+subject);
        mailLeftPanelPage.checkComposeWindowMailBodyPrefilled();
        expect(mailLeftPanelPage.getComposeWindowMailBody().getAttribute('value')).toContain(ToFieldValue);
        expect(mailLeftPanelPage.getComposeWindowMailBody().getAttribute('value')).toContain(subject);
        expect(mailLeftPanelPage.getComposeWindowMailBody().getAttribute('value')).toContain(composeMailBody);
        //need to be fixed. It should Display BCC button between CC & Subject Field and on clicking It should enable BCC field.
        expect(mailLeftPanelPage.getBCCFieldButton().isPresent()).toBe(true);
        mailLeftPanelPage.getBCCFieldButton().click();
        expect(mailLeftPanelPage.getBCCField().isPresent()).toBe(true);
        mailLeftPanelPage.checkComposeWindowAttachmentPrefilled();
        expect(mailLeftPanelPage.getComposeWindowAttachmentText(attachFileName)).toEqual(attachFileName);
        expect(mailLeftPanelPage.getComposeWindowFooterFontButton().isPresent()).toBe(true);
        expect(mailLeftPanelPage.getComposeWindowFooterAttachmentButton().isPresent()).toBe(true);
        expect(mailLeftPanelPage.getComposeWindowFooterMoreOptionsButton().isPresent()).toBe(true);
        expect(mailLeftPanelPage.saveEmailAsDraft().isPresent()).toBe(true);
        expect(mailLeftPanelPage.sendEmail().isPresent()).toBe(true);
        expect(mailLeftPanelPage.saveEmailAsDraft().isEnabled()).toBe(false);
        //need to be fixed. Functioanly for More actions button & its options have not been defined yet.
        mailLeftPanelPage.getComposeWindowFooterMoreOptionsButton().click();
        expect(mailLeftPanelPage.checkComposeWindowFooterMoreOptionsButtonOptions().isPresent()).toBe(true);
      });
    });
  });


});
