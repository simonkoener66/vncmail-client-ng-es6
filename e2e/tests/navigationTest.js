var homePage = require("../page/homePage.js");
var loginPage = require("../page/loginPage.js");
var commonFunctions = require("../commonFunctions/commonFunctions.js");
var navigationPage = require ("../page/navigationPage.js");
var mailLeftPanelPage = require("../page/mailLeftPanelPage.js");
var mailDetailPanelPage = require("../page/mailDetailPanelPage.js");

describe('Protractor test for Navigation page', function(){
  afterEach(function(){
      browser.waitForAngular();
  });

  it('Login to Uxf', function(){
    commonFunctions.logIn();
  });

  it('Check for Navigation Menu',function(){
    navigationPage.activateNavigationMenu();
    expect(navigationPage.getMailNavigationMenu().isPresent()).toBe(true);
    expect(navigationPage.getContactsNavigationMenu().isPresent()).toBe(true);
    expect(navigationPage.getTasksNavigationMenu().isPresent()).toBe(true);
    expect(navigationPage.getCalenderNavigationMenu().isPresent()).toBe(true);
    navigationPage.activateNavigationMenu();
  });

  it('Check for Mail option selected in Navigation Menu', function(){
    commonFunctions.navigationToMailPage();
  });

  it('Check for Contacts option selected in Navigation Menu', function(){
    commonFunctions.navigationToContactsPage();
  });

  it('Check for Calendar option selected in Navigation Menu', function(){
    commonFunctions.navigationToCalendarPage();
  });

  it('Check for Tasks option selected in Navigation Menu', function(){
    commonFunctions.navigationToTasksPage();
  });

  it('Check for Preferences option selected in Navigation Menu', function(){
    commonFunctions.navigationToPreferencesPage();
  });

  it('Check for inactive screen', function(){
      navigationPage.activateNavigationMenu();
      navigationPage.getMailNavigationMenu().click();
      mailLeftPanelPage.getDeleteEmailButton().click().then(function() {
        throw "Delete email button is clickable. ";
      });
      mailLeftPanelPage.getRefreshEmailButton().click().then(function() {
        throw "Refresh email button is clickable. ";
      });
  });
});
