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
var calendarLeftPanelPage = require("../page/calendarLeftPanelPage.js");
var calendarListPanelPage = require("../page/calendarListPanelPage.js");
var rightClickNewAppointment='New Appointment', rightClickNewAllDayAppointment='New All Day Appointment', rightClickGoToToday='Go to Today', rightClickView='View';
var appointmentSubject='New Test Appointment';

describe('Protractor Suit to test Calendar Page', function() {
  afterEach(function() {
    browser.waitForAngular();
  });

  it('Login to Uxf', function() {
      commonFunctions.logIn();
  });

  it('Check for Calendar option selected in Navigation Menu', function(){
    commonFunctions.navigationToCalendarPage();
  });

  it('It should open selected appointment in edit view with values prefilled in the respective field.',function(){
    commonFunctions.navigationToCalendarPage();
    expect(calendarListPanelPage.getCalendarListHeaderTodayButton().isEnabled()).toBe(true);
    calendarListPanelPage.getCalendarListHeaderTodayButton().click();
    browser.actions().mouseMove(calendarListPanelPage.getCalendarAllDayDivision()).perform();
    browser.actions().click(protractor.Button.RIGHT).perform();
    expect(calendarListPanelPage.getCalendarListRightClickContextMenu().isPresent()).toBe(true);
    expect(calendarListPanelPage.getCalendarListRightClickContextMenuOption(rightClickNewAppointment).isPresent()).toBe(true);
    browser.driver.wait(protractor.until.elementIsVisible(calendarListPanelPage.getCalendarListRightClickContextMenuOption(rightClickNewAppointment)));
    calendarListPanelPage.getCalendarListRightClickContextMenuOption(rightClickNewAppointment).click();
    expect(calendarListPanelPage.checkQuickAddAppointmentDialogOpen().isPresent()).toBe(true);
    calendarListPanelPage.getQuickAddAppointmentDialogSubjectField().sendKeys(appointmentSubject);
    calendarListPanelPage.getQuickAddAppointmentDialogOKButton().click();
    expect(calendarListPanelPage.getCalendarListAppointment(appointmentSubject).isPresent()).toBe(true);
    browser.actions().doubleClick(calendarListPanelPage.getCalendarListAppointment(appointmentSubject)).perform();
    expect(calendarLeftPanelPage.checkAppointmentEditDialogOpen().isPresent()).toBe(true);
    expect(calendarLeftPanelPage.getAppointmentDialogSubjectField().getAttribute('value')).toEqual(appointmentSubject);
    calendarLeftPanelPage.getAppointmentDialogCloseButton().click();
  });

});
