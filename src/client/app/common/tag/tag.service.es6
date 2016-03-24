let tagService = function( mailService, logger, vncConstant, sidebarService, $rootScope, $state ){

  let tags = [];

  this.getTags = () => {
    return tags;
  };

  this.createNewTag = (tag, cb) => {
    let vm  = this;
    sidebarService.createTag(tag, (res, err) => {
      if (err) {
        cb && cb(null, err);
      }
      else {
        tags.push(res.tag);
        // order tag list by name
        tags.sort((firstItem, secondItem) => {
          return (
            (firstItem.$.name > secondItem.$.name && !firstItem.$.name.startsWith('+') && !secondItem.$.name.startsWith('+'))
              ? 1
              : -1);
        });
        cb && cb(res, null);
      }
    });
  };

  this.removeTag = (id, name, cb) => {
    let vm  = this;
    mailService.deleteTag(id, (res) => {
      if(res){
        // logger.info('The ' + name + ' tag was removed successfully.');
        tags = tags.filter(function(x){
          if(x.$.id != id) return x;
        });
        cb(res);
      }
    }).catch((error) => {
      cb(null , error);
      logger.error(error.data.msg);
    });
  };

  this.renameTag = (id, name, cb) => {
    let vm  = this;
    mailService.renameTag({id, name}, (res) => {
      if(res){
        // logger.info('The ' + name + ' tag was renamed successfully.');
        tags = tags.map(function(x){
          if(x.$.id == id) x.$.name = name;
          return x;
        });
        cb(res);
      }
    }).catch((error) => {
      cb(null, error.data);
    });
  };

  this.changeTagColor = (options, cb) => {
    let vm  = this;
    mailService.changeTagColor(options, (res) => {
      if(res){
        // logger.info('Tag color changed successfully.');
        tags = tags.map(function(x){
          if(x.$.id == options.id) x.$.rgb = options.rgb;
          return x;
        });
        cb(res);
      }
    }).catch((error) => {
      cb(null, error.data);
    });
  };


  this._getTagList = () => {
    let vm = this;
    return sidebarService.getTag({}, (res, error) => {
      if (res) {
        if (!angular.isArray(res)) {
          tags.push(res); // response is an object, not an array
        } else {
          tags = res;
        }

        for(let tag of tags) {
          if (tag.$.color) {
            tag.$.rgb = vncConstant.COLOR_CODES[tag.$.color];
          }
        }

        // order tag list by name
        tags.sort((firstItem, secondItem) => {
          return (
            (firstItem.$.name > secondItem.$.name && !firstItem.$.name.startsWith('+') && !secondItem.$.name.startsWith('+'))
              ? 1
              : -1);
        });
      }

      // Save new tags list to localStorage
      localStorage.setItem('tagList', JSON.stringify(tags));
    });
  };

  this._getTagList();

  this._splitTags = (tagNamesString) => {
    let vm = this;
    let tagNameArray = [];
    let tagArray = [];
    let tagNumber = 0;

    if (tagNamesString && tagNamesString !== '') {
      if(!(typeof tagNamesString == 'string')){
        return;
      }
      tagNameArray = tagNamesString.split(',');

      for(let tagName of tagNameArray) {
        for(let tag of tags) {
          if (tag.$.name === tagName) {
            tagArray.push(tag);
          }
        }
      }
    }
    else tagArray = [];

    // Order by tag name
    tagArray.sort(function (a, b) {
      return ((a.$.name > b.$.name && !a.$.name.startsWith('+') && !b.$.name.startsWith('+')) ? 1 : -1);
    });
    return tagArray;
  };

  /* Add new tag to conversation */
  this.tagConversation = (mail, tag, parentIndex) => {
    mailService.assignTagToConversation(mail.cid, tag.$.name, (res, err) => {
      if (err) {
        logger.error(err.msg);
      }
      else {
        mail.tags.push(tag);
        $rootScope.$broadcast('event:mail-tag-updated', tag, parentIndex, 'add');
        logger.success('1 conversation tagged "' + tag.$.name + '"');
      }
    });
  };

  /* remove tag from conversation */
  this.removeTagFromConversation = (mail, tagName, index, parentIndex) => {
    mailService.removeTagFromConversation(mail.cid, tagName, (res, err) => {
      if (err) {
        logger.error(err.msg);
      }
      else {
        mail.tags.splice(index, 1);
        $rootScope.$broadcast('event:mail-tag-updated', index, parentIndex, 'remove');
        logger.success('Tag "' + tagName + '" removed from 1 conversation');
      }
    });
  };

  /* Remove all tag in conversation */
  this.removeAllTagFromConversation = (mail, parentIndex) => {
    mailService.removeAllTagInConversation(mail.cid, (res, err) => {
      if (err) {
        logger.error(err.msg);
      }
      else {
        mail.tags = [];
        $rootScope.$broadcast('event:mail-tag-updated', undefined, parentIndex, 'all');
        logger.success('All Tags removed successfully.');
      }
    });
  };

  /* Add new tag to contact */
  this.tagContact = (contact, tag) => {
    mailService.assignTagToContact(contact.id, tag.$.name, (res, err) => {
      if (err) {
        logger.error(err.msg);
      }
      else {
        contact.tags.push(tag);
        $rootScope.$broadcast('event:contact-tag-updated', tag, 'add');
        logger.success('1 contact tagged "' + tag.$.name + '"');
      }
    });
  };

  /* remove tag from contact */
  this.removeTagFromContact = (contact, tagName, index) => {
    mailService.removeTagInContact(contact.id, tagName, (res, err) => {
      if (err) {
        logger.error(err.msg);
      }
      else {
        contact.tags.splice(index, 1);
        $rootScope.$broadcast('event:contact-tag-updated', index, 'remove');
        logger.success('Tag "' + tagName + '" removed from 1 contact');
      }
    });
  };

  /* Remove all tag in contact */
  this.removeAllTagFromContact = (contact) => {
    mailService.removeAllTagInContact(contact.id, (res, err) => {
      if (err) {
        logger.error(err.msg);
      }
      else {
        contact.tags = [];
        $rootScope.$broadcast('event:contact-tag-updated',  undefined, 'all');
         logger.success('All Tags removed from contact.');
      }
    });
  };

  /* Add new tag to task */
  this.tagTask = (task, tag, key, id, isDetail) => {
    mailService.assignTagToTask(task.taskInvId, tag.$.name, (res, err) => {
      if (err) {
        logger.error(err.msg);
      }
      else {
        task.tags.push(tag);
        isDetail && $rootScope.$broadcast('event:task-tag-updated', tag, 'add', key, id);
        isDetail || ($state.params.taskInvId == task.taskInvId && $rootScope.$broadcast('event:task-detail-tag-updated', tag, 'add'));
        logger.success('1 task tagged "' + tag.$.name + '"');
      }
    });
  };

  /* remove tag from task */
  this.removeTagFromTask = (task, index, tag, key, id, isDetail) => {
    mailService.removeTagFromAppointment(task.taskInvId, tag.$.name, (res, err) => {
      if (err) {
        logger.error(err.msg);
      }
      else {
        task.tags.splice(index, 1);
        isDetail && $rootScope.$broadcast('event:task-tag-updated', tag, 'remove', key, id);
        isDetail || ($state.params.taskInvId == task.taskInvId && $rootScope.$broadcast('event:task-detail-tag-updated', tag, 'remove'));
         logger.success('Tag "' + tag.$.name + '" removed from 1 task');
      }
    });
  };

  /* Remove all tag in task */
  this.removeAllTagFromTask = (task, key, id, isDetail) => {
    mailService.removeAllTagFromAppointment(task.taskInvId, (res, err) => {
      if (err) {
        logger.error(err.msg);
      }
      else {
        task.tags = [];
        isDetail && $rootScope.$broadcast('event:task-tag-updated', undefined, 'all', key, id);
        isDetail || ($state.params.taskInvId == task.taskInvId && $rootScope.$broadcast('event:task-detail-tag-updated', undefined, 'all'));
         logger.success('All Tags removed from task.');
      }
    });
  };

};

tagService.$inject = ['mailService', 'logger', 'vncConstant', 'sidebarService', '$rootScope', '$state'];
/*@ngInject*/

export default tagService;
