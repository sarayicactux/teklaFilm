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









//export this router to use in our index.js
module.exports = router;