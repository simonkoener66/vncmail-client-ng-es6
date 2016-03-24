var contactDetailPanelPage = function(){

  this.getTotalNoOfContacts = function(){
    return element(by.xpath('//span[@class="ng-binding"]')).getText().then(function(value){
      return parseInt(value);
    });
  };

  this.getContactDetailPanelTag = function(){
    return element(by.xpath('//p[@class="tag-info"]//span[@ng-bind="vm.name"]'));
  };
  
  this.getContactDetailContactName = function(){
    return element(by.xpath('//h4[@class="contactNamePosition"]')).getText().then(function(value){
      return value;
    });
  };
   
};
module.exports = new contactDetailPanelPage();
