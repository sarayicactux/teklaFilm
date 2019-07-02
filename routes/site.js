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


router.route('/').get(preCond,dailyJson,hourlyJson,home.index);
router.route('/sitemap.xml').get(sitemap,home.sitemap);
router.route('/login').post(home.checkLogin);
router.route('/logOut').get(home.logOut);
router.route('/register').get(preCond,dailyJson,hourlyJson,home.register);
router.route('/sendRcode').post(home.sendRcode);
router.route('/register').post(preCond,dailyJson,hourlyJson,home.registerPeople);

router.route('/siteUploadImage').post(type,home.siteUploadImage);
router.route('/siteUploadVideo').post(type,home.siteUploadVideo);
router.route('/siteDeleteUploaded').post(home.siteDeleteUploaded);

router.route('/uploading').post(type,home.uploading);
router.route('/deleteUploaded').post(home.deleteUploaded);




//export this router to use in our index.js

function peopleInf(req,res,next) {
    if (req.session.people){
        people_id = req.session.people.id;
        Models.People.findOne(
            { where:{ id : people_id},
        }).then(function (peopleInf) {
            res.peopleInf = peopleInf;
            Models.Adv.findAll({
                where: {
                    user_id : people_id
                },
                include:[
                    Models.BusinessGr,
                    Models.AdvImage,
                    Models.Comment
                ]
            }).then(function (advs) {
                res.peopleAdvs = advs;
                Models.CarAdv.findAll({
                    where: {
                        user_id : people_id
                    },
                    include:[
                        Models.Brand1,
                        Models.Car,
                        Models.CarAdvImage
                    ]
                }).then(function (carAdvs) {
                    res.peopleCarAdvs = carAdvs;
                    Models.Comment.findAll({
                        where:{
                            people_id : people_id
                        },
                        include:[
                            Models.Adv
                        ]
                    }).then(function (comments) {
                        res.comments = comments;
                        next();
                    })

                });
            });


        })

    }

}
function preCond(req,res,next) {
    people = true
    if (!req.session.people){
        people = false;
    }
    res.people = people;
    Models.News.findAll({
        where:{
            active : 1,
            gr_id : 2,
        },
        order:[
            ['id','desc']
        ],
        offset:0,
        limit:20,
    }).then(function (news) {
        res.saghfNews = news;
        Models.News.findAll({
            where:{
                active : 1,
                gr_id : 1,
            },
            order:[
                ['id','desc']
            ],
            offset:0,
            limit:20,
        }).then(function (news) {
            res.carNews = news;

            Models.CarAdv.findAll({
                where:{
                    status : 1,
                    dis_status   : 1,
                },
                order:[
                    ['id','desc']
                ],
                offset:0,
                limit:20,
                include:[
                    Models.CarAdvImage
                ]
            }).then(function (lastCarAdv) {
                res.lastCarAdv = lastCarAdv;
                Models.Car.findAll({
                    where:{
                        show_price : 1,
                    },
                    order:[
                        ['updated_at','desc']
                    ],
                    offset:0,
                    limit:50,
                }).then(function (carPrice) {
                    res.carPrice = carPrice;
                    next();
                });



            }).catch(function (err) {

            });


        });
    });

}
function checkPeopleAjax(req,res,next) {

    if(!req.session.people){
        res.json({status:false});return
    }
    next();
}
function checkPeople(req,res,next) {
    if(!req.session.people){
        res.redirect('/login')
        return;
    }
    next();
}
function dailyJson(req,res,next){
    if(!req.session.people) {
        peopleGinf = [];
    }
    else {
        peopleGinf = req.session.people;
    }
    res.peopleGinf = peopleGinf;
    const daily  = path.resolve()+'/public/daily.json';
    jsonfile.readFile(daily, function (err, obj) {
        if (err) console.error(err);

        res.daily = obj;
        next();

    });




}
function hourlyJson(req,res,next){
    const hourly = path.resolve()+'/public/hourly.json';

    jsonfile.readFile(hourly, function (err, obj) {
        if (err) console.error(err)
        res.hourly = obj;
        next();



    });




}
function sitemap(req,res,next){
    next();
}

module.exports = router;