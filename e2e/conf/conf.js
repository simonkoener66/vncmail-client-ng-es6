//conf.js

var ScreenShotReporter = require('protractor-screenshot-reporter');
var HtmlReporter = require('protractor-html-screenshot-reporter');

exports.config = {
  seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
  allScriptsTimeout: 200000,
  getPageTimeout : 200000,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  framework: 'jasmine',

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['../tests/*.js'],
  suites: {
    loginTest: ['../tests/loginTest.js'],
    mailLeftPanelTest:['../tests/mailLeftPanelTest.js'],
    mailListPanelTest:['../tests/mailListPanelTest.js'],
    mailDetailPanelTest:['../tests/mailDetailPanelTest.js'],
    navigationTest:['../tests/navigationTest.js'],
    contactLeftPanelTest:['../tests/contactLeftPanelTest.js'],
    contactListPanelTest:['../tests/contactListPanelTest.js'],
    contactDetailPanelTest:['../tests/contactDetailPanelTest.js'],
  },

    params: {
      serverUrl:{
        url: 'http://localhost:3000'
      },
      inputData:{
        username: 'mike@zuxfdev.vnc.biz',
        password: '8MgYX62104Sm'

      }
    },
  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 40000
  },


    onPrepare: function() {
       // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
         jasmine.getEnv().addReporter(new ScreenShotReporter({
            baseDirectory: '/tmp/screenshots'
         }));
      },

    onPrepare: function() {
      // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
        jasmine.getEnv().addReporter(new HtmlReporter({
           baseDirectory: '/tmp/screenshots'
        }));
   },
};
