var homePage = function(){
  this.get = function(){
    browser.get(browser.params.serverUrl.url);
    browser.driver.manage().window().maximize();
    expect(browser.getCurrentUrl()).toEqual(browser.params.serverUrl.url+'/login');
  };
};
module.exports = new homePage();
