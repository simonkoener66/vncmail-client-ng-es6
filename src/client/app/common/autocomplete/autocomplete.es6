import angular from 'angular';
//import customSelect from './js-custom-select/js-custom-select';
import avatarComponent from './autocomplete.component';
import './_autocomplete.scss';

let autoCompleteModule = angular.module('autoComplete', [])

.directive('vncAutoCompleteMail', avatarComponent)
.directive('vncAutoComplete', MdContactChips);

var MD_CONTACT_CHIPS_TEMPLATE = `
      <md-chips class="md-contact-chips"
          ng-model="$mdContactChipsCtrl.contacts"
          md-require-match="$mdContactChipsCtrl.requireMatch"
          md-autocomplete-snap>
          <md-autocomplete
              md-menu-class="md-contact-chips-suggestions"
              md-selected-item="$mdContactChipsCtrl.selectedItem"
              md-search-text="$mdContactChipsCtrl.searchText"
              md-items="item in $mdContactChipsCtrl.queryContact($mdContactChipsCtrl.searchText)"
              md-item-text="$mdContactChipsCtrl.itemName(item)"
              md-no-cache="true"
              md-autoselect
              placeholder="{{$mdContactChipsCtrl.contacts.length == 0 ?
                  $mdContactChipsCtrl.placeholder : $mdContactChipsCtrl.secondaryPlaceholder}}">
             <md-item-template>
             <vnc-avatar person-name="{{item[$mdContactChipsCtrl.contactName]}}" person-size="sm"></vnc-avatar>
              <span class="autocomplete-right-panel ">
                  <span class="data-name">{{item[$mdContactChipsCtrl.contactName]}}</span>
                  <span>{{item[$mdContactChipsCtrl.contactEmail]}}</span>
              </span>
        </md-item-template>
            <!--<div class="md-contact-suggestion">-->
            <!--<vnc-avatar person-name="{{item[$mdContactChipsCtrl.contactName]}}" person-size="xs"></vnc-avatar>-->
              <!--<span class="md-contact-name" md-highlight-text="$mdContactChipsCtrl.searchText"-->
                    <!--md-highlight-flags="{{$mdContactChipsCtrl.highlightFlags}}">-->
                <!--{{item[$mdContactChipsCtrl.contactName]}}-->
              <!--</span>-->
              <!--<span class="md-contact-email" >{{item[$mdContactChipsCtrl.contactEmail]}}</span>-->
            <!--</div>-->
          </md-autocomplete>
          <md-chip-template>
            <div class="md-contact-avatar">
            <vnc-avatar person-name="{{$chip[$mdContactChipsCtrl.contactName]}}" person-size="xs"></vnc-avatar>
            </div>
            <div class="md-contact-name">
              {{$chip[$mdContactChipsCtrl.contactName]}}
            </div>
          </md-chip-template>
      </md-chips>`;


function MdContactChips($mdTheming, $mdUtil) {
  return {
    template: function(element, attrs) {
      return MD_CONTACT_CHIPS_TEMPLATE;
    },
    restrict: 'E',
    controller: 'MdContactChipsCtrl',
    controllerAs: '$mdContactChipsCtrl',
    bindToController: true,
    compile: compile,
    scope: {
      contactQuery: '&mdContacts',
      placeholder: '@',
      secondaryPlaceholder: '@',
      contactName: '@mdContactName',
      contactImage: '@mdContactImage',
      contactEmail: '@mdContactEmail',
      contacts: '=ngModel',
      requireMatch: '=?mdRequireMatch',
      highlightFlags: '@?mdHighlightFlags'
    }
  };

  function compile(element, attr) {
    return function postLink(scope, element, attrs, controllers) {

      $mdUtil.initOptionalProperties(scope, attr);
      $mdTheming(element);

      element.attr('tabindex', '-1');
    };
  }
}
MdContactChips.$inject = ["$mdTheming", "$mdUtil"];

export default autoCompleteModule;
