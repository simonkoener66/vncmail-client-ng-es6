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
var reminderNever='Never', reminder1minuteBefore='1 minute before', reminder5minutesBefore='5 minutes before';
var reminder2hoursBefore='2 hours before', reminder1dayBefore='1 day before', reminder1WeekBefore='1 week before';


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

  it('It should check “Reminder field” in Quick Add Appointment dialog',function(){
    commonFunctions.navigationToCalendarPage();
    expect(calendarListPanelPage.getCalendarListHeaderDayView().isEnabled()).toBe(true);
    calendarListPanelPage.getCalendarListHeaderDayView().click();
    expect(calendarListPanelPage.getCalendarListHeaderTodayButton().isEnabled()).toBe(true);
    calendarListPanelPage.getCalendarListHeaderTodayButton().click();
    calendarListPanelPage.getCalendarAllDayDivision().click();
    expect(calendarListPanelPage.checkQuickAddAppointmentDialogOpen().isPresent()).toBe(true);
    calendarListPanelPage.getQuickAddAppointmentDialogReminderFieldDropDown().click();
    //As reminder field contains more values, only check following some of the reminder values.
    expect(calendarListPanelPage.getQuickAddAppointmentDialogReminderFieldOption(reminderNever).isPresent()).toBe(true);
    expect(calendarListPanelPage.getQuickAddAppointmentDialogReminderFieldOption(reminder1minuteBefore).isPresent()).toBe(true);
    expect(calendarListPanelPage.getQuickAddAppointmentDialogReminderFieldOption(reminder5minutesBefore).isPresent()).toBe(true);
    expect(calendarListPanelPage.getQuickAddAppointmentDialogReminderFieldOption(reminder2hoursBefore).isPresent()).toBe(true);
    expect(calendarListPanelPage.getQuickAddAppointmentDialogReminderFieldOption(reminder1dayBefore).isPresent()).toBe(true);
    expect(calendarListPanelPage.getQuickAddAppointmentDialogReminderFieldOption(reminder1WeekBefore).isPresent()).toBe(true);
    calendarListPanelPage.getQuickAddAppointmentDialogCancelButton().click();
  });


});
