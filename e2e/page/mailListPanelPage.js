var mailListPanelPage = function(){

  this.getFirstMail = function(){
    return element(by.css('[ng-click="vm.getEmailDetail(mail, d, $index)"]'));

  };

  this.getDeleteButton = function(){
    return element.all(by.css('[ng-click="vm.deleteEmail()"]'));
  };


  this.getDeleteNotificationMessage = function(){
    //need to be fixed following element should return delete notification message
    var deletemessage = element(by.css('[ui-sref="delete.message"]')).getText();
    return deletemessage;
  };

  this.getMailListFirstmailSubject = function(){
    return element(by.xpath('//div[@ng-click="vm.getEmailDetail(mail, d, $index, $event)"]//div[2]/div[2]//h4')).getText().then(function(value){
      return value;
    });
  };

  this.getMailListUserAvtar = function(){
    return element(by.xpath('//div[@ng-click="vm.getEmailDetail(mail, d, $index, $event)"]//div[@ng-bind="vm.shortName"]'));
  };

  this.getMailListSenderName = function(){
    return element(by.xpath('//span[@ng-repeat="mailFrom in mail.sender track by $index"]/span'));
  };

  this.getMailListMailSubject = function(){
    return element(by.xpath('//div[@ng-repeat="mail in emails"]/div[2]/div[2]//h4'));
  };

  this.getMailListMailBodyText = function(){
    return element(by.xpath('//div[@ng-repeat="mail in emails"]//div[2]/../p'));
  };

  this.getMailListStarButton = function(){
    return element(by.xpath('//div[@ng-repeat="mail in emails"]//div[2]//span[@ng-click="vm.markConversationFlagAndUnFlag($event, mail)"]'));
  };

  this.getMailDetailMailSubject = function(){
    return element(by.xpath('//div[@id="mail-detail"]//h3'));
  };

  this.getMailListConversationImage = function(){
    return element(by.css('[ng-click="vm.setCollapseOfMailConversation(mail.isCollapse, d, $index, $event)"]'));
  };

  this.checkOpenOfMailListConversations = function(){
    return element(by.css('[ng-show="mail.isCollapse"]'));
  };

  this.getMailListConversations = function(){
    return element(by.xpath('//div[@ng-show="mail.isCollapse"]/div[1]'));
  };

  this.checkMailListTags = function(){
    return element(by.css('[ng-show="mail.tags.length"]'));
  };

  this.chechMailListFirstTag = function(){
    return element(by.xpath('//div[@ng-show="mail.tags.length"]//span[@ng-bind="vm.name"]')).getText().then(function(value){
      return value;
    });
  };

  this.checkForMoreTags = function(){
    return element(by.xpath('//div[@ng-show="mail.tags.length"]/vnc-tag[2]/span')).getText().then(function(value){
      return value;
    });
  };

  this.checkMailListAttachmentImage = function(){
    //return element(by.xpath('//div[@ng-repeat="mail in emails"]//div[2]//div[@tooltip-placement="bottom"]//i'));
    return element(by.xpath('//span[@class="ng-binding"]/md-icon'));
  };

  this.getMailDetailMailAttachments = function(){
    //Need to be fix. Following element should return mail detail attachments.
    return element(by.xpath('//PathToMailDetailAttachments'));
  };

  this.checkMailListMailCurrentTime = function(){
    return element(by.xpath('//div[@ng-repeat="mail in emails"]//div[2]//div[@tooltip-placement="bottom"]'));
  };

  this.getMailListSubjectShortenDots = function(){
    return element(by.xpath('//span[@ng-if="mail.subject.length > 32"]'));
  };

  this.getMailListSubjectCharacterCount = function(){
    return element(by.xpath('//span[@ng-if="mail.subject.length > 32"]/..')).getText().then(function(value){
      var length = (value.length)-4;
      return length;
    });
  };

  this.getMailListBodyShortenDots = function(){
    return element(by.xpath('//div[@ng-repeat="mail in emails"]//div[2]//span[@ng-if="mail.content.length > 60"]'));
  };

  this.getMailListBodyCharacterCount = function(){
    return element(by.xpath('//div[@ng-repeat="mail in emails"]//div[2]//span[@ng-if="mail.content.length > 60"]/..')).getText().then(function(value){
      var length = (value.length)-4;
      return length;
    });
  };

  this.getMailListMailSubjectText = function(){
    subject = element(by.xpath('//div[@ng-repeat="mail in emails"]/div[2]/div[2]//h4')).getText().then(function(value){
      return value;
    });
    return subject.then(function(value){
      return value;
    });
  };

  this.getMailFromMailList = function(subjectName){
    var scrollToScript = 'document.getElementsByClassName("list-item pointer ng-scope ng-isolate-scope layout-row active").scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function(){
     element(by.xpath('//h4[contains(text(),"'+subjectName+'")]')).click();
    });
  };

  this.getMailListTotalMessagesNumber = function(subjectName){
    return element(by.xpath('//h4[contains(text(),"'+subjectName+'")]//..//..//..//span[@ng-bind="mail.totalMessages"]')).getText().then(function(value){
      return parseInt(value);
    });
  };

  this.getMailListHeaderDeleteButton = function(){
    //Need to be fixed. Following element should return mail list panel header delete button
    return element(by.css('[ng-click="vm.moveToTrash()"]'));
  };

};

module.exports = new mailListPanelPage();
