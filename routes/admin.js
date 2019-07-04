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

router.route('/freeArt/new/:type').get(admin.newFreeArt);
router.route('/freeArt/new/create/:type').post(admin.createFreeArt);
router.route('/freeArt/list/:type').get(admin.list);
router.route('/freeArt/changeStatus').post(admin.changeStatus);
router.route('/freeArt/:id/edit').get(admin.edit);
router.route('/freeArt/:id/update').post(admin.update);










//export this router to use in our index.js
module.exports = router;