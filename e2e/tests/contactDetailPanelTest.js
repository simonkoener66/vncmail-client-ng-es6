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

});
