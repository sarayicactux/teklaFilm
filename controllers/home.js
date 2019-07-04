const payRequest    = require('request');
const jsonfile      = require('jsonfile');
const url           = require('url');
const mime          = require('mime');
const fs            = require('fs');
const date          = require('date-and-time');
const requestIp     = require('request-ip');
const rn            = require('random-number');
const sm            = require('sitemap');
var prInj    = require('../helpers/prInj');
var jDate    = require('../helpers/jDate');
var needFul  = require('../helpers/needFul');
var Models          = require('../models/Models');
const Password      = require("node-php-password");
//   GpsgzN6jRm%6#h%Wqfuo3U

//  mysql root password     pn3%c6xC70ATpbCgfNUmn$eXzfHRzXJEjmY8!Z


var options = {
    min:  100
    , max:  999999
    , integer: true
}

module.exports = {


    sitemap:function(req,res){
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');




        sitemap = sm.createSitemap ({
            hostname: '',
            cacheTime: 600000,        // 600 sec - cache purge period
            urls: urls
        });
        sitemap.toXML( function (err, xml) {
            if (err) {
                return res.status(500).end();
            }
            res.header('Content-Type', 'application/xml');
            res.send( xml );
        });
    },
    index: function (req,res) {
        page = 1;
        if (req.query.page){
            if (parseInt(req.query.page) < 2){
                res.redirect(host)
            }
            page = req.query.page;
            page = parseInt(prInj.PrInj(page));

        }
        Models.Video.findAll({where:{status: 1}}).then(function (allVideo) {
            Models.Video.findAll({
                where:{
                    status: 1,
                },
                order:[
                    ['id','desc']
                ],
                offset:(page-1)*10,
                limit:10
            }).then(function (videos) {
                advCnt = allVideo.length;
                refU = host;
                res.render('site/index',{refU:refU,page:page,advCnt:advCnt,videos:videos,res:res,needFul:needFul});

            })
        });

    },
    checkLogin:function(req,res){
        var pass     = prInj.PrInj(req.body.password);
        var mobile   = prInj.PrInj(req.body.mobile);
        Models.user.findOne({
            where:{mobile:mobile}
        }).then(function (row) {
            if (row.length != 0){

                if (Password.verify(pass, row.password)){

                    req.session.user = row;
                   res.json({status:true});return;


                }
                else {
                    res.json({status:false});return;
                }
            }

            else {
                res.json({status:false});return;
            }
        })
            .catch(function (err) {
                res.json({status:false});
                return;
            })
    },
    register:function(req,res){
        if (!req.session.user){

            now = new Date();
            req.session.regRq = Password.hash(now+'k');
            res.render('site/user/register',{res:res,jDate:jDate,needFul:needFul});
        }
        else {
            res.render('site/ads/chooseType',{res:res,jDate:jDate,needFul:needFul});
        }

    },
    registeruser:function(req,res){
        var code        = prInj.PrInj(req.body.rCode);
        if (!req.session.regRq){
            res.json( {status: false});return;
        }
        if (!req.session.fBody){
            res.json( {status: false});return;
        }
        if (req.session.rCode != code) {
            res.json( {status: false});return;
        }
        else {
            form = req.session.fBody;
            var slug = form.name+ form.family;
            slug = slug.replace(/ /g,'-');
            slug = slug.replace(/--/g,'-');
            now = new Date();
            var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
            newuser = {
                name           : form.name,
                family         : form.family,
                mobile         : form.mobile,
                password       : Password.hash(form.password),
                rcode          : code,
                created_at     : created_at,
                updated_at     : created_at,
            }
            Models.user.create(newuser).then(function (newP) {
                res.json( {status: true});return;
            }).catch(function () {
                res.json( {status: false});return;
            });
            req.session.destroy();
        }
    },


    uploading:function(req,res){
        var tmp_path = req.file.path;
        var inputId  = req.body.inputId;
        var mimeType = req.body.mimeType;
        dir = 'files';
        if (mimeType == '2'){
            dir = vDir;
        }
        /** The original name of the uploaded file
         stored in the variable "originalname". **/
        var rand = rn(options);
        var userFile    = 'panel/'+dir+'/' + rand + req.file.originalname;
        var target_path = appRoot + '/public/panel/'+dir+'/' + rand + req.file.originalname;
        /** A better way to copy the uploaded file. **/
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', function() {
            fs.unlinkSync(tmp_path);
            if (mimeType == '4'){
                res.render('site/all/imageUploaded',{
                    'userFile':userFile,
                    'inputId' : inputId
                });
            }
            else {
                res.render('site/all/videoUploaded',{
                    'userFile':userFile,
                    'inputId' : inputId
                });
            }

        });
    },
    deleteUploaded:function (req,res) {
        var file    = req.body.fileName;
        var inputId = req.body.inputId;
        fs.unlinkSync(appRoot + '/public/'+file);
        res.send('<input id="'+inputId+'Path"  type="hidden" value="">');
    },
    login:function(req,res){
        if (!req.session.user){
            res.render('site/user/login',{
                error: '',
                res:res,
                jDate:jDate,
                needFul:needFul
            });
        }
        else {
            res.render('site/ads/chooseType',{res:res,jDate:jDate,needFul:needFul});
        }
    },
    logOut:function(req,res){
        req.session.destroy();
        res.redirect(host);
    },


};
