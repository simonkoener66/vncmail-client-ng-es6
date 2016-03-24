# VNCUxf - Email Client

## About

- VNCuxf application Theme. This is the first of a series of redesigns for the VNCuxf project.
- This projects first focus is the mail client.
- This project will be the basis for future projects in VNCuxf webapplication suite.
- The eventual components will include the following:
    - Contacts
    - Calendar
    - Tasks
    - Preferences
- Mockups are located [here](https://collaboration.vnc.biz/vnc-internal/vnc-development/vncuxf-development-issues/visual-design/visual-design-vncuxf-mail-cw/vncuxf-mail-final-version/mockups-final)
- [Repository](ssh://www-data@redmine.vnc.biz/vnc-vncuxf-frontend-app)
- [Issues](https://redmine.vnc.biz/projects/vnc-vncuxf-frontend-app/issues)
- [Requirements Document]()
- [Pattern Library]()

### Basis of stack

- Webpack - 1.12.2 - Module Loader / Workflow Manager
- Angular - 1.4.6 - Client Side JS Framework
- Node - 4.3.1 - Node server for consuming SOAP API's from Zimbra
- NPM - 2.11.3 - Package Management Tool for application dependencies.
- ES6 - JavaScript 2015
- SASS - CSS Preprocessor
- JSHint - Javascript coding standards

## Developer Instructions

### Environment Setup

- First step with any VNC Project is to make sure that your Project Manager(PM), always sets up your permissions in the proper Redmine Project.
- Once that is done make sure to add an SSH key to your account on Redmine -note: it can take serveral minutes for the key to register.-
- Once your key is added you must clone the repository. There are very good instructions for how to do this on VNC Portal [link](https://collaboration.vnc.biz/vnc-internal/documentation/vncuxf-development-guides/vncuxf-development-environment-setup-guide)
- Now clone the repository into your local environment.
- Prerequisites for using this tool chain are the following:
    - [NodeJs](https://nodejs.org/en/) - It is highly recommended that you install nvm first so you can switch between Node versions easily. There is an .nvmrc file in this directory just type ```nvm use``` to use the recommended version.
        - This project uses the latest stable version of NodeJS at the time of creation 4.1.1 so please ensure this version is installed and that you are using it for this project.
        - NodeJS 4.3.1 comes with the latest version of NPM 2.11.3
    - [Webpack](https://webpack.github.io/) - Installing this globally is recommended
    - [EditorConfig](http://editorconfig.org/#download) - Please make sure you have the editor config package installed as this provides consistency in all editing environments. There are packages and plug-ins for all major editors.
- Once these requirements are met run ```npm install``` from the command line.
    - Never run npm with sudo it will break eventually on you and project builds will get messed up.
- After NPM finishes you can now run a development server ```npm start```
- This will fire up a local development server serving up all the static assets, it will be available at localhost:3000.
- To run the live version point the browser to localhost:3000\webpack-dev-server\
    - Note: This is running in an iFrame so if you need to debug fully use the base directory.
- To run tests just type ```npm run test```
- For production build into build folder ```npm run build```
    - The build task will minify and uglify our JS so we will need to make sure we are using annotations correctly.
    - It copies the images directory to the build folder.
    - It copies the index.html file to the build folder.

### Committing Instructions

- Summary
    - We consider origin/master to be the main branch where the source code of HEAD always reflects a production-ready state.
    - We consider origin/development to be the main branch where the source code of HEAD always reflects a state with the latest delivered development changes for the next release. Some would call this the “integration branch”. This is where any automatic nightly builds are built from.
    - When development branch is stable it is merged into master and then tagged with a release no.
    - Therefore, each time when changes are merged back into master, this is a new production release by definition.
- Feature and BugFix branches
    - Description
        - Feature branches (or sometimes called topic branches) are used to develop new features for the upcoming or a distant future release.
        - May branch off from:
            - development
        - Must merge back into:
            - development
        - Branch naming convention:
            - feature/Issue-No-XXXX-Description (Bugfix would be bugfix/Issue-No-XXXX-Description)
    - Creation
        - $ git checkout -b feature/Issue-No-XXXX-Description develop
    - Pull Request
        - Make sure to pull in the latest changes from the remote development branch into your feature branch then.
        - $ git push -u origin feature/Issue-No-XXXX-Description develop
        - Assign pull request review to the developer who committed last to the development branch.
        - Once review is complete =>
    - Merging
        - $ git pull feature/Issue-No-XXXX-Description
        - $ git checkout development
        - $ git pull origin development
        - $ git merge --no-ff feature/Issue-No-XXXX-Description
        - $ git branch -d feature/Issue-No-XXXX-Description
        - $ git push origin :feature/Issue-No-XXXX-Description
        - $ git push origin develop
- Release Branches
    - Description
        - Release branches support preparation of a new production release.
        - May branch off from:
            - development
        - Must merge back into:
            - development and master
        - Branch naming convention:
            - release--
    - Creation
        - $ git checkout -b release-1.2 develop
        - $ ./bump-version.sh 1.2
        - $ git commit -a -m "Bumped version number to 1.2"
        - NOTE: we still need to create the version bumping shell script.
    - Finishing the release
        - $ git checkout master
        - $ git merge --no-ff release-1.2
        - $ git tag -a 1.2
    - Now the hard part
        - To keep these changes live they need to be merged back into the develop branch
        - $ git checkout develop
        - $ git merge --no-ff release-1.2
        - Most likely you will need to deal with merge conflicts especially if developers are still moving forward while a release is being performed. Please be cautious and deal with conflicts accordingly making sure to stay in contact with Developers when there are any questions.
        - $ git branch -d release-1.2
        - We can now delete this branch since it is no longer needed and it will be in our commit history.
- BugFixes.
    - We will avoid hotfix branches and unplanned releases for now since there are no clients for this product yet.

### Commenting instructions

1. When commenting code there is no need to comment on code that is producing obvious results.
```
    // get the country code
    $country_code = get_country_code($_SERVER['REMOTE_ADDR']);
```
2. Try to comment on the logic of the code, help others reason about what you are trying to accomplish.
3. We will institute auto-documentation so you don't have describe every param for every function. Again focus on what it does.
4. If you read the first rule and are asking yourself if you should write a comment. Write the comment, it is better to have too many than too few.
5. Use comments to help you group your code into related chunks.
```
    // get list of forums
    $forums = array();
    $r = mysql_query("SELECT id, name, description FROM forums");
    while ($d = mysql_fetch_assoc($r)) {
        $forums []= $d;
    }

    // load the templates
    load_template('header');
    load_template('forum_list',$forums);
    load_template('footer');
```
6. When it is a complicated function be descriptive of what it does and why it is there. Here is a great example from the Angular 2 project, that tells you what it does, the options for the user, and how to use it in code.
```
  /**
   * Exercises change detection in a loop and then prints the average amount of
   * time in milliseconds how long a single round of change detection takes for
   * the current state of the UI. It runs a minimum of 5 rounds for a minimum
   * of 500 milliseconds.
   *
   * Optionally, a user may pass a `config` parameter containing a map of
   * options. Supported options are:
   *
   * `record` (boolean) - causes the profiler to record a CPU profile while
   * it exercises the change detector. Example:
   *
   * ```
   * ng.profiler.timeChangeDetection({record: true})
   * ```
   */
```

### Coding Instructions

#### Naming Conventions

1. Classes:
  - Example: `Compiler`, `ApplicationMetadata`
  - Camel case with first letter upper-case
  - In general prefer single words. (This is so that when appending `Proto` or `Factory` the class
    is still reasonable to work with.)
  - Should not end with `Impl` or any other word which describes a specific implementation of an
    interface.

2. Methods and functions:
  - Example: `bootstrap`, `someMethod`
  - Should be camel case with first lower case

3. Constants
  - Example: `CORE_DIRECTIVES`
  - Should be all uppercase with SNAKE_CASE

#### Testing Requirements
- A unit test should be written for all elements of the app that contain logic.
    - Frameworks
        - Karma, Mocha, Chai
- E2E tests should be written for view to check for expected output
        - Protractor, Jasmine

