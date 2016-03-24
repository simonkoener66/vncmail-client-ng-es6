var contactListPanelPage = function(){

  this.getContactNameFromContactListPanel = function(contactName){
    var scrollToScript = 'document.getElementsByClassName("list-item layout-row").scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function() {
      element(by.xpath('//h5[contains(text(),"'+contactName+'")]'));
    });
  };

  this.getContactListEditButton = function(){
    //need to be fix. Following should return edit button from contact list header.
    return element(by.xpath('//button[contains(text(),"Edit")]')).click();
  };

  this.getContactListFirstContact = function(){
    return element(by.css('[ng-repeat="contact in vm.contacts track by $index"]'));
  };

  this.getContactListContactName = function(contactName){
    return element(by.xpath('//h5[contains(text(),"'+contactName+'")]')).getText().then(function(value){
      return value;
    });
  };

  this.getContactListNoResultFoundMessage = function(){
    return element(by.xpath('//div[contains(text(),"No results found.")]'));
  };

  this.getContactListFilterButton = function(){
    return element(by.css('[ng-click="vm.selectFilter=true; showAdvanced($event)"]'));
  };

  this.getContactListFilterSuggestion = function(){
    return element(by.xpath('//div[@class="dialogMargin"]'));
  };

  this.getOptionFromFilterSuggestion = function(filterOption){
    return element(by.xpath('//div[@class="contactFilterMargin layout-row"]//div[contains(text(),"'+filterOption+'")]'));
  };

  this.getContactListAllContactsOption = function(){
    return element(by.xpath('//span[contains(text(),"All Contacts")]'));
  };

  this.getContactListPanelContactsTag = function(tagName){
    return element(by.xpath('//div[@class="sidebar-tag flex"]//span[contains(text(),"'+tagName+'")]'));
  };

  this.getContactListHeaderTagButton = function(){
    //need to be fixed. Following element should return contact list header tag button
    return element(by.xpath('//md-icon[contains(text(),"local_offer")]'));
  };

  this.checkContactListHeaderTagMenuOpen = function(){
    //need to be fixed. Following element should return contact list header tag menu suggestion
    return element(by.xpath('//PathToContactListHeaderTagMenuOpen'));
  };

  this.getContactListHeaderTagButtonOption = function(tagOption){
    //need to be fixed. Following element should return contact list header tag button suggestion option.
    return element(by.xpath('//span[contains(text(),"'+tagOption+'")]'));
  };

  this.checkContactListHeaderTagButtonRemoveTagMenuOpen = function(){
    //need to be fixed. Following element should return contact list header tag button remove tag menu suggestion
    return element(by.xpath('//PathToContactListHeaderTagButtonRemoveTagMenuOpen'));
  };

  this.getContactListHeaderTagButtonRemoveTagOption = function(optionName){
    //need to be fixed. Following element should return contact list header tag button suggestion remove tag suggestion options
    return element(by.xpath('//PathToContactListHeaderTagButtonRemoveTagOption'));
  };

  this.getContactListHeaderDeleteButton = function(){
    //need to be fixed. Following element should return contact list header delete button
    return element(by.xpath('//PathToContactListHeaderDeleteButton'));
  };

  this.getContactListLastContact = function(lastContactNumber){
    //return element(by.xpath('//div[@ng-click="vm.selectContact(contact.id,$event)"]['+lastContactNumber+']'));
    var scrollToScript = 'document.getElementsById("contact-list").scrollIntoView();';
    browser.driver.executeScript(scrollToScript).then(function() {
      element(by.xpath('//div[@ng-click="vm.selectContact(contact.id,$event)"]['+lastContactNumber+']')).click();
    });
  };

  this.getContactListFirstContactText = function(){
    return element(by.css('[ng-repeat="contact in vm.contacts track by $index"]')).getText().then(function(value){
      return value;
    });
  };

  this.getContactDeleteMessage = function(){
    //need to be fixed. Following element should return contact delete message
    return element(by.xpath('//ContactDeleteMessage'));
  };

  this.getSelectedContactFilterText = function(){
    //need to be fixed. Following element should return selected filter value from the contact list panel
    return element(by.xpath('//getSelectedContactFilterText')).getText();
  };

  this.getTagNameFromFirstContact = function(){
    //need to be fixed. Following element should return Tag name from the first Contact
    return element(by.xpath('//getSelectedContactFilterText')).getText()
  };

  this.getContactListMoveButton = function(){
    //need to be fix. Following should return move button from contact list header.
    return element(by.xpath('//button[contains(text(),"Move")]'));
  };

  this.getContactListPrintButton = function(){
    //need to be fix. Following should return Print button from contact list header.
    return element(by.xpath('//button[contains(text(),"Print")]'));
  };

  this.getContactListMoveButtonDropdownlist = function(){
    //need to be fix. Following should return move button's dropdown lost from contact list header.
    return element(by.xpath('//ContactListMoveButtonDropdownlist'));
  };

  this.getContactListMoveButtonDropdownlist = function(){
    //need to be fix. Following should return move button's dropdown lost from contact list header.
    return element(by.xpath('//ContactListMoveButtonDropdownlist'));
  };

  this.selectContactListMoveButtonDropdownoption = function(option){
    //need to be fix. Following should select option from the move button's dropdown
    return element(by.xpath('//ContactListMoveButtonDropdownlist'));
  };

  this.getContactListPrintButtonDropdownlist = function(){
    //need to be fix. Following should return print button's dropdown lost from contact list header.
    return element(by.xpath('//ContactListPrintButtonDropdownlist'));
  };

  this.selectContactListPrintButtonDropdownoption = function(option){
    //need to be fix. Following should select option from the print button's dropdown
    return element(by.xpath('//ContactListPrintButtonDropdownlist'));
  };


  };


module.exports = new contactListPanelPage();
