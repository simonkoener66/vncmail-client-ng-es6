var navigationPage = function(){
  this.activateNavigationMenu = function(){
    //element(by.xpath('//div[@class="navbar-header"]//a[@ng-click="vm.sideMenuToggle()"]')).click();
    //browser.actions().mouseMove(element(by.xpath('//div[@class="navbar-header"]//a[@ng-mouseover="vm.sideMenuToggle()"]'))).perform();
    element(by.xpath('//section[@ng-click="vm.sideMenuToggle()"]/div[2]//button/md-icon[contains(text(),"menu")]')).click();
  };

  this.getMailNavigationMenu = function(){
      return element(by.xpath('//a[@ui-sref="mail"]'));
  };

  this.getContactsNavigationMenu = function(){
      return element(by.xpath('//a[@ui-sref="contacts"]'));
  };

  this.getTasksNavigationMenu = function(){
      return element(by.xpath('//a[@ui-sref="tasks"]'));
  };

  this.getCalenderNavigationMenu = function(){
      return element(by.xpath('//a[@ui-sref="calendar"]'));
  };

  this.getPreferencesNavigationMenu = function(){
      return element(by.xpath('//a[@ui-sref="preferences"]'));
  };

  this.getNavbarTitle = function(){
      return element(by.xpath('//span[@class="brand-title"]/span')).getText().then(function(value){
      return value;
    });
  };

};
module.exports = new navigationPage();
