const express     = require('express');
const urlencode   = require('urlencode');
const date        = require('date-and-time');

var admin          = require('../controllers/admin');

const router        = express.Router();
const path          = require('path');
var   prInj         = require('../helpers/prInj');
var   Models        = require('../models/Models');

router.route('/').get(admin.dash);
router.route('/changePass').post(admin.changePass);


// Free Arts
router.route('/freeArt/new/:type').get(admin.newFreeArt);
router.route('/freeArt/new/create/:type').post(admin.createFreeArt);
router.route('/freeArt/list/:type').get(admin.list);
router.route('/freeArt/changeStatus').post(admin.changeStatus);
router.route('/freeArt/:id/edit').get(admin.edit);
router.route('/freeArt/:id/update').post(admin.update);



// Videos
router.route('/vArt/new').get(admin.vArtNew);
router.route('/vArt/create').post(admin.vArtCreate);
router.route('/vArt/list').get(admin.vArtList);
router.route('/vArt/changeStatus').post(admin.vArtChangeStatus);
router.route('/vArt/:id/edit').get(admin.vArtEdit);
router.route('/vArt/:id/update').post(admin.vArtUpdate);

// sliders
router.route('/sliders/new').get(admin.slidersNew);
router.route('/sliders/create').post(admin.slidersCreate);
router.route('/sliders/list').get(admin.slidersList);
router.route('/sliders/changeStatus').post(admin.slidersChangeStatus);
router.route('/sliders/:id/edit').get(admin.slidersEdit);
router.route('/sliders/:id/update').post(admin.slidersUpdate);

// Statistics
router.route('/users').get(admin.users);
router.route('/pays').get(admin.pays);










//export this router to use in our index.js
module.exports = router;