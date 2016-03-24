import angular from 'angular';
import mailFilterByDateService from '../mail.service/mail.filterbydate.service';
import mailHandleService from './mailhandle.service';
import sidebarServiceModule from '../../../common/services/sidebar.service/sidebar.service';

let mailServiceModule = angular.module('mail.service', [
  sidebarServiceModule.name
])

.service('mailFilterByDateService', mailFilterByDateService)

.service('mailHandleService', mailHandleService)

.filter('getRemainingTags', function() {
  return function (tags, mailtags) {
    if(tags && mailtags){
      mailtags = mailtags.map(function(x){
        return x.$.id;
      });
      let results = [];
      for(let i = 0; i < tags.length; i++){
        mailtags.includes(tags[i].$.id) || results.push(tags[i]);
      }
     return results;
    }
    else return tags;
  };
})

.filter('userMail', function() {
  return function (input) {
    if(input){
      let email = input;
      let indexOfChar = email.indexOf('@');
      email = email.substring(0, indexOfChar != -1 ? indexOfChar : email.length);
      email = email.replace(/\./g, ' ');
      return email;
    }
    else return input;
  };
});


export default mailServiceModule;
