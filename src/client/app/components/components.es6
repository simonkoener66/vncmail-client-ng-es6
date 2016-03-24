import angular from 'angular';
import Mail from './mail/mail';
import Login from './login/login';
import Calendar from './calendar/calendar';
import Contacts from './contacts/contacts';
import Tasks from './tasks/tasks';
import Home from './home/home';
import Preferences from './preferences/preferences';

let componentModule = angular.module('app.components', [
    Login.name,
    Mail.name,
    Calendar.name,
    Contacts.name,
    Tasks.name,
    Home.name,
    Preferences.name
]);

export default componentModule;
