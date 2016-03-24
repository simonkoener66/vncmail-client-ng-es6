var calendarLeftPanelPage = function(){

  this.getCalendarLeftPanelFolderList = function(){
    //need to be fixed. Following element should return calendar left panel folder list.
    return element(by.path('//PathToCalendarLeftPanelFolderList'));
  };

  this.getCalendarFolder = function(){
    //need to be fixed. Following element should return calendar folder.
    return element(by.xpath('//PathToCalendarFolder'));
  };

  this.getCalendarLeftPanelFolderCheckbox = function(folderName){
    //need to be fixed. Following element should return calendar left panel folder check box.
    return element(by.xpath('//PathToCalendarLeftPanelFolderCheckbox'));
  };
  
  this.checkAppointmentEditDialogOpen = function(){
    //need to be fixed. Following element should return calendar appointment edit dialog.
    return element(by.xpath('//PathToAppointmentEditDialog'));
  };

  this.getAppointmentDialogSubjectField = function(){
    //need to be fixed. Following element should return appointment dialog subject field.
    return element(by.xpath('//PathToAppointmentDialogSubjectFieldValue'));
  };

  this.getAppointmentDialogCloseButton = function(){
    //need to be fixed. Following element should return appointment dialog close button.
    return element(by.xpath('//span[contains(text(),"Close")]'));
  };


};
module.exports = new calendarLeftPanelPage();
