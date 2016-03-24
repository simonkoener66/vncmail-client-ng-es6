var router = require('express').Router();
var four0four = require('./utils/404')();
var controllers = require('./controllers');
var multiparty = require('connect-multiparty'),
    multipartMiddleware = multiparty();

//Account
router.post('/authToken', controllers.account.getAuthToken);
router.get('/getInfo', controllers.account.getInfo);
router.post('/changePassword', controllers.account.changePassword);
router.post('/getAccountDistributionLists', controllers.account.getAccountDistributionLists);
router.post('/getDistributionList', controllers.account.getDistributionList);
router.post('/getDistributionListMembers', controllers.account.getDistributionListMembers);
router.post('/uploadAvatar', multipartMiddleware, controllers.account.uploadAvatar);
router.post('/logout', controllers.account.logout);


//Mail
router.get('/getContacts', controllers.mail.getContacts);
router.get('/getTagList', controllers.mail.getTag);
router.post('/createTag', controllers.mail.createTag);
router.post('/saveDraft', controllers.mail.saveDraft);
router.post('/searchRequest', controllers.mail.searchRequest);
router.post('/searchConvRequest', controllers.mail.searchConvRequest);
router.post('/getMsgRequest', controllers.mail.getMsgRequest);
router.post('/getFolderList', controllers.mail.getFolderList);
router.post('/autocomplete', multipartMiddleware, controllers.mail.autocomplete);
router.post('/sendEmail', controllers.mail.sendEmail);
router.post('/createFolder', controllers.mail.createFolder);
router.post('/createContact', controllers.mail.createContact);
router.post('/modifyContact', controllers.mail.modifyContact);
router.post('/contactAction', controllers.mail.contactAction);
router.get('/getAvatar', controllers.mail.getAvatar);
router.get('/getAttachment', controllers.mail.getAttachment);
router.post('/noOp', controllers.mail.noOp);
router.post('/upload', multipartMiddleware, controllers.mail.upload);
router.post('/messageAction', multipartMiddleware, controllers.mail.messageAction);
router.post('/folderAction', controllers.mail.folderAction);
router.post('/tagAction', controllers.mail.tagAction);
router.post('/getItem', controllers.mail.getItem);
router.post('/createTask', controllers.mail.createTask);
router.post('/modifyTask', controllers.mail.modifyTask);
router.post('/cancelTask', controllers.mail.cancelTask);
router.post('/itemAction', controllers.mail.itemAction);
router.post('/setMailboxMetadata', controllers.mail.setMailboxMetadata);
router.get('/printTask', controllers.mail.printTask);

// Contact
router.get('/printContact', controllers.mail.printContact);
router.get('/printMessage', controllers.mail.printMessage);

router.post('/sendInviteReply', controllers.mail.sendInviteReply);
router.post('/convAction', multipartMiddleware, controllers.mail.convAction);
router.post('/cancelAppointment', multipartMiddleware, controllers.mail.cancelAppointment);
router.post('/createAppointment', multipartMiddleware, controllers.mail.createAppointment);
router.post('/modifyAppointment', multipartMiddleware, controllers.mail.modifyAppointment);
router.post('/getFreeBusy', controllers.mail.getFreeBusy);
router.post('/getWorkingHours', controllers.mail.getWorkingHours);
router.post('/sendShareNotification', controllers.mail.sendShareNotification);
router.get('/getSpellDictionaries', controllers.mail.getSpellDictionaries);
router.post('/checkSpelling', controllers.mail.checkSpelling);
router.post('/batchRequest', controllers.mail.batchRequest);
router.post('/getPrefs', controllers.mail.getPrefs);
router.post('/bounceMsg', controllers.mail.bounceMsg);

router.post('/createSignature', controllers.preference.createSignature);
router.post('/importContacts', multipartMiddleware, controllers.preference.importContacts);
router.get('/exportContacts', controllers.preference.exportContacts);

router.get('/*', four0four.notFoundMiddleware);



module.exports = router;
