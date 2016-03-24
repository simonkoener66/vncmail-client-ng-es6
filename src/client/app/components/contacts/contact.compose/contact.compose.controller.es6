const LOGGER = new WeakMap();
const ROOTSCOPE = new WeakMap();
const SCE = new WeakMap();
const SCOPE = new WeakMap();
const MDDIALOG = new WeakMap();

class ContactComposeController {
  /* @ngInject */
  constructor(logger, $scope, $rootScope, $mdDialog, mailService, config, $state, data, $stateParams, hotkeys, $timeout) {
    var vm = this;
    vm.mailService = mailService;
    vm.logger = logger;
    vm.$scope = $scope;
    vm.title = 'Contact Compose';
    vm.isMoreDetails = false;

    SCOPE.set(this, $scope);
    MDDIALOG.set(this, $mdDialog);
    ROOTSCOPE.set(this, $rootScope);
    this.firstOpen = true;
    vm.keyPress = false;
    //operation is for edit or compose
    vm.operation = eval(data);

    vm.keyPressChange = (event) => {
        vm.keyPress = true;
    }

    vm.showMoreDetails = ()=>{
      vm.isMoreDetails = !vm.isMoreDetails
    }

    activate();
    // Show/hide extra parameter of upper part of design
    vm.upperLayout = {
      prefix:false,
      suffix:false,
      maiden:false,
      middle:false,
      department:false,
      nickname:false
    };

    vm._closeModal = () => {
    if ( this.firstOpen ) {
      MDDIALOG.get(this).hide().then(() => {
          console.info('close');
          // TODO This is a hack job until the issue of nested modals gets fixed.
          setTimeout(() => {
              let mask = document.querySelector('.md-scroll-mask');
              let dialog = document.querySelector('.md-dialog-container');
              let backdrop = document.querySelector('.md-dialog-backdrop');
              let body = document.querySelector('body');

              if(mask) {
                mask.parentNode.removeChild(mask);
              }
              if(dialog) {
                dialog.parentNode.removeChild(dialog);
              }
              if(dialog) {
                backdrop.parentNode.removeChild(backdrop);
              }

              body.classList.remove('md-dialog-is-showing');
              this.firstOpen = false;
          }, 250);
      }, 'finished');
    }

  }
    //Initialize the contact create request,it is used in creating a new contact / modifying Contact final values stored in this array.
    vm.createContactRequest={
      contactAttrs:[]
    };
    //Intialize the contact detail Json with default type
    /*
     *active: by default true, when remove it set to true
     *key: key value of array ,it takes full value i.e homeCountry1,homePhone2,etc
     *value:value of array
     *type:defines the type of that value i.e home, work,etc.
     *stateKey,countryKey,cityKey,streetKey,postalcodeKey defines individual namekey for address
     *index:by default 0(for further use in address only)
     */
    vm.saveContactDetail = {
      email:{"1":{"value":"","key":"email","active":true}},
      url:[{
        type:"home",
        key:"homeURL",
        active:true,
        value:""
      }],
      phone: [{
        type: "mobile",
        value: "",
        active:true,
        key:"mobilePhone"
      }],
      address: [{
        type: "home",
        city: "",
        street: "",
        state: "",
        postalcode: "",
        country: "",
        active:true,
        stateKey:"homeState",
        cityKey:"homeCity",
        countryKey:"homeCountry",
        streetKey:"homeStreet",
        postalcodeKey:"homePostalCode",
        index:0
      }],
      screen: [{
        type: "xmpp",
        value: "",
        active:true,
        key:"imAddress"
      }],
      others: [{
        type: "birthday",
        value: "",
        active: true,
        key:"birthday"
      }]
    };

    vm.originalContact= angular.copy(vm.saveContactDetail);
    vm.$scope.$watch('vm.saveContactDetail',function(newValue, oldValue) {
      if(newValue !== oldValue) {
        vm.dataHasChanged = true;
      }
    }, true);

    $scope.$on('CLOSE_CONTACT_COMPOSE', (e, data) => {
      // $mdDialog.hide();
      vm._closeModal();
    });

    $scope.$on('CREATE_CONTACT', (e, data) => {
      vm.createNewContact();
    });
    //It will dismiss the model while click on cancel
    vm.cancel = () => {
          if( !SCOPE.get(this).contactCompose.$dirty ){
            ROOTSCOPE.get(this).$broadcast('CLOSE_CONTACT_COMPOSE');
          }
          else{
            var modalInstance = MDDIALOG.get(this).show({
              controller: this._savingContactModalController,
              controllerAs: 'vm',
              bindToController: true,
              templateUrl: 'savingContactModal.html',
              escapeToClose: false,
              fullscreen: true
            })
              .then((response) => {
                console.log('savingContactModal', response)
                if (response) {
                  ROOTSCOPE.get(this).$broadcast('CLOSE_CONTACT_COMPOSE');
                }
                vm._closeModal();
              });
          }
    };

    //render the upper layout as option selcted from drop-down
    vm.changeUpperLayout=(type) => {
      if(type=="maiden"){
        vm.upperLayout.maiden= !vm.upperLayout.maiden;
        //Edit case :if we deselect this option then it becomes blank
        if(vm.upperLayout.maiden ===  false){
          vm.saveContactDetail.maiden="";
        }
      }else if(type=="prefix"){
        vm.upperLayout.prefix = !vm.upperLayout.prefix;
        //Edit case :if we deselect this option then it becomes blank
        if(vm.upperLayout.prefix === false){
          vm.saveContactDetail.prefix="";
        }
      }else if(type=="middle"){
        vm.upperLayout.middle= !vm.upperLayout.middle;
        //Edit case :if we deselect this option then it becomes blank
        if(vm.upperLayout.middle === false){
          vm.saveContactDetail.middle="";
        }
      }else if(type=="suffix"){
        vm.upperLayout.suffix= !vm.upperLayout.suffix;
        //Edit case :if we deselect this option then it becomes blank
        if(vm.upperLayout.suffix === false){
          vm.saveContactDetail.suffix="";
        }
      }else if(type=="nickname"){
        vm.upperLayout.nickname= !vm.upperLayout.nickname;
        //Edit case :if we deselect this option then it becomes blank
        if(vm.upperLayout.nickname === false){
          vm.saveContactDetail.nickname="";
        }
      }else if(type=="department"){
        vm.upperLayout.department= !vm.upperLayout.department;
        //Edit case :if we deselect this option then it becomes blank
        if(vm.upperLayout.department === false){
          vm.saveContactDetail.department="";
        }
      }
    }
    //It creates the final request while creating a new user or modifying a new user.(create/edit contact)
    vm.handleCreateContactRequest=()=>{

      //if prefix is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.prefix != undefined ){
        vm.createContactRequest.contactAttrs.push({
          "key" : "namePrefix",
          "value" : vm.saveContactDetail.prefix
        });
      }
      //if suffix is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.suffix != undefined){
        vm.createContactRequest.contactAttrs.push({
          "key" : "nameSuffix",
          "value" : vm.saveContactDetail.suffix
        });
      }
      //if maiden is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.maiden != undefined){
        vm.createContactRequest.contactAttrs.push({
          "key" : "maidenName",
          "value" : vm.saveContactDetail.maiden
        });
      }
      //if middle is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.middle != undefined){
        vm.createContactRequest.contactAttrs.push({
          "key" : "middleName",
          "value" : vm.saveContactDetail.middle
        });
      }
      //if nickname is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.nickname != undefined){
        vm.createContactRequest.contactAttrs.push({
          "key" : "nickname",
          "value" : vm.saveContactDetail.nickname
        });
      }
      //if department is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.department != undefined){
        vm.createContactRequest.contactAttrs.push({
          "key" : "department",
          "value" : vm.saveContactDetail.department
        });
      }
      //if email is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.email != undefined) {
        angular.forEach(vm.saveContactDetail.email,function(value, i) {
          if (value == undefined)
            return;
          vm.createContactRequest.contactAttrs.push({
            "key" : value.key,
            "value" : value.value
          });
        });
      }
      //if firstname is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.firstName != undefined) {
        vm.createContactRequest.contactAttrs.push({
          "key" : "firstName",
          "value" : vm.saveContactDetail.firstName
        });
      }
      //if lastname is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.lastName != undefined) {
        vm.createContactRequest.contactAttrs.push({
          "key" : "lastName",
          "value" : vm.saveContactDetail.lastName
        });
      }
      //if jobtitle is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.jobTitle != undefined) {
        vm.createContactRequest.contactAttrs.push({
          "key" : "jobTitle",
          "value" : vm.saveContactDetail.jobTitle
        });
      }
      //if company is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.company != undefined) {
        vm.createContactRequest.contactAttrs.push({
          "key" : "company",
          "value" : vm.saveContactDetail.company
        });
      }
      //if notes is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.notes != undefined) {
        vm.createContactRequest.contactAttrs.push({
          "key" : "notes",
          "value" : vm.saveContactDetail.notes
        });
      }
      //if screen is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.screen != undefined){
        vm.saveContactDetail.screen.forEach(function(value, i) {
          if (!value.key) //return if key is not present
            return;
          var key = value.key;
          //responseValue:in case of  screen,value should be type://value in this format.i.e-"xmpp://bhoomi"
          let responseValue = value.type + "://" + value.value;

          //if value is null then responsevalue should be blank rather than 'Xmpp://'
          if(value.value === ''){
            responseValue='';
          }
          vm.createContactRequest.contactAttrs.push({
            "key" : key,
            "value" : responseValue
          });

        });
      }
      //if url is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.url != undefined){
        angular.forEach(vm.saveContactDetail.url,function(value, i) {
          //return if key is not present
          if (!value.key)
            return;
          vm.createContactRequest.contactAttrs.push({
            "key" : value.key,
            "value" : value.value
          });
        });
      }
      //if others field is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.others != undefined){
        vm.saveContactDetail.others.forEach(function(value, i) {
          //return if key is not present
          if (!value.key)
            return;
          //custom case (ng-model:text value)
          if(value.type == 'custom'){
            vm.createContactRequest.contactAttrs.push({
              "key" : value.key,
              "value" : value.active?value.value:""
            });
          }else{
            // for birthday/anniversary case (ng-model:date)
            vm.createContactRequest.contactAttrs.push({
              "key" : value.key,
              "value" : value.active?value.datevalue:""
            });
          }
        });
      }
      //if phone is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.phone != undefined){
        vm.saveContactDetail.phone.forEach(function(value, i) {
          if (!value.key)
            return;
          vm.createContactRequest.contactAttrs.push({
            "key" : value.key,
            "value" : value.value
          });
        });
      }
      //if  address is not undefined then it will push in final request with key defined in zimbra.
      if(vm.saveContactDetail.address!= undefined){
        vm.saveContactDetail.address.forEach(function(value, i) {
          if (value == undefined)
            return;
          vm.createContactRequest.contactAttrs.push({
            "key" : value.streetKey,
            "value" : value.street
          });
          vm.createContactRequest.contactAttrs.push({
            "key" : value.countryKey,
            "value" : value.country
          });
          vm.createContactRequest.contactAttrs.push({
            "key" : value.cityKey,
            "value" : value.city
          });
          vm.createContactRequest.contactAttrs.push({
            "key" : value.postalcodeKey,
            "value" : value.postalcode
          });
          vm.createContactRequest.contactAttrs.push({
            "key" : value.stateKey,
            "value" : value.state
          });
        });
      }
    }
    /*It will give next index to store the key in zimbra
     *fieldKey: i.e. homePhone3
     *key:phone
     *type:home
     *keyName:it used in address field only(for stateKey, countryKey,etc.)
     */
    vm.getNextFieldIndex = (fieldKey,key,type,keyName) => {
      var index = -1;
      keyName = keyName || "key";
      for(var i in vm.saveContactDetail[key]){
        var value = vm.saveContactDetail[key][i];
        if(value[keyName].startsWith(fieldKey)){
          var tempIndex = value[keyName].replace(fieldKey,"") || 0;
          if(tempIndex > index) index = tempIndex;
        }
      }
      //if didnt find the index ,it will return blank
      if(index == -1){
        return "";
        // if it has one value of that type is present then it will return 2(if homePhone is present then it should be homePhone2 for that here 2 is returned.)
      }else if(index == 0){
        return 2;
        //other case next index should be returned.
      }else{
        return ++index;
      }
    }
    //It will return the next index for address of city, state,country,postalcode,street
    vm.getNextAddressIndex = (type) => {
      let addressIndex= 0;
      let fieldNames = ['City','State','Street','Country','PostalCode'];
      for(var i in fieldNames){
        let tempIndex = vm.getNextFieldIndex(type+ fieldNames[i],"address",type, fieldNames[i].toLowerCase() + "Key");
        addressIndex =  (tempIndex || 0) > addressIndex?tempIndex : addressIndex;
      }
      if(addressIndex == 0) return "";
      return addressIndex;
    }
    //Activate contact  compose view.
    function activate() {
      // logger.info('Activated Contact Compose View');
    }
    // PHONE: drop down will render based on selected option
    vm.changePHONEType=(index,type)=> {
      //if phone value is already saved and we changed the type (i.e.home to work )then the entry of home type should be removed ,so here active set to false and value goes to blank.
      if(vm.saveContactDetail.phone[index].isSaved){
        vm.saveContactDetail.phone.push({
          type:vm.saveContactDetail.phone[index].type,
          key: vm.saveContactDetail.phone[index].key,
          active: false,
          value: ""
        });
      }
      //here new changed type is assigned and based on that key is created and assigned
      vm.saveContactDetail.phone[index].type = type;
      vm.saveContactDetail.phone[index].key = type + "Phone" + vm.getNextFieldIndex(type + "Phone",'phone',type);
    }

    // SCREEN: drop down will render based on selected option
    vm.changeSCREENType=(index,type)=> {
      //if screen value is already saved and we changed the type (i.e.home to work )then the entry of home type should be removed ,so here active set to false and value goes to blank.
      if(vm.saveContactDetail.screen[index].isSaved){
        vm.saveContactDetail.screen.push({
          type:vm.saveContactDetail.screen[index].type,
          key: vm.saveContactDetail.screen[index].key,
          active: false,
          value: ""
        });
      }
      //here new changed type is assigned and based on that key is created and assigned
      vm.saveContactDetail.screen[index].type = type;
      vm.saveContactDetail.screen[index].key =  "imAddress" + vm.getNextFieldIndex("imAddress",'screen',type);
    }
    // URL: drop down will render based on selected option
    vm.changeURLType=(index,type)=> {
      //if url value is already saved and we changed the type (i.e.home to work )then the entry of home type should be removed ,so here active set to false and value goes to blank.
      if(vm.saveContactDetail.url[index].isSaved){
        vm.saveContactDetail.url.push({
          type:vm.saveContactDetail.url[index].type,
          key: vm.saveContactDetail.url[index].key,
          active: false,
          value: ""
        });
      }
      //here new changed type is assigned and based on that key is created and assigned
      vm.saveContactDetail.url[index].type = type;
      vm.saveContactDetail.url[index].key = type + "URL" + vm.getNextFieldIndex(type + "URL",'url',type);
    }
    // ADDRESS: drop down will render based on selected option
    vm.changeADDRESSType = (index, type) => {
      //if address value is already saved and we changed the type (i.e.home to work )then the entry of home type should be removed ,so here active set to false and value goes to blank.
      if(vm.saveContactDetail.address[index].isSaved){
        vm.saveContactDetail.address.push({
          type:vm.saveContactDetail.address[index].type,
          countryKey:vm.saveContactDetail.address[index].countryKey,
          stateKey: vm.saveContactDetail.address[index].stateKey,
          cityKey:vm.saveContactDetail.address[index].cityKey ,
          streetKey:vm.saveContactDetail.address[index].streetKey,
          postalcodeKey:vm.saveContactDetail.address[index].postalcodeKey,
          active: false,
          value: ""
        });
      }
      //here new changed type is assigned(work) and based on that key is created and assigned
      vm.saveContactDetail.address[index].type = type;
      var nextIndex = vm.getNextAddressIndex(type);
      vm.saveContactDetail.address[index].countryKey = type  + "Country" + nextIndex;
      vm.saveContactDetail.address[index].stateKey = type  + "State" + nextIndex;
      vm.saveContactDetail.address[index].cityKey = type  + "City" + nextIndex;
      vm.saveContactDetail.address[index].postalcodeKey = type  + "PostalCode" + nextIndex;
      vm.saveContactDetail.address[index].streetKey = type  + "Street" + nextIndex;
      vm.saveContactDetail.address[index].index=nextIndex;
    }
    // OTHER: drop down will render based on selected option
    vm.changeOTHERSType = (index, type) => {
      //if other value is already saved and we changed the type (i.e.home to work )then the entry of home type should be removed ,so here active set to false and value goes to blank.
      if(vm.saveContactDetail.others[index].isSaved){
        vm.saveContactDetail.others.push({
          type:vm.saveContactDetail.others[index].type,
          key: vm.saveContactDetail.others[index].key,
          active: false,
          value: ""
        });
      }
      //here new changed type is assigned(work) and based on that key is created and assigned
      vm.saveContactDetail.others[index].type = type;
      vm.saveContactDetail.others[index].key = type  + vm.getNextFieldIndex(type,'others',type);
    }
    //it will find the index value from existing and return its index ,used in address only
    vm.findIndex=(index,type)=>{
      for(let i in  vm.saveContactDetail.address){
        if( vm.saveContactDetail.address[i].index === index && vm.saveContactDetail.address[i].type=== type){
          return i;
        }
      }
      return -1;
    }
    //ADD event(+) in URL : blank value with default type
    vm.addUrl = (index) => {
      vm.saveContactDetail.url.splice(index + 1, 0,{
        value : "",
        type : "home",
        active: true,
        key:"homeURL" + vm.getNextFieldIndex('homeURL','url','home')
      });
    };

    //Remove event(-)in URL :value set to blank and active set to false
    vm.removeUrl = (index) => {
      vm.saveContactDetail.url[index].active = false;
      vm.saveContactDetail.url[index].value="";
    };

    //ADD event(+) in Others: blank value with default type
    vm.addOthers = (index) => {
      vm.saveContactDetail.others.splice(index+1,0,{
        value : "",
        type : "birthday",
        active: true,
        key:"birthday"+vm.getNextFieldIndex('birthday','others','birthday')
      });
    };
    //Remove event(-)in Others :value set to blank and active set to false
    vm.removeOthers = (index) => {
      vm.saveContactDetail.others[index].active = false;
      vm.saveContactDetail.others[index].value="";
    };
    //ADD event(+) in Email: blank value with default type
    vm.addEmail = () => {
      var index = 2;
      while(true){
        if(vm.saveContactDetail.email[index]){
          index++;
          continue;
        }

        vm.saveContactDetail.email[index] = {value:"",active:true,key:"email" + index};
        break;
      }
    };
    //Remove event(-)in Email :value set to blank and active set to false
    vm.removeEmail = (key) => {
      vm.saveContactDetail.email[key].active = false;
      vm.saveContactDetail.email[key].value="";
    };
    //ADD event(+) in Phone: blank value with default type
    vm.addPhone = (index) => {
      vm.saveContactDetail.phone.splice(index + 1, 0,{
        value : "",
        type : "mobile",
        active: true,
        key:"mobilePhone" + vm.getNextFieldIndex('mobilePhone','phone','mobile')
      });
    };
    //Remove event(-)in Phone :value set to blank and active set to false
    vm.removePhone = (index) => {
      vm.saveContactDetail.phone[index].value= "";
      vm.saveContactDetail.phone[index].active=false;
    };
    //ADD event(+) in Address:blank value with default type
    vm.addAddress = (index) => {
      let nextIndex = vm.getNextAddressIndex("home");
      vm.saveContactDetail.address.splice(index + 1, 0 ,{
        type : "home",
        street : "",
        city : "",
        state : "",
        postalcode : "",
        country : "",
        countryKey:"homeCountry"+nextIndex,
        stateKey:"homeState"+ nextIndex,
        cityKey:"homeCity"+ nextIndex,
        streetKey:"homeStreet"+ nextIndex,
        postalcodeKey:"homePostalCode"+nextIndex,
        index:nextIndex
      });
    };
    //Remove event(-)in Address :value set to blank and active set to false
    vm.removeAddress = (index) => {
      vm.saveContactDetail.address[index].state= "";
      vm.saveContactDetail.address[index].city= "";
      vm.saveContactDetail.address[index].postalcode= "";
      vm.saveContactDetail.address[index].country= "";
      vm.saveContactDetail.address[index].street= "";
      vm.saveContactDetail.address[index].active=false;
    };
    //ADD event(+) in IM : blank value with default type
    vm.addScreen= (index) => {
      vm.saveContactDetail.screen.splice(index + 1, 0, {
        value : "",
        type : "xmpp",
        active:true,
        key:"imAddress" + vm.getNextFieldIndex('imAddress','screen','xmpp')
      });
    };
    //Remove event(-)in IM :value set to blank and active set to false
    vm.removeScreen = (index) => {
      vm.saveContactDetail.screen[index].value= "";
      vm.saveContactDetail.screen[index].active=false;
    };

    //Avtar upload while contact create.
    vm.avtarUpload=() => {
        var btn = document.createElement("input");
        btn.setAttribute("type","file");
			  btn.setAttribute("accept","image/*");
			  btn.addEventListener("change",function(){
        mailService.uploadAvatar(btn.files[0], function(res){
        if(res){
            // logger.info("Image "+ btn.files[0].name + " is uploaded.");
            vm.aid=eval(res)[0].aid;
						vm.imgURL=config.SITE_URL+"/api/" +'getAttachment?aid='+ vm.aid;
            vm.createContactRequest.contactAttrs.push({
         					"key" : "image",
         	    	 "value" :vm.aid
         		});
          }
        })
        },false);
      btn.click();
		 }

    //Intialize contact details before edit.
    vm.initializeModifyForm = () => {
      if ($stateParams.contactId) {
        //intialize with blank or default before use it.
        vm.saveContactDetail = {
          email:{"1":{"value":"","key":"email","active":true}},
          url : [],
          phone : [],
          address : [],
          screen : [],
          others : []
        };
        //getIten service request
        let request={
          "id":$stateParams.contactId
        }
        //getItem service
        mailService.getItem(request, function(response){
          var contactDetails= response.cn.a;
          var addressIndexes = [];
          for(let i=0;i<contactDetails.length;i++){

            let key=contactDetails[i].$.n;
            let value=contactDetails[i]._;
            //for email display while edit
            if(key.startsWith("email")){
              let emailKey= key.replace("email","") || "1";
              vm.saveContactDetail.email[emailKey]={value:value,active:true,key:key};
              //image display while edit
            }
            else if (key === 'image') {
              vm.imgURL=config.SITE_URL+"/api/" +'getAttachment?aid='+ value;
              //for address: check for key of city,state,country,postalcode,street
            }
            else if (key.indexOf("City") != -1 || key.indexOf("Street") != -1 || key.indexOf("State") != -1 || key.indexOf("PostalCode") != -1 || key.indexOf("Country") != -1) {
              //check for its type :i.e. home,work or other
              var type = "home";
              if (key.startsWith("work")) {
                type = "work";
              } else if (key.startsWith("other")) {
                type = "other";
              }
              //extract index from key
              var index = key.replace(/^\D+/g,'')||0;
              //extract fieldName from key i.e. homeCity3 -- >city as fieldName
              var fieldName = key.replace(type,"").replace(index,"").toLowerCase();
              //it gives arrayindex for existing value
              let arrayIndex =vm.findIndex(index,type);
              //if arrayIndex not present
              if(arrayIndex === -1){
                let addressDetail={
                  type : type,
                  city : "",
                  state : "",
                  street : "",
                  postalcode : "",
                  country : "",
                  isSaved:true,
                  active:true,
                  countryKey:"",
                  stateKey:"",
                  cityKey:"",
                  streetKey:"",
                  postalcodeKey:"",
                  index:index
                }
                addressDetail[fieldName]=value;
                addressDetail[fieldName+"Key"]=key;
                vm.saveContactDetail.address.push(addressDetail);
                // if arrayIndex is present
              }else{
                vm.saveContactDetail.address[arrayIndex][fieldName]=value;
                vm.saveContactDetail.address[arrayIndex][fieldName+"Key"]=key;
              }
            }
            //check whether phone is already exist,then display it into ui
            else if(key.indexOf("Phone") != -1) {
              vm.saveContactDetail.phone.push({
                type : key.substr(0,key.indexOf("Phone")),
                value : value,
                active:true,
                key:key,
                isSaved:true
              });
              //check whether url is already exist,then display it into ui
            }
            else if(key.indexOf("URL") != -1) {
              vm.saveContactDetail.url.push({
                type:key.substr(0,key.indexOf("URL")),
                active:true,
                key:key,
                value:value,
                isSaved:true
              })
              //check whether birthday is already exist,then display it into ui(date value)
            }
            else if(key.startsWith("birthday")) {
              vm.saveContactDetail.others.push({
                type : "birthday",
                datevalue : new Date(value),
                active: true,
                isSaved:true,
                key:key
              });
              //check whether anniversary is already exist,then display it into ui(date value)
            }
            else if(key.startsWith("anniversary")) {
              vm.saveContactDetail.others.push({
                type : "anniversary",
                datevalue : new Date(value),
                active: true,
                isSaved:true,
                key:key
              });
              //check whether custom is already exist,then display it into ui(text value)
            }
            else if(key.startsWith("custom")) {
              vm.saveContactDetail.others.push({
                type : "custom",
                value : value,
                active: true,
                isSaved:true,
                key:key
              });
              //check whether im address is already exist,then display it into ui
            }
            else if(key.startsWith("imAddress")) {
              //its value in format of "xmpp://bhoomi" so responseValue - bhoomi & type is xmpp
              let responseValue=value.split('//')[1];
              let responseType=value.split(':')[0];

              vm.saveContactDetail.screen.push({
                type : responseType,
                value : responseValue,
                active:true,
                key:key,
                isSaved: true
              });
              //check whether prefix is already exist,then display it into ui
            }
            else if(key === "namePrefix") {
              if(value != ""){
                vm.upperLayout.prefix = true;
                vm.saveContactDetail['prefix'] = value;
              }
              //check whether suffix is already exist,then display it into ui
            }
            else if(key === "nameSuffix") {
              if(value != ""){
                vm.upperLayout.suffix = true;
                vm.saveContactDetail['suffix'] = value;
              }
              //check whether nickname is already exist,then display it into ui
            }
            else if(key === "nickname") {
              if(value != ""){
                vm.upperLayout.nickname = true;
                vm.saveContactDetail['nickname'] = value;
              }
              //check whether maidenName is already exist,then display it into ui
            }
            else if(key === "maidenName") {
              if(value != ""){
                vm.upperLayout.maiden = true;
                vm.saveContactDetail['maiden'] = value;
              }
              //check whether middlename is already exist,then display it into ui
            }
            else if(key === "middleName") {
              if(value != ""){
                vm.upperLayout.middle = true;
                vm.saveContactDetail['middle'] = value;
              }
              //check whether department is already exist,then display it into ui
            }
            else if(key === "department") {
              if(value != ""){
                vm.upperLayout.department = true;
                vm.saveContactDetail['department'] = value;
              }
              //check whether jobtitle is already exist,then display it into ui
            }
            else if(key === "jobTitle") {
              if(value != ""){
                vm.upperLayout.jobTitle = true;
                vm.saveContactDetail['jobTitle'] = value;
              }
            }
            else{
              vm.saveContactDetail[key]=value || '';
            }
          }
          // checking array if no entry found, adding one blank entry.So this field is visible in edit mode.
          if (vm.saveContactDetail.address.length < 1) {
            vm.saveContactDetail.address.push({
              type : "home",
              city : "",
              street : "",
              state : "",
              postalcode : "",
              country : "",
              active:true,
              isSaved:true,
              countryKey:"homeCountry",
              stateKey:"homeState",
              cityKey:"homeCity",
              postalcodeKey:"homePostalCode",
              streetKey:"homeStreet",
              index:0
            });
          }
          if (vm.saveContactDetail.url.length < 1) {
            vm.saveContactDetail.url.push({
              type : "home",
              value : "",
              key: "homeURL",
              active: true
            });
          }

          if (vm.saveContactDetail.phone.length < 1) {
            vm.saveContactDetail.phone
              .push({
                type : "mobile",
                value : "",
                key: "mobilePhone",
                active: true
              });
          }
          if (vm.saveContactDetail.screen.length < 1) {
            vm.saveContactDetail.screen.push({
              type : "xmpp",
              value : "",
              active:true,
              key:"imAddress"
            });
          }
          if (vm.saveContactDetail.others.length < 1) {
            vm.saveContactDetail.others.push({
              type : "birthday",
              value : "",
              key:"birthday",
              active:true
            });
          }
        });
      }
    }
    vm.$scope.$on('editContact', function(event, args) {
      console.info('Edit ....');
      vm.initializeModifyForm();
    });
    //if operation is set to edit then it should be intialize the form value.
    if(vm.operation === 'edit' || (angular.isObject(vm.operation) && vm.operation.operation === 'edit') ){
      vm.initializeModifyForm();
    }
    // create a new contact
    vm.createNewContact =()=>{
      vm.handleCreateContactRequest();
      //create contact request
      let request ={
        "folderId":7,
        "contactAttrs":vm.createContactRequest.contactAttrs
      };

      //create contact service
      mailService.createContact(request, function(res){
        if(res){
          // logger.info("Contact Created.");
          $mdDialog.hide();
          $state.go("contacts");
        }
      })
    }
    //edit Contact
    vm.modifyContact=()=>{
      vm.handleCreateContactRequest();
      //modify contact request
      vm.createContactRequest.contactAttrs = _.filter(vm.createContactRequest.contactAttrs, function(attr) { return attr.key.length > 0; });
      let request={
        "id":$stateParams.contactId,
        "replace" : "0",
        "contactAttrs":vm.createContactRequest.contactAttrs
      }
      //modify contact service
      mailService.modifyContact(request,function(response){
        if(response){
          // logger.info("Contact Saved.");
          $mdDialog.hide();
          $state.go("contacts");
        }
      });
    }
    /* add hotkeys */
    hotkeys.add({
      combo: ['enter', 'space'],
      callback: function( ) {
          vm.modifyContact();
      }
    });
    hotkeys.add({
      combo: ['ctrl+s'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function( ) {
        event.preventDefault();
          if(vm.operation !== 'edit'){
              vm.createNewContact();
          } else {
              vm.modifyContact();
          }
      }
    });

    hotkeys.add({
      combo: ['esc'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(event) {
        vm.cancel();
      }
    });

    hotkeys.add({
      combo: ['ctrl+m'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function( ) {
        vm.avtarUpload();
      }
    });

    hotkeys.add({
      combo: ['ctrl+x'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(event) {
        event.preventDefault();
        $('body').attr("spellcheck",true);
      }
    });

    hotkeys.add({
      combo: ['y'],
      callback: function( ) {
          yes()
      }
    });
    hotkeys.add({
      combo: ['n'],
      callback: function( ) {
        no()
      }
    });

  }

  _savingContactModalController($rootScope, $mdDialog) {
    var vm = this;
    vm.yes = () => {
      // save contact
      $mdDialog.hide(true, $rootScope);
      $rootScope.$broadcast('CREATE_CONTACT');
    };

    // not saving draft
    vm.no = () => {
      $mdDialog.hide(false);
      $rootScope.$broadcast('CLOSE_CONTACT_COMPOSE');
    };

    // continue to edit email
    vm.cancel = () => {
      $mdDialog.cancel('cancel');
    };
  }
}
export default ContactComposeController;
