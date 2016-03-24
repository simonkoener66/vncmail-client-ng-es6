const MAILSERVIE = new WeakMap();
const SIDEBARSERVIE = new WeakMap();

class TagContextMenu {
  constructor(mailService, sidebarService) {
    this.mailService = mailService;
    this.sidebarService = sidebarService;
  }

  createNewTag() {
    return this.sidebarService.getTag({}, (tags, err) => {
      if (tags) {
        return tags;
        //this.tagList = this.generateContextItemListForTagData(tags, eventName);
        // Save new tags list to localStorage
        //localStorage.setItem('tagList', JSON.stringify(tags));
      }
    });
  }
}

export default TagContextMenu;
