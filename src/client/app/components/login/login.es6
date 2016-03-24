import angular from 'angular';
import uiRouter from 'angular-ui-router';
import loginComponent from './login.component';
import coreModule from '../../common/core/core';
import './_login.scss';

let loginModule = angular.module('login', [
	uiRouter, coreModule.name
])

.run(appRun)

.directive('login', loginComponent)
.directive('loginInputBlur', () => {
	return {
		restrict: 'A',
		link:  (scope, element, attrs) =>  {
			var loginForm = document.getElementById("login");
			loginForm.addEventListener("blur", function( event ) {
				if (event.target.value)
			  		event.target.classList.add('used');    
			  	else
			  		event.target.classList.remove('used');  
			}, true);
		}
	}
})
.directive('copyright', () => {
	return {
		restrict: 'A',
		link: (scope, element, attrs) => {
			scope.currentYear = new Date().getFullYear();
		}
	}
})
;

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
	"ngInject";
	routerHelper.configureStates(getStates());
}

function getStates() {
	return [
		{
			state: 'login',
			config: {
				url: '/login',
				template: '<login></login>',
				title: 'Login'
			}
		}
	];
}
export default loginModule;
