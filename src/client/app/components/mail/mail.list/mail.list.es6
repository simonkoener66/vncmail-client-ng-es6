import angular from 'angular';
import mailListComponent from './mail.list.component';
import mailDetailComponent from './mail.detail/mail.detail';
import MailComposeController from '../mail.compose/mail.compose.controller';
import CreateFolderController from '../../../common/sidebar/sidebar.folders/create.new.folder/create.new.folder.controller';
import MoveConversationController from '../../../common/sidebar/sidebar.folders/move.user.folder/move.user.folder.controller.es6';
import MailFullScreenController from '../mail.fullscreen/mail.fullscreen.controller';
import MailRedirectController from '../mail.redirect/mail.redirect.controller';
import MailDeleteController from '../mail.delete/mail.delete.controller';
import '../mail.compose/_mail.compose.scss';
import '../mail.delete/_mail.delete.scss';
import './_mail.list.scss';

let mailListModule = angular.module('mail.list', [
  mailDetailComponent.name
])

.controller('MailComposeController', MailComposeController)
.controller('CreateFolderController', CreateFolderController)
.controller('MoveConversationController', MoveConversationController)
.controller('MailDeleteController', MailDeleteController)
.controller('MailFullScreenController', MailFullScreenController)
.controller('MailRedirectController', MailRedirectController)
.directive('vncMailList', mailListComponent);

export default mailListModule;
