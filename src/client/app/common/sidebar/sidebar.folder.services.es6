import createTemplate from './sidebar.folders/create.new.folder/create.new.folder.html';
import shareTemplate from './sidebar.folders/share.folder.modal/share.folder.modal.html';
import criticalErrorTemplate from './sidebar.folders/criticalErrorTemplate.html';
import moveFolderTemplate from './sidebar.folders/move.user.folder/move.user.folder.html';

let sidebarFoldersService = function( $uibModal, mailService, $rootScope, vncConstant, $mdDialog, $mdToast, $document ){

  this._openCreateNewFolderModal = ( data ) => {
    $mdDialog.show({
      controller: 'CreateNewFolderController',
      controllerAs: 'vm',
      bindToController: true,
      template: createTemplate,
      escapeToClose: false,
      fullscreen: true,
      resolve: {
        data: () => {
          return data || {};
        }
      }
    });
  };

  this._openShareFolderModal = ( data ) => {
    $mdDialog.show({
      animation: true,
      template: shareTemplate,
      controller: 'ShareFolderController',
      controllerAs: 'vm',
      bindToController: true,
      backdrop: 'static',
      keyboard: true,
      resolve:{
        data: function(){
          return data
        }
      },
      backdropClick: 'true',
      size: 'md modal-2'
    });
  };

  //open same model for any error in request
  this._openCriticalErrorModel = ( message,  cb ) => {
    let vm = this;
    $mdToast.show({
      controller: function($mdToast, message){
        this.message = message;
        this.ok = () => {
          $mdToast.hide();
        };
      },
      controllerAs: 'vm',
      bindToController: true,
      template: criticalErrorTemplate,
      parent : $document[0].querySelector('#toastBounds'),
      hideDelay: 0,
      position: "left right bottom",
      resolve:{
        message: function(){
          return message
        }
      }
    }).then(function() {
      cb && cb();
    });
  };

  //open same model for any error in request
  this._openMoveFolderModel = ( data ) => {
    $mdDialog.show({
      controller: 'moveFolderController',
      controllerAs: 'vm',
      bindToController: true,
      template: moveFolderTemplate,
      escapeToClose: false,
      fullscreen: true,
      resolve:{
        data: function(){
          return data || {}
        }
      }
    });
  };

  this.folders = [];

  this._getMailFolders = ( cb ) => {

    let vm = this;
    vm.folders = [];
    mailService.getFolderList({
      view: 'message'
    }, (res) =>{
      vm.folders = [];
      let mailFolderSortID = [3,4,6,5,2];

      let excludeFolders = ['inbox', 'tasks', 'calendar', 'contacts'];
      res.folder = res.folder.filter(function(x){
        if(!excludeFolders.includes(angular.lowercase(x.$.name)) || angular.lowercase(x.$.name) == 'inbox') return x;
      });

      for(let  i = 0; i < res.folder.length; i++){
        if(vncConstant.FOLDERID[res.folder[i].$.name.toUpperCase()]){
          res.folder[i].$.icon = vncConstant.ICON[res.folder[i].$.name.toLowerCase()];
        }
      }

      for(let i = 0; i < mailFolderSortID.length; i++){
        sortMailByID(mailFolderSortID[i])
      }

      function sortMailByID(number){
        let folders = res.folder;
        for(let i = 0; i < folders.length; i++){
          if(folders[i].$.id == number) {
            vm.folders.unshift(folders[i]);
            folders.splice(i, 1);
            break;
          }
        }
      }
      vm.folders = vm.folders.concat(res.folder);
      angular.forEach(vm.folders, function(folder){
        folder.collapse = true;
      });
      $rootScope.$broadcast('updateFolder');
      cb(vm.folders)
    });
  };

  this._getContactFolders = ( cb ) => {

    let vm = this;
    vm.folders = [];
    mailService.getFolderList({
      view: 'contact'
    }, (res) =>{
      let excludeFolders = ['inbox', 'tasks', 'calendar', 'contacts'];
      res.folder = res.folder.filter(function(x){
          if(!excludeFolders.includes(angular.lowercase(x.$.name)) || angular.lowercase(x.$.name) == 'contacts') return x;
      });
      for(let i = 0; i < res.folder.length; i++){
        if(vncConstant.FOLDERID[res.folder[i].$.name.replace(/ /g,"_").toUpperCase()]){
          res.folder[i].$.icon = vncConstant.ICON[res.folder[i].$.name.replace(/ /g,"_").toLowerCase()];
        }
        res.folder[i].collapse = true;
      }
      vm.folders = res.folder;
      $rootScope.$broadcast('updateFolder');
      cb(vm.folders)
    });
  };

  this._getTaskFolders = ( cb ) => {

    let vm = this;
    vm.folders = [];
    mailService.getFolderList({
      view: 'task'
    }, (res) =>{
      let excludeFolders = ['inbox', 'tasks', 'calendar', 'contacts'];
      res.folder = res.folder.filter(function(x){
        if(!excludeFolders.includes(angular.lowercase(x.$.name)) || angular.lowercase(x.$.name) == 'tasks') return x;
      });
      for(let i = 0; i < res.folder.length; i++){
        if(vncConstant.FOLDERID[res.folder[i].$.name.replace(/ /g,"_").toUpperCase()]){
          res.folder[i].$.icon = vncConstant.ICON[res.folder[i].$.name.replace(/ /g,"_").toLowerCase()];
        }
        res.folder[i].collapse = true;
      }
      vm.folders = res.folder;
      $rootScope.$broadcast('updateFolder');
      cb(vm.folders)
    });
  };

  this._getPreferenceFolders = ( cb ) => {

    let vm = this;
    vm.folders = [];
    mailService.getFolderList({
      view: 'preference'
    }, (res) =>{
      let excludeFolders = ['inbox', 'preferences', 'tasks', 'calendar', 'contacts'];
      res.folder = res.folder.filter(function(x){
        if(!excludeFolders.includes(angular.lowercase(x.$.name)) || angular.lowercase(x.$.name) == 'preferences') return x;
      });
      for(let i = 0; i < res.folder.length; i++){
        if(vncConstant.FOLDERID[res.folder[i].$.name.replace(/ /g,"_").toUpperCase()]){
          res.folder[i].$.icon = vncConstant.ICON[res.folder[i].$.name.replace(/ /g,"_").toLowerCase()];
        }
        res.folder[i].collapse = true;
      }
      vm.folders = res.folder;
      $rootScope.$broadcast('updateFolder');
      cb(vm.folders)
    });
  };


};

sidebarFoldersService.$inject = ['$uibModal', 'mailService', '$rootScope', 'vncConstant', '$mdDialog', '$mdToast', '$document'];
/*@ngInject*/

export default sidebarFoldersService;
