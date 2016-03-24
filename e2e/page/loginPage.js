var loginPage = function(){
  var userNameField = element(by.model('vm.user.username'));
  var passwordField = element(by.model('vm.user.password'));
  var loginButton = element(by.css('[ng-click="vm.login()"]'));

  this.setUserName = function(value){
    userNameField.clear();
    userNameField.sendKeys(value);
  };

  this.setPassword = function(value){
    passwordField.clear();
    passwordField.sendKeys(value);
  };

  this.getLoginButton = function(){
    return loginButton;
  };

  this.getErrorMessage = function(){
    return element(by.css('.error-message')).getText();
  };
  
};
module.exports = new loginPage();
