const payRequest    = require('request');
const jsonfile      = require('jsonfile');
const url           = require('url');
const mime          = require('mime');
const fs            = require('fs');
const date          = require('date-and-time');
const requestIp     = require('request-ip');
const rn            = require('random-number');
const sm            = require('sitemap');
const nodemailer    = require("nodemailer");
const md5           = require('md5');

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
    singIn:function(req,res){
        if (!req.session.user){
            res.render('site/user/login',{
                error: '',
                msg:'',
                res:res,
                needFul:needFul
            });
        }
        else {
            res.redirect(host+'/profile')
        }
    },
    activeAcc:function(req,res){
        if (!req.session.user){
            str = req.params.str;
            Models.User.update(
                {
                    status : 1
                },{
                where:{
                    email_val : str
                }
            })
                .then(function (usr) {
                    res.render('site/user/login',{
                        error: '',
                        msg:'Your account has been successfully activated',
                        res:res,
                        needFul:needFul
                    });
                }).catch(function (r) {
                res.render('site/user/login',{
                    error: '',
                    msg:'',
                    res:res,
                    needFul:needFul
                });

            })

        }
        else {
            res.redirect(host+'/profile')
        }
    },
   /* download:function(req,res){

        id = prInj.PrInj(req.params.id);
        Models.Video.findByPk(id).then(function (v) {
            if(res.user){
                user_id = req.session.user.id;
                Models.Pay.findOne({
                    where:{
                        user_id : user_id,
                        video_id: id
                    }
                })
                    .then(function (pay) {
                        if(pay){
                            Models.Video.update({
                                downloads : v.downloads +1
                            },{
                                where:{
                                    id: v.id
                                }
                            });
                            Models.Pay.update({
                                downloads : pay.downloads + 1
                            },{
                                where:{
                                    id : pay.id
                                }
                            });

                                file = 'public/'+v.main_file;
                                res.download(file);return;


                        }
                        else {
                            req.session.red = host+'/v/'+v.slug;
                            res.redirect(host+'/pay/'+id);return;
                        }

                })
            }
            else {
                req.session.red = host+'/v/'+v.slug;

                res.redirect(host+'/singIn');return;
            }
            }).catch(function (r) {
                res.status(500);
                res.render('errors/500');
        });
    },*/
    download:function(req,res){

        if(res.user){
            res.redirect(host+'/profile')

        }
        else {
            res.redirect(host+'/singIn');return;
        }
    },
    downloadFree:function(req,res){

        id = prInj.PrInj(req.params.id);
        Models.FreeArticle.findByPk(id).then(function (v) {
            
            Models.FreeArticle.update({
                downloads : v.downloads +1
            },{
                where:{
                    id: v.id
                }
            });
            

                file = 'public/'+v.file_url;
                res.download(file);return;
            
           
            }).catch(function (r) {
                res.status(500);
                res.render('errors/500');
        });
    },
    index: function (req,res) {
        // https://myaccount.google.com/lesssecureapps

        page = 1;
        if (req.query.page){
            if (parseInt(req.query.page) < 2){
                res.redirect(host)
            }
            page = req.query.page;
            page = parseInt(prInj.PrInj(page));

        }
        Models.Video.findAll({where:{status: 1}}).then(function (allVideo) {
            if (allVideo.length < (page-1)*10 ){
                res.redirect(host);return
            }
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
                vCnt = allVideo.length;
                refU = host;
                res.render('site/index',{refU:refU,page:page,vCnt:vCnt,videos:videos,res:res,needFul:needFul});

            })
        });

    },
    videoDetail:function(req,res){
        slug = prInj.PrInj(req.params.slug);
        Models.Video.findOne({
            where: {
                slug :slug
            }
        }).then(function (v) {
            if(v){
                Models.Video.update({
                    visits : v.visits +1
                },{
                    where:{
                        id: v.id
                    }
                });
                res.render('site/pages/video',{v:v,res:res,needFul:needFul});
            }
            else {
                    res.status(404);
                    res.render('errors/404');
            }
        })
    },
    freeDetail:function(req,res){
        slug = prInj.PrInj(req.params.slug);
        Models.FreeArticle.findOne({
            where: {
                slug :slug
            }
        }).then(function (v) {
            if(v){
                Models.FreeArticle.update({
                    visits : v.visits +1
                },{
                    where:{
                        id: v.id
                    }
                });
                res.render('site/pages/free',{v:v,res:res,needFul:needFul});
            }
            else {
                    res.status(404);
                    res.render('errors/404');
            }
        })
    },
    /*profile:function(req,res){
        if (!(res.user)){
                res.redirect(host);return;
        }
            id = req.session.user.id;
            Models.User.findByPk(id)
            .then(function(usr){
                    Models.Pay.findAll({
                        where:{
                            user_id : id
                        },
                        include:[
                            Models.Video
                        ]
                    })
                    .then(function(pays){
                        error = '';
                        res.render('site/pages/profile',{error:error,pays:pays,usr:usr,res:res,needFul:needFul});
                    })
            })
            .catch(function(err){
                res.status(500);
                res.status('errors/500');
            })
    },*/
    profile:function(req,res){
        if (!(res.user)){
            res.redirect(host);return;
        }
        id = req.session.user.id;
        Models.User.findByPk(id)
            .then(function(usr){
                Models.Pay.findOne({
                    where:{
                        user_id : id
                    }
                })
                    .then(function(pays){
                        Models.File.findAll().then(function (files) {

                            res.render('site/pages/profile',{files:files,pays:pays,usr:usr,res:res,needFul:needFul});

                        })
                         })
            })
            .catch(function(err){
                res.status(500);
                res.status('errors/500');
            })
    },
    changepass:function(req,res){
            error = '';
            res.render('site/pages/changepass',{error:error,res:res,needFul:needFul});
    },
    changePassword:function(req,res){
        password        = prInj.PrInj(req.params.password);
        new_password    = prInj.PrInj(req.params.new_password);
        confirm         = prInj.PrInj(req.params.confirm);
        if (new_password != confirm){

        }
    },
    freeList:function(req,res){
        type = prInj.PrInj(req.params.type);
            if (type == '1'){
                    ftype = 'PDF'
            }
            else if(type == '2'){
                    ftype = 'Powerpoint'
            }
            else {
                ftype = 'CheetSheet';
            }
            Models.FreeArticle.findAll({
                where:{
                    type : type,
                    status : 1
                }
            }).then(function(freeArt){
                    if(freeArt.length > 0){
                        res.render('site/pages/freeList',{ftype:ftype,freeArts:freeArt,res:res,needFul:needFul});
            }
            else {
                    res.status(404);
                    res.render('errors/404');
            }
            }).catch(function(error){
                res.status(404);
                res.render('errors/404');
            })
    },
    checkLogin:function(req,res){
    

        var pass     = prInj.PrInj(req.body.password);
        var email   = prInj.PrInj(req.body.email);
        Models.User.findOne({
            where:{email:email},
        }).then(function (row) {
            if (row.length != 0){
                if (Password.verify(pass, row.password)){

                    if (row.status == 0){
                        res.render('site/user/login',{
                            error: 'Your account is not verified, check your email.',
                            msg:'',
                            res:res,
                            needFul:needFul
                        });
                    }
                    else {

                        req.session.user = row;
                        res.redirect(host + '/profile');return;
                        // if (req.session.red){
                        //     res.redirect(req.session.red);return;
                        // }
                        // else {
                        //     res.redirect(host + '/profile');return;
                        // }

                    }



                }
                else {
                    res.render('site/user/login',{
                        error: 'Invalid Login or password',
                        msg:'',
                        res:res,
                        needFul:needFul
                    });
                }
            }

            else {
                res.render('site/user/login',{
                    error: 'Invalid Login or password',
                    msg:'',
                    res:res,
                    needFul:needFul
                });
            }
        })
            .catch(function (err) {
                res.render('site/user/login',{
                    error: 'Invalid Login or password',
                    msg:'',
                    res:res,
                    needFul:needFul
                });
            })
    },
    forgetpass:function(req,res){
        var email   = prInj.PrInj(req.body.forget_email);

        Models.User.findOne({
            where:{email:email}
        }).then(function (row) {
            if (row.length != 0){

                    if (row.status == 0){
                        res.render('site/user/login',{
                            error: 'Your account is not verified, check your email.',
                            msg:'',
                            res:res,
                            needFul:needFul
                        });
                    }
                    else {

                        var newPass = Math.floor(1000000 + Math.random() * 9000000);
                        newPass = newPass + 'tf'
                        Models.User.update({
                            password : Password.hash(newPass)
                        },{
                            where:{
                                id : row.id
                            }
                        }).then(function (r) {

                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'teklafilm@gmail.com',
                                    pass: 'araktehran'
                                }
                            });

                            var mailOptions = {
                                from: 'teklafilm@gmail.com',
                                to: email,
                                subject: 'Recovery Password Email ',
                                html: '<h1>Dear '+row.fname+' '+row.lname +' </h1>'+'<p>\n' +
                                    '        Your new password on the Teklafilm.com is '+newPass+'\n' +
                                    '    </p>\n'
                            };

                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });
                            res.render('site/user/login',{
                                error: '',
                                msg:'A new password has been sent to your email',
                                res:res,
                                needFul:needFul
                            });
                        })

                    }



                }


            else {
                res.render('site/user/login',{
                    error: 'Email is not valid, please register',
                    msg:'',
                    res:res,
                    needFul:needFul
                });
            }
        });
    },
    registeruser:function(req,res){
        if (req.session.user){
            res.redirect(host+'/profile')
        }
        form = req.body;
        email = form.regiser_email;
        Models.User.findOne({
            where:{
                email : email
            }
        }).then(function (usr) {
            if (usr){
                res.render('site/user/login',{
                    error: 'The imported email is duplicate or invalid',
                    msg:'',
                    res:res,
                    needFul:needFul
                });
            }
            else {
                now = new Date();
                var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
                newuser = {
                    name           : form.fname,
                    family         : form.lname,
                    email          : form.regiser_email,
                    password       : Password.hash(form.register_password),
                    email_val      : md5(form.register_password+'251sw!'),
                    created_at     : created_at,
                    updated_at     : created_at,
                }
                Models.User.create(newuser).then(function (newP) {
                    res.render('site/user/login',{
                        error: '',
                        msg: 'Sign up successfully, please login',
                        res:res,
                        needFul:needFul
                    });
                }).catch(function () {
                    res.render('site/user/login',{
                        error: 'Internal server error, please try again later',
                        msg:'',
                        res:res,
                        needFul:needFul
                    });
                });
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'teklafilm@gmail.com',
                        pass: 'araktehran'
                    }
                });

                var mailOptions = {
                    from: 'teklafilm@gmail.com',
                    to: form.regiser_email,
                    subject: 'Activation Email ',
                    html: '<h1>Dear '+form.fname+' '+form.lname +' Welcome</h1>'+'<p>\n' +
                        '        Enable your account on the Teklafilm.com by clicking on the link below\n' +
                        '    </p>\n' +
                        '    <p><a href="'+host+'/activeAcc/'+md5(form.register_password+'251sw!')+'">'+host+'/activeAcc/'+md5(form.register_password+'251sw!')+'</a> </p>'
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                req.session.destroy();
            }
        })



    },


    uploading:function(req,res){
		
        var tmp_path = req.file.path;
        var inputId  = req.body.inputId;
        var mimeType = req.body.mimeType;
        dir = 'files';
        var rand = rn(options);
        if (mimeType == '2'){
            dir = vDir;
            rand = '';
        }
        /** The original name of the uploaded file
         stored in the variable "originalname". **/

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
    logOut:function(req,res){
        req.session.destroy();
        res.redirect(host);
    },


};
