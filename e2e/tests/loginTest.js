var homePage = require("../page/homePage.js");
var loginPage = require("../page/loginPage.js");
var commonFunctions = require("../commonFunctions/commonFunctions.js");

describe('Protractor Suite to test Login Page', function() {
  afterEach(function() {
    browser.waitForAngular();
  });

  it('Goto Login Page', function() {
      homePage.get();
  });

  it('Keeping both username and password field empty', function(){
    loginPage.setUserName("");
    loginPage.setPassword("");
    expect(loginPage.getLoginButton().isEnabled()).toBe(false);
  });

  it('Keeping username field empty', function(){
    loginPage.setUserName("");
    loginPage.setPassword("test");
    expect(loginPage.getLoginButton().isEnabled()).toBe(false);
  });

  it('Keeping password field empty', function(){
    loginPage.setUserName("test");
    loginPage.setPassword("");
    expect(loginPage.getLoginButton().isEnabled()).toBe(false);
  });
  it('Enter user name containing Invalid format .i.e test.com', function(){
    loginPage.setUserName("test.com");
    loginPage.setPassword("test");
    expect(loginPage.getLoginButton().isEnabled()).toBe(false);
  });

// Technically this test is not correct. For a couple reasons.
// 1. A user can login with just a user name.
// 2. Normally when checking a system that uses emails the regex is to restrictive if you check for anything more than
//    an @ symbol.
// In conclusion I belive this test can be removed.
// Also, if this test were applicable we would want the button to be disabled, instead of even getting to the toast msg
// See Comments inline below.
//  it('Enter user name containing Invalid format .i.e test@test', function(){
//    loginPage.setUserName("test@test");
//    loginPage.setPassword("test");
    // This is not correct. Technically the form should've been invlaid.
    // loginPage.getLoginButton().click();
    // expect(loginPage.getToastMessage()).toEqual('The username must be a valid email address');
    // More correct test
    // expect(loginPage.getLoginButton().isEnabled()).toBe(false);
//  });

// This test is appriopriate as it tests to see if there actually has been an improper email address.
// I have modified it slightly to show that the form should not be submitted.
  it('Enter user name containing Invalid format .i.e test.com', function(){
    loginPage.setUserName("test.com");
    loginPage.setPassword("test");
    // This is not correct. Technically the form should've been invlaid.
    // loginPage.getLoginButton().click();
    // expect(loginPage.getToastMessage()).toEqual('The username must be a valid email address');
    // More correct test would be to check if the email is not a valid format the button should remain disabled
    expect(loginPage.getLoginButton().isEnabled()).toBe(false);
  });

  // Testing toast messages is not easy with protractor. I suggest this type of test be moved to unit testing to test the variable and not the Toast.
  // I wouldn't know a good way to test this especailly considering the .toast-container can hold multiple toasts.
  // I have changed this to test the contents of an error message div.
  it('Enter Incorrect username and password', function(){
    loginPage.setUserName("bhavin@vnc.biz");
    loginPage.setPassword("test");
    loginPage.getLoginButton().click();
    expect(loginPage.getErrorMessage()).toEqual('The username or password is incorrect. Verify that CAPS LOCK is not on, and then retype the current username and password');
  });

  it('Enter correct username and password', function(){
    loginPage.setUserName(browser.params.inputData.username);
    loginPage.setPassword(browser.params.inputData.password);
    loginPage.getLoginButton().click();
    expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/mail/inbox');
  });
});
