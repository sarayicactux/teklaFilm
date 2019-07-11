const express     = require('express');
const urlencode   = require('urlencode');
const date        = require('date-and-time');
const multer      = require('multer');

var upload          = multer({ dest: 'public/panel'});
var type            = upload.single('file');
const router        = express.Router();
const jsonfile      = require('jsonfile');
const path          = require('path');

var prInj           = require('../helpers/prInj');

var Models          = require('../models/Models');

var home            = require('../controllers/home');


router.route('/').get(preInf,home.index);
router.route('/sitemap.xml').get(sitemap,home.sitemap);
router.route('/singIn').get(preInf,home.singIn);
router.route('/login').post(home.checkLogin);
router.route('/logOut').get(home.logOut);
router.route('/register').post(preInf,home.registeruser);
router.route('/v/:slug').get(preInf,home.videoDetail);
router.route('/free/:slug').get(preInf,home.freeDetail);
router.route('/f/:type').get(preInf,home.freeList);
router.route('/download/:id').get(preInf,home.download);
router.route('/activeAcc/:str').get(preInf,home.activeAcc);
router.route('/forgetpass').post(preInf,home.forgetpass);



router.route('/uploading').post(type,home.uploading);
router.route('/deleteUploaded').post(home.deleteUploaded);




//export this router to use in our index.js

function preInf(req,res,next) {
    user = false;
    if (req.session.user){
        user_id = req.session.user.id;
        user = true;

    }
    res.user = user;
    Models.FreeArticle.findAll({
        where:{
            status: 1,
            type  : 1
        },
        order:[
            ['id','desc']
        ],
        offset:0,
        limit:10
    }).then(function (pdfs) {
         res.pdfs = pdfs;
        Models.FreeArticle.findAll({
            where:{
                status: 1,
                type  : 2
            },
            order:[
                ['id','desc']
            ],
            offset:0,
            limit:10
        }).then(function (powers) {
            res.powers = powers;
            Models.FreeArticle.findAll({
                where:{
                    status: 1,
                    type  : 3
                },
                order:[
                    ['id','desc']
                ],
                offset:0,
                limit:10
            }).then(function (cheet) {
                res.cheet = cheet;
                Models.Slider.findAll({
                    where:{
                        status: 1
                    },
                    order:[
                        ['id','desc']
                    ],
                    offset:0,
                    limit:10
                }).then(function (sliders) {
                    res.sliders = sliders;
                    next();
                })

            })
        })
    })

}
function checkuserAjax(req,res,next) {

    if(!req.session.user){
        res.json({status:false});return
    }
    next();
}
function checkuser(req,res,next) {
    if(!req.session.user){
        res.redirect('/login')
        return;
    }
    next();
}
function sitemap(req,res,next){
    next();
}

module.exports = router;