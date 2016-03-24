import angular from 'angular';
import coreModule from './core.module';
import createNewFolderTemplate from '../sidebar/sidebar.folders/create.new.folder/create.new.folder.html';
import createNewTagTemplate from '../tag/create.new.tag/create.new.tag.html';
import userHelpTemplate from '../headerModels/userhelp/userHelp.html';
import userHelpController from '../headerModels/userhelp/userHelp.controller';
import userAboutTemplate from '../headerModels/userAbout/userAbout.html';
import userAboutController from '../headerModels/userAbout/userAbout.controller';
import userShortcutsTemplate from '../headerModels/userShortcuts/userShortcuts.html';
import userShortcutsController from '../headerModels/userShortcuts/userShortcuts.controller';

// Modal templates for side-bar drop-down
import createNewMessageTemplate from '../../components/mail/mail.compose/mail.compose.html';
import createNewContactTemplate from '../../components/contacts/contact.compose/contact.compose.html';
import createNewTaskTemplate from '../../components/tasks/task.compose/task.compose.html';
//import createNewContactGroupTemplate from ''; // TODO: implement later
//import createNewDocumentTemplate from ''; // TODO: implement later

//import createNewTaskFolderTemplate from ''; // TODO: implement later
//import createNewContactsFolderTemplate from ''; // TODO: implement later

let coreDataService = angular.module('core.app')

.factory('dataService', dataService);

dataService.$inject = ['$q', '$state'];
/* @ngInject */
function dataService( $q, $state ) {

    return {
        getPeople: getPeople,
        getModalCtrl: getModalCtrl,
        getMessageCount: getMessageCount,
        getUserModalCtrl: getUserModalCtrl
    };

    function getMessageCount() { return $q.when(72); }

    function getPeople() {
        return null;
    }

    function getModalCtrl() {
        let ctrl = '';
        let template = '';
        if ( $state.includes('mail.*') ) {
            ctrl = 'MailComposeController';
            template = createNewMessageTemplate;
        }
        else if ( $state.includes('contacts.**') ) {
            ctrl = 'ContactComposeController';
            template = createNewContactTemplate;
        }
        else if ( $state.includes('tasks.**') ) {
            ctrl = 'TaskComposeController';
            template = createNewTaskTemplate;
        }
        return {ctrl: ctrl, template: template};
    }

    function getUserModalCtrl(modelType) {
      let ctrl = '';
      let template = '';

      if ( modelType == 'userHelp' ) {
        ctrl = userHelpController;
        template = userHelpTemplate;
      }
      else if ( modelType == 'userAbout' ) {
        ctrl = userAboutController;
        template = userAboutTemplate;
      }
      else if ( modelType == 'userShortcuts' ) {
        ctrl = userShortcutsController;
        template = userShortcutsTemplate;
      }
      return {ctrl: ctrl, template: template};
    }
}


export default coreDataService;
