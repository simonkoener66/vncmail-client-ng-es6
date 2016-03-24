import angular from 'angular';
import uiRouter from 'angular-ui-router';
import MailList from './mail.list/mail.list';
import Inbox from './mail.inbox/mail.inbox';
import Sent from './mail.sent/mail.sent';
import Draft from './mail.draft/mail.draft';
import Junk from './mail.junk/mail.junk';
import Trash from './mail.trash/mail.trash';
import Folder from './mail.folder/mail.folder';
import mailComponent from './mail.component';
import MailService from './mail.service/mail.service';
import coreModule from '../../common/core/core';
import ngInfiniteScrollModule from 'ng-infinite-scroll';
import './_mail.scss';
import 'angular-hotkeys';
/* @ngInject */
let mailModule = angular.module('mail', [
    uiRouter,
    coreModule.name,
    MailList.name,
    Inbox.name,
    Sent.name,
    Draft.name,
    Junk.name,
    Trash.name,
    Folder.name,
    MailService.name,
    'infinite-scroll'
])
/* @ngInject */
.config(defaultMailState)

.filter('flag', function(){
    return function(input, cond){
      "ngInject";
      if(angular.isDefined(input) && angular.isDefined(cond)){
        switch(cond){
          case 'f':
            return input.indexOf('f') >= 0 ? 'fa fa-star' : 'fa fa-star-o';
            break;
          case 'u':
            return input.indexOf('u') >= 0 ? 'fa fa-circle' : 'fa fa-circle-o';
            break;
        }
      }
    }
  })
  /* @ngInject */
  .filter('timeago', function(moment, $filter) {
    return function(input) {
      "ngInject";
      var substitute = function (stringOrFunction, number, strings) {
          var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
          var value = (strings.numbers && strings.numbers[number]) || number;
          return number ? string.replace(/%d/i, value) : '';
        },
         date = Number(input),
        strings= {
          suffixAgo: "ago",
          second: "less than a minute",
          seconds: "%d seconds",
          minute: "%d minute",
          minutes: "%d minutes",
          hour: "%d hour",
          hours: "%d hours",
          day: "%d day",
          days: "%d days",
          month: "%d month",
          months: "%d months",
          year: "%d year",
          years: "%d years"
        },
        words, yearsCal, monthsCal, daysCal, hoursCal, minutesCal,  secondsCal,
        seconds = moment().diff(moment(date), 'seconds', true),
        minutes = moment().diff(moment(date), 'minutes', true),
        hours = moment().diff(moment(date), 'hours', true),
        days = moment().diff(moment(date), 'days', true),
        months = moment().diff(moment(date), 'months', true),
        years = moment().diff(moment(date), 'years', true),
        separator = strings.wordSeparator === undefined ?  " " : strings.wordSeparator,

        suffix = strings.suffixAgo;

      yearsCal = days > 345 && days < 545 && substitute(strings.year, 1, strings)
        || days > 546 && Math.round(years) < 2 && substitute(strings.year, Math.round(years), strings)
        || days > 546 && Math.round(years) > 1 && substitute(strings.years, Math.round(years), strings);

      monthsCal = days > 30 && days < 45 && substitute(strings.month, 1, strings)
        || days > 45 && days < 345 && Math.floor(months) < 2 && substitute(strings.month, Math.floor(months), strings)
        || days > 45 && days < 345 && Math.round(months) > 1 && substitute(strings.months, Math.floor(months), strings);

      daysCal = hours > 24 && hours < 48 && substitute(strings.day, 1, strings)
        || days > 2 && days < 30 && substitute(strings.day, Math.round(Math.floor(days) ), strings)
        || days > 30 && days < 365 && Math.floor(days - (Math.floor(months) * 30) ) < 2 && substitute(strings.day, Math.floor(days - (Math.floor(months) * 30) ), strings)
        || days > 30 && days < 365 && Math.floor(days - (Math.floor(months) * 30) ) > 1 && substitute(strings.days, Math.floor(days - (Math.floor(months) * 30) ), strings);

      hoursCal = minutes > 45 && minutes < 90 && substitute(strings.hour, 1, strings)
        || minutes > 90 && hours < 22 && substitute(strings.hours,Math.floor(hours), strings)
        || hours > 22 && days < 3 && Math.floor(hours - (Math.floor(days) * 24)) < 2 && substitute(strings.hour,Math.floor(hours - (Math.floor(days) * 24)), strings)
        || hours > 22 && days < 3 && Math.floor(hours - (Math.floor(days) * 24)) > 1 && substitute(strings.hours,Math.floor(hours - (Math.floor(days) * 24)), strings);

      minutesCal = seconds > 45 && seconds < 90 && substitute(strings.minute, 1, strings)
        || seconds > 90 && minutes < 45 && substitute(strings.minutes,Math.floor(minutes), strings)
        || minutes > 45 && hours < 3 && Math.floor(minutes - (Math.floor(hours) * 60)) < 2 && substitute(strings.minute,Math.floor(minutes - (Math.floor(hours) * 60)), strings)
        || minutes > 45 && hours < 3 && Math.floor(minutes - (Math.floor(hours) * 60)) > 1 && substitute(strings.minutes,Math.floor(minutes - (Math.floor(hours) * 60)), strings);

      secondsCal = seconds > 0 && seconds < 45 && substitute(strings.second, Math.round(seconds), strings)
        || seconds > 45 && seconds < 180 && substitute(strings.seconds,Math.floor(seconds - (Math.floor(minutes) * 60)), strings);

      daysCal = daysCal || '';
      monthsCal = monthsCal || '';
      yearsCal = yearsCal || '';
      hoursCal = hoursCal || '';
      minutesCal = minutesCal || '';
      secondsCal = secondsCal || '';

      return $.trim([yearsCal, monthsCal, daysCal, hoursCal, minutesCal, secondsCal, suffix].join(separator));
    }
  })
/* @ngInject */
.run(appRun)
/* @ngInject */
.directive('mail', mailComponent);

defaultMailState.$inject = ['$urlRouterProvider'];
/* @ngInject */
function defaultMailState( $urlRouterProvider ){
    "ngInject";
    $urlRouterProvider.when('/mail', '/mail/inbox');
}

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
    "ngInject";
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'mail',
            config: {
                url: '/mail',
                template: '<mail></mail>',
                title: 'Mail',
                settings: {
                    nav: 1,
                    tooltip: 'Go to Mail',
                    content: 'Mail',
                    icon: 'email'
                }
            }
        }
    ];
}
export default mailModule;
