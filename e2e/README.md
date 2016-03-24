Pre-requisite
  - Following packages needs to be pre-installed.
    1. Node Js
       https://nodejs.org/en/download/package-manager/

    2. Protractor
       Command : npm install -g protractor
                 webdriver-manager update
       Reference : https://angular.github.io/protractor/#/

    3. ScreenShotReporter
       Command : npm install protractor-screenshot-reporter --save-dev
       Reference : https://github.com/swissmanu/protractor-screenshot-reporter

    4. HtmlReporter
       Command : npm install protractor-html-screenshot-reporter --save-dev
       Reference : https://www.npmjs.com/package/protractor-html-screenshot-reporter

Starting Selenium server
  Command : webdriver-manager start
  NOTE: Do not close the terminal window.

Executing Automation test.

Step 1.
   Clone the project.

Step 2.
   Configure conf file. (e2e/conf/conf.js)
      1. Configure UXF server address
            serverUrl : "URL of server where latest uxf code is running."

      2. Configure Credentials
            username : "Username to login "
            password : "Pasword to login  "

Step 3.
  - Execute follwing command from e2e/conf/conf.js to run all the test at once
            protractor conf.js

  - Following is the command to run test suite wise
      e.g. only mail left panel test should be executed
            protractor conf.js --suite=mailLeftPanelTest

Steps 4.
  Detailed repoert can be found in /tmp/screenshot folder.
