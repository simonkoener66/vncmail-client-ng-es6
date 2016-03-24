import contactComposeTemplate from '../contact.compose/contact.compose.html';
import contactComposeDeleteTemplate from '../contact.delete/contact.delete.html';
import contactMoveTemplate from '../contact.move/contact.move.html';
import contactFilterTemplate from '../contacts.contacts/contact.filter.html';
import mailComposeTemplate from '../../mail/mail.compose/mail.compose.html';
import createNewTagTemplate from '../../../common/tag/create.new.tag/create.new.tag.html';
import createFolderTemplate from '../../../common/sidebar/sidebar.folders/create.new.folder/create.new.folder.html';

class ContactsContactsController {
  /*@ngInject*/
  constructor($q, $scope, $state, $window, AUTH_EVENTS, auth, config, contactDetailsService, mailService, tagService, logger,
               sidebarService, vncConstant, $timeout, contactOperationsService, contactCountService, $sce, $mdDialog, $mdMedia, handleContactService) {
    //Initialization
    let vm = this;
    vm.title = $state.current.title || $state.params.title;
    $state.current.id = $state.current.id || $state.params.id;
    vm.ws = new WebSocket(config.SITE_WS);
    vm.auth = auth;
    vm.mailService = mailService;
    vm.tagService = tagService;
    vm.vncConstant = vncConstant;
    vm.handleContactService = handleContactService;
    vm.$sce = $sce;
    vm.logger = logger;
    vm.windowHeight = {
      height: ((angular.element($window)[0].innerHeight - 52) + 'px')
    };
    vm.WindowListHeight = {
      height: ((angular.element($window)[0].innerHeight - 210) + 'px')
    };
    vm.offset = 0;
    vm.handleContactService.removeContacts();
    //vm.contacts = [];
    vm.selectedContacts = [];
    vm.contactComposeTemplate = contactComposeTemplate;
    vm.contactMoveTemplate = contactMoveTemplate;
    vm.contactComposeDeleteTemplate = contactComposeDeleteTemplate;
    vm.contactFilterTemplate = contactFilterTemplate;
    vm.mailComposeTemplate = mailComposeTemplate;
    vm.createNewTagTemplate = createNewTagTemplate;
    vm.createFolderTemplate = createFolderTemplate;
    vm.defaultContactId = '';
    vm.queryForFilter = '';
    vm.singleContactList = [];
    vm.singleDistributionList = [];
    vm.multiSelectedContact = [];
    vm.loadMore = true;
    vm.isLoadingMoreContacts = false;
    vm.noOfContacts = 0;
    vm.contactOffset = 0;
    vm.totalNoOfContacts = 0;
    vm.sendContacts = [];
    vm.startValue = '';
    vm.endValue = '';
    vm.query = '';
    vm.elementId = 'all';
    vm.filterValue='ALL';
    vm.tags = [];
    vm.loading = true;

    $scope.$on('contact-list-called', (event, args) => {
      $scope.message = args.message;
      vm.handleContactService.contacts.splice($scope.message, 1);
    });

    $scope.$on(AUTH_EVENTS.loginSuccess, (event, msg) => {
      vm.auth = auth;
      vm.ws.send(vm.auth.user.name + ' logged in');
    });

    // listen compose button click
    $scope.$on('compose:event',function(){
      $timeout(function() {
        angular.element('#contact-compose').find('#modal').trigger('click');
      }, 100);
    });

    $scope.$on('search', function(e, search){
      vm.singleContactList = [];
      vm.singleDistributionList = [];
      vm.multiSelectedContact = [];
      vm.handleContactService.removeContacts();
      //vm.contacts = [];
      vm.contactOffset = 0;
      vm.defaultContactId = '';
      vm.query = search;
      vm.contactList();
    });

    // Activate
    function activate() {
      let promises = [getTagList()];
      return $q.all(promises).then(() => {
        vm.contactList();
      });
    }

    activate();
    vm.editContact = () => {
      console.info('Edit Contact');
      $timeout(function() {
        angular.element('#editContact').find('#modal').trigger('click');
      }, 100);
    };
    //Defines the search request based on the selection of the Contact Folder
    vm.contactList = () => {
      vm.isLoadingMoreContacts = true;
      vm.loading = true;
      mailService.getFolderList({}, function (response) {
        for (let i = 0; i < response.folder.length; i++) {
          if (response.folder[i].$.id.indexOf($state.current.id) == 0) {
            vm.totalNoOfContacts = response.folder[i].$.n;
          }
        }
      });

      // if search has created
      if(vm.query){
        let request = {
          'query': vm.query + ' ' + vm.queryForFilter
        };
        vm.selectFilter && (request.cursor = {
          endSortVal: vm.endValue,
          id: 0,
          sortVal: vm.startValue
        });

        mailService.searchContacts(request, function (response) {
          if (angular.isDefined(response)) {
            vm.handleContactService.removeContacts();
            //vm.contacts = [];
            if (angular.isDefined($state.current.id)) {
              if ($state.current.id.indexOf(vncConstant.FOLDERID.CONTACTS) == 0) {
                vm.getContactDetail(response, 'contacts', 'contacts', 'in:contacts');
              }
              else if($state.current.id.indexOf(vncConstant.FOLDERID.EMAILED_CONTACTS) == 0){
                vm.getContactDetail(response, 'emailedContacts', 'emailedContacts', 'in:"Emailed Contacts"');
              }
              else if($state.current.id.indexOf(vncConstant.FOLDERID.TRASH) == 0){
                vm.getContactDetail(response, 'trashContacts', 'trashContacts', 'in:trash');
              }
            }
            else{
              vm.getContactDetail(response, 'distributionList', 'distributionList');
            }
          }
        });
      }
      else if (angular.isDefined($state.current.id)) {
        let request = {
          'offset': vm.contactOffset
        };
        vm.selectFilter && (request.cursor = {
          endSortVal: vm.endValue,
          id: 0,
          sortVal: vm.startValue
        });
        request.query = `in:"${vm.title}"`;

        if ($state.current.id == vncConstant.FOLDERID.CONTACTS) {
          mailService.getContacts(request, function (response) {
            vm.getContactDetail(response, 'contacts', 'contacts', 'in:contacts');
          });
        }

        else if ($state.current.id == vncConstant.FOLDERID.EMAILED_CONTACTS) {
          mailService.getContacts(request, function (response) {
            vm.getContactDetail(response, 'emailedContacts', 'emailedContacts', 'in:"Emailed Contacts"');
          });
        }

        else if ($state.current.id == vncConstant.FOLDERID.TRASH) {
          mailService.getContacts(request, function (response) {
            vm.getContactDetail(response, 'trashContacts', 'trashContacts', 'in:trash');
          });
        }
        else if($state.params.id) {
          mailService.getContacts(request, function (response) {
            vm.getContactDetail(response, 'otherContacts', 'otherContacts', vm.title);
          });
        }
      } else {
        if ($state.current.url === '/distributionList') {
          mailService.getAccountDistributionLists({}, function (response) {
            vm.getContactDetail(response, 'distributionList', 'distributionList');
          });
        }
      }
    }; //End Of ContactList Function

    vm.getContactDetail = (response, detailUrl, state, queryForFilter) =>{
      if (angular.isDefined(response) && response && response.cn) {
        vm.handleContactResponse(response);
        vm.detailUrl = detailUrl;
        vm.handleContactService.detailUrl = detailUrl;
        vm.queryForFilter = queryForFilter;
      }
      else vm.loading = false;
    };

    //MultiSelection of Contacts
    //vm.selectContact = (id, e) => {
    //  if (e.ctrlKey || e.metaKey) {
    //    vm.multiSelectedContact.push(id);
    //    $state.go('contacts.' + vm.detailUrl + '.detail', {
    //      'contactId': id
    //    });
    //    for (let i = 0; i < vm.multiSelectedContact.length - 1; i++) {
    //      if (vm.multiSelectedContact[i] == id) {
    //        vm.multiSelectedContact.splice(i, 1);
    //        vm.multiSelectedContact.splice(vm.multiSelectedContact.length - 1, 1);
    //        if (vm.multiSelectedContact.length == 0) {
    //          $state.go('contacts.' + vm.detailUrl + '.detail', {
    //            'contactId': undefined
    //          });
    //        }
    //      }
    //    }
    //  } else {
    //    vm.multiSelectedContact = [];
    //    vm.multiSelectedContact.push(id);
    //  }
    //  contactOperationsService.setContactOperations($state.current.id, vm.multiSelectedContact);
    //
    //  // Toggle back buttona and contact detail view for mobile
    //  let detailPane = document.querySelector('#contactDetailPage');
    //  let button = document.querySelector('.back-to-contact');
    //  detailPane && detailPane.classList.toggle('show');
    //}; //End Of ContactList Function

    vm.selectContact = (id) => {
      angular.forEach(vm.handleContactService.contacts, function(contact){
        contact.selected = contact.id == id;
      });
      //vm.selectedContact = id;
    };

    //Handles the response of the search requests on contacts
    vm.handleContactResponse = (response) => {
      vm.contactOffset = 0;
      vm.loading = false;
      if (response.cn) {
        if (response.cn.length > 0) {
          vm.loadMore = response.$.more === '1';
          vm.noOfContacts += response.cn.length;
          vm.loadContactList(response.cn);
        } else {
          vm.noOfContacts += 1;
          vm.singleContactList.push(response.cn);
          vm.loadContactList(vm.singleContactList);
        }
      }
      vm.isLoadingMoreContacts = false;
      contactCountService.setContactCount(vm.noOfContacts, vm.totalNoOfContacts, vm.loadMore);
    }; //End Of handleContactResponse Function

    //Handles the response of the search requests on DistributionList
    vm.handleDistributionList = (response) => {
      if (response.length) {
        vm.loadDistributionList(response);
      } else {
        vm.singleDistributionList.push(response);
        vm.loadDistributionList(vm.singleDistributionList);
      }
    }; //End Of handleDistributionList Function

    //Loading the details of the contact List
    vm.loadContactList = (response) => {
      vm.defaultContactId = '';
      vm.singleContactList = [];
      let
      last_name = '',
          first_name = '',
          first_name_initial = '',
          last_name_initial = '',
          displayName = '',
          contactId,
          tagNames = '',
          mobile_phone = '',
          email_contacts ='';

      if (angular.isDefined(response)) {
        for (let i = 0; i < response.length; i++) {
          contactId = response[i].$.id;
          vm.lastContactId = response[response.length - 1].$.id;
          vm.lastSfValue = response[response.length - 1].$.sf;
          last_name = '',
            first_name = '',
            last_name_initial = '',
            first_name_initial = '',
             mobile_phone = '',
             email_contacts ='';

          vm.defaultContactId = response[0].$.id;
          for (let j = 0; j < response[i].a.length; j++) {
            if (response[i].a[j].$.n === 'lastName') {
              last_name_initial = (response[i].a[j]._).charAt(0);
              last_name = response[i].a[j]._;
            }
            if (response[i].a[j].$.n === 'firstName') {
              first_name = response[i].a[j]._;
              first_name_initial = (response[i].a[j]._).charAt(0);
            }
             if (response[i].a[j].$.n === 'email') {
             email_contacts = response[i].a[j]._;
           }
            if (response[i].a[j].$.n === 'mobilePhone' ||  response[i].a[j].$.n === 'companyPhone' || response[i].a[j].$.n === 'homePhone' || response[i].a[j].$.n === 'other' ||
            response[i].a[j].$.n === 'assisstantPhone' || response[i].a[j].$.n === 'carPhone' ) {
              mobile_phone = response[i].a[j]._;

            }
          }

            let contactInfo =  response[i].$;
            let foundAvatar = false;
            let image = '';
            _.some(response[i].a, function(data){
                if (angular.isDefined(data.$) && data.$.n === 'image') {
                  foundAvatar = true;
                  return foundAvatar;
                }
            });

            if ( foundAvatar ) {
              image = vm.vncConstant.ZimbraAPI + '/getAvatar?user_id=' + contactInfo.id;
            }

          if (first_name === '' && last_name === '' ) {
            first_name = '<No';
            last_name = 'Name>';
            last_name_initial = 'N';
            first_name_initial = 'N';
          }
          if(angular.isDefined(first_name) && angular.isDefined(last_name)){
            vm.displayName=first_name+ " "+last_name;
            vm.displayName.length > 22 ? vm.displayName=(vm.displayName.substr(0,22)+"..."):vm.displayName;
          }
          if(angular.isDefined(mobile_phone)){
            vm.displayPhone=mobile_phone ;
         }
          // if(angular.isDefined(number_phone)){
          //   vm.displayPhonenumber=number_phone ;
          // }
          if(angular.isDefined(email_contacts)){
            vm.displayEmail= email_contacts;
            vm.displayEmail.length > 22 ? vm.displayEmail=(vm.displayEmail.substr(0,22)+"..."):vm.displayEmail;
          }
          vm.avatarName = first_name_initial + last_name_initial;

          if (response[i].$.tn) {
            tagNames = response[i].$.tn.split(',');
          }

          function camelCaseToTitleCase(camelCase){
            if (camelCase == null || camelCase == "") {
              return camelCase;
            }

            camelCase = camelCase.trim();
            var newText = "";
            for (var i = 0; i < camelCase.length; i++) {
              if (/[A-Z]/.test(camelCase[i])
                  && i != 0
                  && /[a-z]/.test(camelCase[i-1])) {
                newText += " ";
              }
              if (i == 0 && /[a-z]/.test(camelCase[i]))
              {
                newText += camelCase[i].toUpperCase();
              } else {
                newText += camelCase[i];
              }
            }

            return newText;
          }

          let attrs = _.map(response[i].a, (data) => {
            if (data.$) return {key: camelCaseToTitleCase(data.$.n), value: data._};
            return;
          });
          let contactDetail = '';
          for (let i = 0; i < attrs.length; i++) {
            if ( angular.isDefined(attrs[i]) ) {
              contactDetail += '<p>' + attrs[i].key + ': ' + attrs[i].value + '</p>';
            }
          }

          vm.handleContactService.addContact({
            'avatarName': vm.avatarName,
            'image': image,
            'displayName': vm.displayName,
            'id': contactId,
            'tags': vm.tagService._splitTags(response[i].$.tn),
            'displayEmail' : vm.displayEmail,
            'displayPhone' : vm.displayPhone,
            // 'tags': vm.mailHandleService._splitTags(response[i].$.tn),
            'contactDetail': vm.$sce.trustAsHtml('<div style="text-align:left">' + contactDetail  + '</div>'),
            'allTags': splitTags(response[i].$.tn, true),
            'selected' : false,
            'checked' : false // for initialize checkbox
          });
          //vm.contacts.push({
          //  'avatarName': vm.avatarName,
          //  'image': image,
          //  'displayName': vm.displayName,
          //  'id': contactId,
          //  'tags': vm.tagService._splitTags(response[i].$.tn),
          //  'displayEmail' : vm.displayEmail,
          //  'displayPhone' : vm.displayPhone,
          //  // 'tags': vm.mailHandleService._splitTags(response[i].$.tn),
          //  'contactDetail': vm.$sce.trustAsHtml('<div style="text-align:left">' + contactDetail  + '</div>'),
          //  'allTags': splitTags(response[i].$.tn, true),
          //  selected : false // for initialize checkbox
          //});
          response[i].$.allTags = splitTags(response[i].$.tn, true);
        }
        vm.sendContacts = vm.sendContacts.concat(response);
        vm.multiSelectedContact.push(vm.defaultContactId);
      }
      contactDetailsService.setContactDetails(vm.sendContacts);
    }; //End Of loadContactList Function

    //Loading the details of the Distribution List
    vm.loadDistributionList = (response) => {
      vm.handleContactService.removeContacts();
      //vm.contacts = [];
      vm.defaultContactId = '';
      vm.singleDistributionList = [];
      let displayName = '',
          contactId,
          displayPhone = '',
          displayEmail = '',
          tagNames = '';

      if (angular.isDefined(response)) {
        vm.defaultContactId = response[0].dl[0].$.id;
        for (let i = 0; i < response[0].dl.length; i++) {
          contactId = response[0].dl[i].$.id;
          displayName = response[0].dl[i].$.d || ' ';
          displayPhone = response[0].dl[i].$.d || ' ';
          displayEmail = response[0].dl[i].$.d || ' ';
          vm.handleContactService.addContact({
            'avatarName': displayName.charAt(0),
            'displayName': displayName,
            'id': contactId,
            'displayEmail' : displayEmail,
            'displayPhone' : displayPhone,
            'tags': splitTags(response[0].dl[i].$.tn, false)
          });
          //vm.contacts.push({
          //  'avatarName': displayName.charAt(0),
          //  'displayName': displayName,
          //  'id': contactId,
          //  'displayEmail' : displayEmail,
          //  'displayPhone' : displayPhone,
          //  'tags': splitTags(response[0].dl[i].$.tn, false)
          //});
        }
      }
    }; //End Of loadDistributionList Function

    // load more contacts while scrolling
    vm.loadMoreContact = () => {
      if(vm.loadMore || !vm.isLoadingMoreContacts){
        vm.isLoadingMoreContacts = true;
        vm.contactOffset = vm.contactOffset + 100;
        if (vm.endValue == '' && vm.startValue == '') {
          vm.contactList();
        } else {
          let request = {
            offset: vm.contactOffset,
            query: vm.queryForFilter,
            cursor: {
              endSortVal: vm.endValue,
              id: vm.lastContactId,
              sortVal: vm.lastSfValue
            },
            locale: 'en_US'
          };
          vm.query != '' && (request.query = vm.query + ' ' + vm.queryForFilter);

          mailService.filterContact(request, function (res) {
            if (angular.isDefined(res)) {
              vm.handleContactResponse(res);
            }
          });
        }
      }
    }; //End Of loadMoreContact Function

    function getTagList() {
      return sidebarService.getTag({}, (tags, error) => {
        vm.tags = [];
        if (tags) {
          if (!angular.isArray(tags)) {
            vm.tags.push(tags); // response is an object, not an array
          } else {
            vm.tags = tags;
          }

          for(let tag of vm.tags) {
            if (tag.$.color) {
              tag.$.rgb = vncConstant.COLOR_CODES[tag.$.color];
            }
          }
        }
      });
    }

    /*
    Split a tag name string like 'Tag 1,Tag 2,Tag 3' into an array with full detail of tag
    @tagNamesString
    @isFull:
      - false: just split into 3 items [Tag1, Tag2, +1]
      - true: split all items [Tag1, Tag2, Tag3]
    */
    function splitTags(tagNamesString, isFull) {
      let tagNameArray = [];
      let tagArray = [];
      let tagNumber = 0;

      if (tagNamesString && tagNamesString !== '') {
        tagNameArray = tagNamesString.split(',');

        for(let tagName of tagNameArray) {
          for(let tag of vm.tags) {
            if (tag.$.name === tagName) {
              if (tagNumber === 2 && tagNameArray.length > 2 && !isFull) {
                tagArray.push({
                  $: {
                    id: '',
                    name: '+' + (tagNameArray.length - 2),
                    rgb: '#6A6A6A'
                  }
                });
              } else if (tagNumber < 2 || isFull) {
                tagArray.push(tag);
              }

              tagNumber += 1;
            }
          }
        }
      }

      // Order by tag name
      tagArray.sort(function (a, b) {
        return ((a.$.name > b.$.name && !a.$.name.startsWith('+') && !b.$.name.startsWith('+')) ? 1 : -1);
      });
      return tagArray;
    }

    //Pagination Filter A--Z and Numbers
    //Parameters (i) element id (ii) sort value (iii) end sort value
    vm.contactPagination = (ele, sortVal, endVal) => {
      if(ele == 'all'){
        vm.filterValue = 'A';
      }else{
        vm.filterValue=ele;
      }
      vm.handleContactService.removeContacts();
      //vm.contacts = [];
      vm.noOfContacts = 0;
      vm.defaultContactId = '';
      vm.singleContactList = [];
      vm.multiSelectedContact = [];
      $state.go('contacts.' + vm.detailUrl + '.detail', {
        'contactId': ''
      });
      vm.startValue = sortVal;
      vm.endValue = endVal;
      vm.elementId = ele;
      let request = {
        query: vm.queryForFilter,
        cursor: {
          endSortVal: endVal,
          id: 0,
          sortVal: sortVal
        },
        locale: 'en_US'
      };
      vm.query != '' && (request.query = vm.query + ' ' + vm.queryForFilter);
      ele == 'all' && delete request.cursor;

      $mdDialog.cancel();
      mailService.filterContact(request, function (res) {
        if (angular.isDefined(res)) {
          vm.handleContactResponse(res);
        }
        $state.go('contacts.' + vm.detailUrl + '.detail', {
          'contactId': ''
        });
      });
    }; //End Of contactPagination Function

    $scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: ContactFilterPagination,
      parent: angular.element('.summary-pane'),
      targetEvent: ev,
       template: vm.contactFilterTemplate,
       hasBackdrop : false,
      // templateUrl:'contact.filter.html',
      clickOutsideToClose: true
    })
  };

  function ContactFilterPagination($rootScope, $scope){
        //Pagination Filter A--Z and Numbers
        //Parameters (i) element id (ii) sort value (iii) end sort value
        $scope.contactPagination = (ele, sortVal, endVal) => {
          vm.loading = true;
          if(ele == "num"){
            vm.filterValue = '123';
          }else{
            vm.filterValue=ele;
          }
          vm.handleContactService.removeContacts();
          //vm.contacts = [];
          vm.noOfContacts = 0;
          vm.defaultContactId = '';
          vm.singleContactList = [];
          vm.multiSelectedContact = [];
          $state.go('contacts.' + vm.detailUrl + '.detail', {
            'contactId': ''
          });
          vm.startValue = sortVal;
          vm.endValue = endVal;
          vm.elementId = ele;
          let request = {
            query: vm.queryForFilter,
            cursor: {
              endSortVal: endVal,
              id: 0,
              sortVal: sortVal
            },
            locale: 'en_US'
          };
          vm.query != '' && (request.query = vm.query + ' ' + vm.queryForFilter);
          ele == 'all' && delete request.cursor;
           $mdDialog.cancel();
          mailService.filterContact(request, function (res) {
            if (angular.isDefined(res)) {
              vm.handleContactResponse(res);
            }
            $state.go('contacts.' + vm.detailUrl + '.detail', {
              'contactId': ''
            });
          });
        }; //End Of contactPagination Function
  }
    vm.tagContact = (contact) => {
      let vm = this;
      $mdDialog.show({
        controller: 'CreateNewTagController',
        controllerAs: 'vm',
        bindToController: true,
        template: createNewTagTemplate,
        escapeToClose: false,
        fullscreen: true
      })
        .then((res) => {
          vm.tagService.tagContact(contact, res.tag);
        });
    };

    //////////////////////////////////// multi selection //////////////////////////////////////

    vm.makeMultiFunction = (cond, tag) =>{
      let flag = cond == 'tag',
          count = vm.selectedContacts.length,
          contacts = vm.selectedContacts.join(",");
      switch( cond ){
        case 'tag': {
          vm.mailService.assignTagToContact(contacts, tag.$.name, (res, err) => {
            if (err) {
              vm.logger.error(err.msg);
            }
            else {
              // vm.logger.success( count+' Contact tagged "' + tag.$.name + '"');
            }
          });
          break;
        }
        case 'remove-tag': {
          vm.mailService.removeAllTagInContact(contacts, (res, err) => {
            if (err) {
              logger.error(err.msg);
            }
            else {
              // vm.logger.success('All Tags removed successfully.');
            }
          });
          break;
        }
      }
      angular.forEach( vm.handleContactService.contacts, function ( contact ) {
        if( vm.selectedContacts.includes (contact.id) && flag) {
          contact.tags.includes(tag) || contact.tags.push(tag);
        }
        else if(vm.selectedContacts.includes (contact.id) && !flag) contact.tags = [];
      });
    };

    vm.markMultiple = ( id, value ) => {
      if( vm.selectedContacts && vm.selectedContacts.includes(id) ){
        value || vm.selectedContacts.splice( vm.selectedContacts.indexOf(id) , 1)
      }
      else{
        value && vm.selectedContacts.push( id );
      }
      contactOperationsService.setContactOperations($state.current.id, vm.selectedContacts);
    };

    vm.markAll =  () => {
      vm.selectedContacts = [];
      angular.forEach( vm.handleContactService.contacts, function ( contact ) {
          contact.selected = vm.selectAll;
          vm.selectAll && vm.selectedContacts.push( contact.id );
        });
      contactOperationsService.setContactOperations($state.current.id, vm.selectedContacts);
    };

    vm.selectSingleContact = ( id ) => {
      angular.forEach( vm.handleContactService.contacts, function ( contact ) {
        contact.selected = false;
      });
      vm.selectedContacts = [];
      vm.selectAll = false;
      contactOperationsService.setContactOperations( $state.current.id, id );
    };

    vm.printContact = (contactId) => {
          var url = mailService.printContact(contactId);
          var popupWin = $window.open(url);
          $timeout(function () {
              popupWin.print();
          }, 5000);
      };
  }
}

export default ContactsContactsController;
