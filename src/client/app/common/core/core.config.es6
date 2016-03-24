import angular from 'angular';
import coreModule from './core.module';
import angularTranslate from 'angular-translate';

let testURL = '';
let testWs = '';
let zimbraAPI = '';

if (ON_PROD) {
    testURL = 'https://uxfdev.vnc.biz:8001';
    zimbraAPI = 'https://uxfdev.vnc.biz:8001/api';
    testWs = 'wss://uxfdev.vnc.biz:8001';
} else {
    testURL = 'http://localhost:8001';
    zimbraAPI = 'http://localhost:8001/api';
    testWs = 'ws://localhost:8001';
}

var config = {
    appErrorPrefix: '[vncuxf Error] ',
    appTitle: 'VNCuxf',
    SITE_URL: testURL,
    SITE_WS: testWs,
    ENVIRONMENT: 'development'
};

var vncConstant = {
    ICON: {
      chat: '../images/Icons_Contactlist/ic_chat_black.svg',
      close: '../images/ic_close_black_24px.svg',
      add: '../images/ic_add_black_24px.svg',
      search: '../images/ic_search_black_24px.svg',
      setting: '../images/ic_settings_black_24px.svg',
      setting1: '../images/ic_settings_black_24px.svg',
      setting2: '../images/ic_settings_black_24px.svg',
      collaboration: '../images/ic_playlist_add_black_24px.svg',
      createGroup: '../images/ic_playlist_add_black_24px.svg',
      videocam: '../images/ic_videocam_black_24px.svg',
      shareFile: '../images/ic_attach_file_black_24px.svg',
      invite: '../images/ic_attach_file_black_24px.svg',
      drafts: '../images/drafts.svg',
      junk: '../images/junk.svg',
      trash: '../images/trash.svg',
      inbox: '../images/inbox.svg',
      sent: '../images/sent.svg',
      calendar: '../images/calendar-icon.svg',
      contacts: '../images/account-icon.svg',
      tasks: '../images/task-icon.svg',
      emailed_contacts: '../images/ic_contact_mail_black_24px.svg'
    },
    SETTINGS: {
      defaultMaxMamMessages: 'biz::vnc::settings::xmpp::default_max_mam_messages',
      maxMamMessages: 'biz::vnc::settings::xmpp::max_mam_messages',
      inviteEnabled: 'biz::vnc::settings::xmpp::chat_invite_contact_enabled',
      collaborationEnabled: 'biz::vnc::settings::xmpp::groupchat_document_collaboration_enabled'
    },
    USER_PALETTE: {
      A: '#c9d0bc',
      B: '#7595bb',
      C: '#3e4a62',
      D: '#b56092',
      E: '#7a8b76',
      F: '#604c47',
      G: '#a4b161',
      H: '#809aa5',
      I: '#afcdd9',
      J: '#abc27b',
      K: '#3d583d',
      L: '#d3c182',
      M: '#e4b737',
      N: '#ca6d6e',
      O: '#50a3b8',
      P: '#6ad2d1',
      Q: '#b6afbc',
      R: '#c8bdb1',
      S: '#443b5e',
      T: '#9c775e',
      U: '#eacda7',
      V: '#adddc5',
      W: '#bfba9f',
      X: '#730f17',
      Y: '#7a9e70',
      Z: '#b1b36a'
    },
    FACTORY_PALETTE: {
      A: '#c9d0bc',
      B: '#7595bb',
      C: '#3e4a62',
      D: '#b56092',
      E: '#7a8b76',
      F: '#604c47',
      G: '#a4b161',
      H: '#809aa5',
      I: '#afcdd9',
      J: '#abc27b',
      K: '#3d583d',
      L: '#d3c182',
      M: '#e4b737',
      N: '#ca6d6e',
      O: '#50a3b8',
      P: '#6ad2d1',
      Q: '#b6afbc',
      R: '#c8bdb1',
      S: '#443b5e',
      T: '#9c775e',
      U: '#eacda7',
      V: '#adddc5',
      W: '#bfba9f',
      X: '#730f17',
      Y: '#7a9e70',
      Z: '#b1b36a'
    },
    ZimbraAPI: zimbraAPI,
    Zimbra: {
        'context': {
            '_jsns': 'urn:zimbra',
            'authToken': {
                _content: localStorage.getItem('ZM_AUTH_TOKEN')
            }
        }
    },
    ZimbraAccount: {
        'context': {
            '_jsns': 'urn:zimbraAccount'
        }
    },
    AuthRequestBody: {
        'AuthRequest': {
            '_jsns': 'urn:zimbraAccount',
            'persistAuthTokenCookie': 1,
            'account': {
                'by': 'name',
                '_content': ''
            },
            'password': {
                '_content': ''
            }
        }
    },
    GetAccountInfoRequest: {
        'GetAccountInfoRequest': {
            '_jsns': 'urn:zimbraAccount',
            'account': {
                'by': 'name',
                _content: ''
            }
        }
    },
    GetInfoRequest: {
        'GetInfoRequest': {
            '_jsns': 'urn:zimbraAccount',
            'sections': 'attrs'
        }
    },
    FOLDERID: {
        BRIEFCASE: 16,
        CALENDAR: 10,
        CHATS: 14,
        CONTACTS: 7,
        DRAFTS: 6,
        EMAILED_CONTACTS: 13,
        INBOX: 2,
        JUNK: 4,
        SENT: 5,
        TASKS: 15,
        TRASH: 3
    },
    SEARCH_CRITERIA: {
        HAS_ATTACHMENT: 'has:attachment',
        IS_FLAGLED: 'is:flagged',
        IS_UNREAD: 'is:unread',
        IN_INBOX: 'in:inbox',
        IN_JUNK: 'in:junk',
        IN_TRASH: 'in:trash',
        IN_DRAFTS: 'in:drafts',
        IN_SENT: 'in:sent',
        FROM: 'from',
        TO: 'to',
        BEFORE_DATE: 'before',
        AFTER_DATE: 'after',
        ON_DATE: 'date',
        ATTACHMENT_PDF: 'type:application/pdf',
        ATTACHMENT_APPLICATION: 'type:application/*',
        ATTACHMENT_HTML: 'type:text/html',
        ATTACHMENT_IMAGE: 'type:image/*',
        ATTACHMENT_MAIL: 'type:message/rfc822',
        ATTACHMENT_TEXT: 'type:text',
        SIZE_LARGER: 'larger:',
        SIZE_SMALLER: 'smaller:',
        SUBJECT: 'has:subject',
        TAG: 'tag:',
        FOLDER: 'is:'
    },
    APPOINTMENT_VERBS: {
        ACCEPT: 'ACCEPT',
        COMPLETED: 'COMPLETED',
        DECLINE: 'DECLINE',
        DELEGATED: 'DELEGATED',
        TENTATIVE: 'TENTATIVE'
    },
    COLOR_CODES : [
         null,
        'BLUE',
        'CYAN',
        'GREEN',
        'PURPLE',
        'RED',
        'YELLOW',
        'PINK',
        'GRAY',
        'ORANGE'
    ]
};

let coreConfigComponent = angular.module('core.app')

.constant('vncConstant', vncConstant)
.value('config', config)
.config(configure)
.config(mdThemeConfig)
.run(initialize);

configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider', '$httpProvider', 'moment'];
initialize.$inject = ['auth', '$rootScope', 'config', '$mdToast'];
/* @ngInject */
function initialize(auth, $rootScope, config, $mdToast){
    $rootScope.API_URL = config.SITE_URL + "/api";
    auth.initialize($rootScope.API_URL, false);

    document.addEventListener('callToastInfo', function(event){
        $mdToast.show(
          $mdToast.simple()
            .textContent(event.detail)
            .hideDelay(3000)
            .theme('info-toast')
        );
    });

    document.addEventListener('callToastSuccess', function(event){
        $mdToast.show(
          $mdToast.simple()
            .textContent(event.detail)
            .hideDelay(3000)
            .theme('success-toast')
        );
    });
    document.addEventListener('callToastError', function(event){
        $mdToast.show(
          $mdToast.simple()
            .textContent(event.detail)
            .hideDelay(3000)
            .theme('error-toast')
        );
    });
    document.addEventListener('callToastWarning', function(event){
        $mdToast.show(
          $mdToast.simple()
            .textContent(event.detail)
            .hideDelay(3000)
            .theme('warning-toast')
        );
    });
}

/* @ngInject */
function configure( $logProvider, routerHelperProvider, exceptionHandlerProvider, $httpProvider, moment ) {
    if ($logProvider.debugEnabled) {
        $logProvider.debugEnabled(true);
    }

    moment.locale('de');

    exceptionHandlerProvider.configure(config.appErrorPrefix);
    routerHelperProvider.configure({docTitle: config.appTitle + ': '});
    delete $httpProvider.defaults.headers.common["X-Requested-With"];

    $httpProvider.defaults.headers.common['Accept'] = 'application/json';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
}

mdThemeConfig.$inject = ['$mdThemingProvider'];
/* @ngInject */
function mdThemeConfig($mdThemingProvider) {
  $mdThemingProvider.definePalette('vncBlue', {
    '50': 'E3F2FD',
    '100': 'BBDEFB',
    '200': '90CAF9',
    '300': '64B5F6',
    '400': '42A5F5',
    '500': '2196F3',
    '600': '1E88E5',
    '700': '1976D2',
    '800': '1565C0',
    '900': '022A43',
    'A100': '82B1FF',
    'A200': '448AFF',
    'A400': '2979FF',
    'A700': '2962FF',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  $mdThemingProvider.definePalette('vncGreen', {
    '50': 'E8F5E9',
    '100': 'C8E6C9',
    '200': 'A5D6A7',
    '300': '81C784',
    '400': '66BB6A',
    '500': '6DA21B',
    '600': '43A047',
    '700': '388E3C',
    '800': '2E7D32',
    '900': '1B5E20',
    'A100': 'B9F6CA',
    'A200': '69F0AE',
    'A400': '00E676',
    'A700': '00C853',
    'contrastDefaultColor': 'dark',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastLightColors': ['500', '600', '700', //hues which contrast should be 'dark' by default
     '800', '900']
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('teal', {
      'default': '500'
    });
}

export default coreConfigComponent;
