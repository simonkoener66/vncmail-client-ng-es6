var calendarListPanelPage = function(){

  this.getCalendarListHeaderDeleteButton = function(){
      //need to be fixed. Following element should return calendar list header delete button.
      return element(by.xpath('//PathToCalendarListHeaderDeleteButton'));
  };

  this.getCalendarListHeaderMoveButton = function(){
      //need to be fixed. Following element should return calendar list header move button.
      return element(by.xpath('//PathToCalendarListHeaderMoveButton'));
  };

  this.getCalendarListHeaderTagButton = function(){
    //need to be fixed. Following element should return calendar list header tag button.
    return element(by.xpath('//PathToCalendarListHeaderTagButton'));
  };

  this.getCalendarListHeaderPrintButton = function(){
    //need to be fixed. Following element should return calendar list header print button.
    return element(by.xpath('//PathToCalendarListHeaderPrintButton'));
  };

  this.getCalendarListHeaderTodayButton = function(){
    //need to be fixed. Following element should return calendar list header today button.
    return element(by.xpath('//PathToCalendarListHeaderTodayButton'));
  };

  this.getCalendarListHeaderPreviousDayButton = function(){
    //need to be fixed. Following element should return calendar list header previous day navigation button.
    return element(by.xpath('//PathToCalendarListHeaderPreviousDayButton'));
  };

  this.getCalendarListHeaderNextDayButton = function(){
    //need to be fixed. Following element should return calendar list header next day navigation button.
    return element(by.xpath('//PathToCalendarListHeaderNextDayButton'));
  };

  this.getCalendarListHeaderToolBarTitle = function(){
    //need to be fixed. Following element should return calendar list header tool bar title.
    return element(by.xpath('//PathToCalendarListHeaderToolBarTitle'));
  };

  this.getCalendarListHeaderToolBarTitleText = function(){
    //need to be fixed. Following element should return calendar list header tool bar title text.
    return element(by.xpath('//PathToCalendarListHeaderToolBarTitleText')).getText().then(function(value){
      return value;
    });
  };

  this.getCalendarListHeaderDayView = function(){
    //need to be fixed. Following element should return calendar application Day view.
    return element(by.xpath('//PathTogetCalendarListHeaderDayView'));
  };

  this.getCalendarListHeaderWorkWeekView = function(){
    //need to be fixed. Following element should return calendar application Work Week view.
    return element(by.xpath('//PathTogetCalendarListHeaderWorkWeekView'));
  };

  this.getCalendarListHeaderWeekView = function(){
    //need to be fixed. Following element should return calendar application Week view.
    return element(by.xpath('//PathTogetCalendarListHeaderWeekView'));
  };

  this.getCalendarListHeaderMonthView = function(){
    //need to be fixed. Following element should return calendar application Month view.
    return element(by.xpath('//PathTogetCalendarListHeaderMonthView'));
  };

  this.getCalendarListHeaderListView = function(){
    //need to be fixed. Following element should return calendar application List view.
    return element(by.xpath('//PathTogetCalendarListHeaderListView'));
  };

  this.getCalendarAllDayDivision = function(){
    //need to be fixed. Following element should return calendar list All day division.
    return element(by.xpath('//PathToCalendarAllDayDivision'));
  };

  this.checkQuickAddAppointmentDialogOpen = function(){
    //need to be fixed. Following element should return quick add appointment dialog.
    return element(by.xpath('//PathToQuickAddAppointmentDialog'));
  };

  this.getQuickAddAppointmentDialogReminderFieldDropDown = function(){
    //need to be fixed. Following element should return quick add appointment dialog reminder field drop down.
    return element(by.xpath('//PathToQuickAddAppointmentDialogReminderFieldDropDown'));
  };

  this.getQuickAddAppointmentDialogReminderFieldOption = function(reminderValue){
    //need to be fixed. Following element should return quick add appointment dialog reminder field values.
    return element(by.xpath('//span[contains(text(),"'+reminderValue+'")]'));
  };

  this.getQuickAddAppointmentDialogMoreDetailsButton = function(){
    //need to be fixed. Following element should return quick add appointment dialog more details button.
    return element(by.xpath('//button[contains(text(),"More Details...")]'));
  };

  this.getQuickAddAppointmentDialogOKButton = function(){
    //need to be fixed. Following element should return quick add appointment dialog ok button.
    return element(by.xpath('//button[contains(text(),"OK")]'));
  };

  this.getQuickAddAppointmentDialogCancelButton = function(){
    //need to be fixed. Following element should return quick add appointment dialog cancel button.
    return element(by.xpath('//button[contains(text(),"Cancel")]'));
  };
  
  this.getCalendarListRightClickContextMenu = function(){
    //need to be fixed. Following shouold return calendar list right click contect menu.
    return element(by.xpath('//PathToCalendarListRightClickContextMenu'));
  };

  this.getCalendarListRightClickContextMenuOption = function(optionName){
    //need to be fixed. Following should return calendar list right click menu options.
    return element(by.xpath('//span[contains(text(),"'+optionName+'")]'));
  };

  this.getQuickAddAppointmentDialogSubjectField = function(){
    //need to be fixed. Following element should return quick add appointment dialog subject field.
    return element(by.xpath('//PathToQuickAddAppointmentDialogSubjectField'));
  };

  this.getQuickAddAppointmentDialogStartDateDropDown = function(){
    //need to be fixed. Following element should return quick add appointment dialog start date drop down.
    return element(by.xpath('//PathToQuickAddAppointmentDialogStartDateDropDown'));
  };

  this.getQuickAddAppointmentDialogStartTimeDropDown = function(){
    //need to be fixed. Following element should return quick add appointment dialog start time drop down.
    return element(by.xpath('//PathToQuickAddAppointmentDialogStartTimeDropDown'));
  };

  this.getQuickAddAppointmentDialogEndDateDropDown = function(){
    //need to be fixed. Following element should return quick add appointment dialog end date drop down.
    return element(by.xpath('//PathToQuickAddAppointmentDialogEndDateDropDown'));
  };

  this.getQuickAddAppointmentDialogEndTimeDropDown = function(){
    //need to be fixed. Following element should return quick add appointment dialog end time drop down.
    return element(by.xpath('//PathToQuickAddAppointmentDialogEndTimeDropDown'));
  };

  this.getQuickAddAppointmentDialogCalendarFolderDropDown = function(){
    //need to be fixed. Following element should return quick add appointment dialog calendar folder drop down.
    return element(by.xpath('//PathToQuickAddAppointmentDialogCalendarFolderDropDown'));
  };

  this.getCalendarListAppointment = function(appointmentName){
    //need to be fixed. Following element should return calendar list appointment.
    return element(by.xpath('//span[contains(text(),"'+appointmentName+'")]'));
  };


};
module.exports = new calendarListPanelPage();
