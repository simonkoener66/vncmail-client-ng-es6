var mailDetailPanelPage = function(){

  this.getMailDetailMailSubjectText = function(){
    return element(by.xpath('//div[@id="mail-detail"]//h3')).getText().then(function(value){
      return value;
    });
  };

  this.getMailDetailAcceptShareButton = function(){
    //need to be fix. Following element should return accept button of share created email from mail detail view.
    return element(by.xpath('//button[contains(text(),"Accept Share")]'));
  };

  this.getMailDetailDeclineShareButton = function(){
    //need to be fix. Following element should return decline button of share created email from mail detail view.
    return element(by.xpath('//button[contains(text(),"Decline Share")]'));
  };

  this.getMailDetailShareContentSharedItem = function(sharedItemDetail){
    expect(element(by.xpath('//div[@ng-bind-html="message.content"]//th[contains(text(),"'+sharedItemDetail+'")]')).isPresent()).toBe(true);
    return element(by.xpath('//div[@ng-bind-html="message.content"]//th[contains(text(),"'+sharedItemDetail+'")]/parent::tr/td'));
  };

  this.getYesButtonFromDeclineShareDailog = function(){
    //need to be fix. Following element should return Yes button of decling share dailog.
    return element(by.xpath('//button[contains(text(),"Yes")]'));
  };

  this.getUserNoteForDeclineShareOption = function(){
    //need to be fix. Following element should return User-Note Radio button For Decline Share dailogbox
    return element(by.xpath('//DeclineShareMessageoption'));
  };

  this.getUserNoteForDeclineShare = function(){
    //need to be fix. Following element should return User-Note inputbox For Decline Share.
    return element(by.xpath('//UserNoteForDeclineShare'));
  };

  this.getStanderdMessageForDeclineShareOption = function(){
    //need to be fix. Following element should return Standerd Message Radio button For Decline Share dailogbox
    return element(by.xpath('//StanderdShareMessageDropdown'));
  };

  this.getNoNotificationForDeclineShareOption = function(){
    //need to be fix. Following element should return No Notification Message Radio button For Decline Share dailogbox
    return element(by.xpath('//NoMessageDropdown'));
  };

  this.getNotificitionMessageOnDeclineShare = function(){
    //need to be fix. Following element should return Notificition Message On Decline Share.
    return element(by.xpath('//NotificitionMessageOnDeclineShare')).getText();
  };

  this.getNoButtonFromDeclineShareDailog = function(){
    //need to be fix. Following element should return no button of decling share dailog.
    return element(by.xpath('//button[contains(text(),"No")]'));
  };

  this.getMailDetailMailSubject = function(){
    return element(by.xpath('//div[@id="mail-detail"]//h3'));
  };

  this.getMailDetailMailSubjectTextCount = function(){
    return element(by.xpath('//div[@id="mail-detail"]//h3')).getText().then(function(value){
      return value.length;
    });
  };

  this.checkMailDetailDateTime = function(){
    return element(by.xpath('//div[@ng-click="vm.toggleMessage($index, $event)"]//p'));
  };

  this.checkMailDetailUserAvtar = function(){
    return element(by.xpath('//div[@class="email-detail-header-row layout-xs-column layout-row"]//div[2]'));
  };

  this.getMailDetailToFieldUserAvtarCount = function(){
    return element.all(by.css('[ng-repeat="to in vm.emailDetailList.messages[0].mailTos"]')).count();
  };

  this.getMailDetailFromToCCDropDownImage = function(){
    return element(by.xpath('//i[contains(text(),"arrow_drop_down")]'));
  };

  this.checkMailDetailFromToCCToolTipMenu = function(){
    return element(by.xpath('//table[@class="mail-info-inner-detail"]'));
  };

  this.checkMailDetailFromToCCToolTipMenuOption = function(optionName){
    return element(by.xpath('//td[contains(text(),"'+optionName+'")]'));
  };

  this.checkMailDetailAttachments = function(){
    return element(by.css('[ng-show="message.attachmentList.length > 0"]'));
  };

  this.checkMailDetailTags = function(tagName){
    return element(by.xpath('//div[@class="collapse-div layout-padding ng-isolate-scope layout-xs-column layout-row"]//span[contains(text(),"'+tagName+'")]'));
  };

  this.checkMailDetailEmailBody = function(){
    return element(by.xpath('//div[@ng-bind-html="message.content"]'));
  };

  this.getMailDetailReplyButton = function(){
    return element(by.xpath('//button[@aria-label="reply"]'));
  };

  this.getMailDetailReplyAllButton = function(){
    //need to be fixed. Following element should return Reply All button from mail detail panel.
    return element(by.xpath('PathToMailDetailReplyAllButton'));
  };

  this.getMailDetailForwardButton = function(){
    //need to be fixed. Following element should return Forward button from mail detail panel.
    return element(by.xpath('PathToMailDetailForwardButton'));
  };

};
module.exports = new mailDetailPanelPage();
