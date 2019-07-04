const path          = require('path');
const url           = require('url');
const date          = require('date-and-time');
const Password      = require("node-php-password");
const fs            = require('fs');


var prInj = require('../helpers/prInj');
var jDate = require('../helpers/jDate');
var Models = require('../models/Models');


module.exports = {

    dash:function(req,res){
        if (!req.session.user){
            res.render('user/login',{
                error: ''
            });
        }
        else {
            user = req.session.user;
            res.render('panel/dash',{
                user : user,
            });
        }
    },
    changePass:function (req,res) {
        user = req.session.user;

        realPass = user.password;
        oldPass  = req.body.oldPass;
        newPass  = req.body.newPass;
        if (Password.verify(oldPass, realPass)){

            pass = Password.hash(newPass);

            Models.User.update(
                {password: pass},
                {where: {id: user.id}}
            )
                .then(function(rowsUpdated) {
                    res.json({
                        status : true
                    });
                })
                .catch(function () {
                    res.json({
                        status : false,
                        error  : 'Error in input information'
                    });
                });

        }
        else {
            res.json({
                status : false,
                error  : 'Error in input information'
            });
        }


    },
    validateOp:function (req,res) {
            var id      = req.params.id;
            var name    = req.params.name;
            var family  = req.params.family;
            var mobile  = prInj.PrInj(req.params.mobile);
            var email   = prInj.PrInj(req.params.email);
            var newUser = prInj.PrInj(req.params.newUser);

            var user = new User;
            var slug = name+'-'+family;
            slug = prInj.PrInj(slug);
            slug = slug.replace(/ /g,'-');
            slug = slug.replace(/--/g,'-');
            if (id == 'q'){

                user.find('first',{where:" `username` = '"+newUser+"'"},function (err,usr) {
                        if(err){
                            res.json('خطا در ارتباط با سرور');
                        }
                        else {
                            if(usr.length !=0 ){
                                res.json('نام کاربری وارد شده تکراری است');
                            }
                            else {
                                user.find('first',{where:" `email` = '" + email +"'"},function (err,usr2) {
                                    if(err){
                                        //console.log(err)
                                        res.json('خطا در ارتباط با سرور');
                                    }
                                    else {
                                        if(usr2.length !=0 ){
                                            res.json('ایمیل وارد شده تکراری است');
                                        }
                                        else {
                                            res.json('');
                                        }
                                    }
                                });
                            }
                        }
                });


            }
            else {
                user.find('first',{where:' id = ' + id},function (err,old) {
                    if(err){
                        res.json('خطا در ارتباط با سرور');
                    }
                    else {

                        user.find('first',{where:' username = ' + username},function (err,usr) {
                            if(err){
                                res.json('خطا در ارتباط با سرور');
                            }
                            else {
                                if(usr.length !=0 && old.username != usr.username ){
                                    res.json('نام کاربری وارد شده تکراری است');
                                }
                                else {
                                    user.find('first',{where:' email = ' + email},function (err,usr2) {
                                        if(err){
                                            res.json('خطا در ارتباط با سرور');
                                        }
                                        else {
                                            if(usr2.length !=0 && old.email != usr2.email ){
                                                res.json('ایمیل وارد شده تکراری است');
                                            }
                                            else {
                                                res.json('');
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }

    },
    validateEmail:function (req,res) {
        var id      = req.params.id;

        var email   = prInj.PrInj(req.params.email);
        old = req.session.user;
        var user = new User;
        user.find('first',{where:' id = ' + id},function (err,old) {
            if(err){
                res.json('خطا در ارتباط با سرور');
            }
            else {

                user.find('first',{where:" email = '" + email +"'"},function (err,usr) {
                    if(err){
                        res.json('خطا در ارتباط با سرور');
                    }
                    else {
                        if(usr.length !=0 && old.email != usr.email ){
                            res.json('ایمیل وارد شده تکراری است');
                        }
                        else {
                            res.json('');
                        }
                    }
                });
            }
        });


    },
    users:function (req,res) {


    },
    newFreeArt:function (req,res) {
        type = '';
        if (req.params.type == '1') type = 'Pdf';
        if (req.params.type == '2') type = 'Powerpoint';
        if (req.params.type == '3') type = 'CheetSheet';
        if (type.length >2){
            user = req.session.user;
            res.render('panel/freeArt/add',{intType:req.params.type,type:type,user:user});
        }
        else {
            res.status(500);
            res.render('errors/500');
        }

    },
    createFreeArt:function (req,res) {
        type        = prInj.PrInj(req.params.type);
        inputs      = prInj.PrAll(req.body);

        title       = inputs.title;
        des         = inputs.des;
        thumb       = inputs.thumb;
        file_url    = inputs.file_url;
        var slug = title;
        slug = slug.replace(/ /g,'-');
        slug = slug.replace('(','-');
        slug = slug.replace(')','-');
        slug = slug.replace('(','-');
        slug = slug.replace(')','-');
        slug = slug.replace(/--/g,'-');
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');

        var newF = {
            type           : type,
            title          : title,
            slug           : slug,
            des            : des,
            file_url       : file_url,
            thumb          : thumb,
            created_at     : created_at,
            updated_at     : created_at
        };

        Models.FreeArticle.create(newF)
            .then(function (Fnew) {


                res.json({status:true});return;

            })
            .catch(function (err) {
                console.log(err);
                res.json({status:false});return;
            });

    },
    list:function (req,res) {
        type = '';
        if (req.params.type == '1') type = 'Pdf';
        if (req.params.type == '2') type = 'Powerpoint';
        if (req.params.type == '3') type = 'CheetSheet';
        if (type.length >2){
            Models.FreeArticle.findAll({
                where:{
                    type : req.params.type
                },
                order:[
                    ['id','DESC']
                ]
            }).then(function (arts) {
                user = req.session.user;
                res.render('panel/freeArt/list',{intType:req.params.type,type:type,arts:arts,user:user});
            })

        }
        else {
            res.status(500);
            res.render('errors/500');
        }
    },
    changeStatus:function (req,res) {
        inputs = prInj.PrAll(req.body);
        Models.FreeArticle.update({
                status:inputs.status
            },
            {
                where:{id:inputs.id}
            }
        ).then(function () {
            console.log('done');
            res.json('done');
        }).catch(function (err) {
            console.log(err);
            res.json('error');
        })
    },
    edit:function (req,res) {
        inputs = prInj.PrAll(req.params);
        Models.FreeArticle.findByPk(inputs.id)
            .then(function (v) {
                user = req.session.user;
                res.render('panel/freeArt/edit',{v:v,user:user});
            })
            .catch(function (err) {
                console.log(err);
                res.render('errors/500');
            })
    },
    update:function (req,res) {
        inputs      = prInj.PrAll(req.body);
        title       = inputs.title;
        des         = inputs.des;
        thumb       = inputs.thumb;
        file_url    = inputs.file_url;


        now = new Date();
        var updated_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');


        var UpdateC = {
            title          : title,
            des            : des,
            file_url       : file_url,
            thumb          : thumb,
            updated_at     : updated_at,
        };
        var where = {
            where:{id:inputs.id}
        };
        Models.FreeArticle.update(UpdateC,
            where)
            .then(function (rowsUpdated) {
                res.json({status:true});return;
            }).catch(function (err) {
            console.log(err);
            res.json({status:false});return;
        })



    },
    vArtNew:function (req,res) {

            user = req.session.user;
            res.render('panel/vArt/add',{user:user});

    },
    vArtCreate:function (req,res) {
        inputs      = prInj.PrAll(req.body);

        title       = inputs.title;
        des         = inputs.des;
        text        = inputs.text;
        thumb       = inputs.thumb;
        demo_file   = inputs.demo_file;
        main_file   = inputs.main_file;
        var slug = title;
        slug = slug.replace(/ /g,'-');
        slug = slug.replace('(','-');
        slug = slug.replace(')','-');
        slug = slug.replace('(','-');
        slug = slug.replace(')','-');
        slug = slug.replace(/--/g,'-');
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');

        var newF = {
            text           : text,
            title          : title,
            slug           : slug,
            des            : des,
            main_file      : main_file,
            demo_file      : demo_file,
            thumb          : thumb,
            created_at     : created_at,
            updated_at     : created_at
        };

        Models.Video.create(newF)
            .then(function (Fnew) {


                res.json({status:true});return;

            })
            .catch(function (err) {
                console.log(err);
                res.json({status:false});return;
            });

    },
    vArtList:function (req,res) {

            Models.Video.findAll({
                order:[
                    ['id','DESC']
                ]
            }).then(function (arts) {
                user = req.session.user;
                res.render('panel/vArt/list',{arts:arts,user:user});
            })


    },
    vArtChangeStatus:function (req,res) {
        inputs = prInj.PrAll(req.body);
        Models.Video.update({
                status:inputs.status
            },
            {
                where:{id:inputs.id}
            }
        ).then(function () {
            console.log('done');
            res.json('done');
        }).catch(function (err) {
            console.log(err);
            res.json('error');
        })
    },
    vArtEdit:function (req,res) {
        inputs = prInj.PrAll(req.params);
        Models.Video.findByPk(inputs.id)
            .then(function (v) {
                user = req.session.user;
                res.render('panel/sliders/edit',{v:v,user:user});
            })
            .catch(function (err) {
                console.log(err);
                res.render('errors/500');
            })
    },
    vArtUpdate:function (req,res) {
        inputs      = prInj.PrAll(req.body);
        title       = inputs.title;
        des         = inputs.des;
        text        = inputs.text;
        thumb       = inputs.thumb;
        demo_file   = inputs.demo_file;
        main_file   = inputs.main_file;


        now = new Date();
        var updated_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');


        var UpdateC = {
            text           : text,
            title          : title,
            des            : des,
            main_file      : main_file,
            demo_file      : demo_file,
            thumb          : thumb,
            updated_at     : updated_at,
        };
        var where = {
            where:{id:inputs.id}
        };
        Models.Video.update(UpdateC,
            where)
            .then(function (rowsUpdated) {
                res.json({status:true});return;
            }).catch(function (err) {
            console.log(err);
            res.json({status:false});return;
        })



    },


    slidersNew:function (req,res) {

        user = req.session.user;
        res.render('panel/sliders/add',{user:user});

    },
    slidersCreate:function (req,res) {
        inputs      = prInj.PrAll(req.body);

        title       = inputs.title;
        des         = inputs.des;
        image_url   = inputs.thumb;
        link        = inputs.link;
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');

        var newF = {
            image_url      : image_url,
            title          : title,
            des            : des,
            link           : link,
            created_at     : created_at,
            updated_at     : created_at
        };

        Models.Slider.create(newF)
            .then(function (Fnew) {


                res.json({status:true});return;

            })
            .catch(function (err) {
                console.log(err);
                res.json({status:false});return;
            });

    },
    slidersList:function (req,res) {

        Models.Slider.findAll({
            order:[
                ['id','DESC']
            ]
        }).then(function (arts) {
            user = req.session.user;
            res.render('panel/sliders/list',{arts:arts,user:user});
        })


    },
    slidersChangeStatus:function (req,res) {
        inputs = prInj.PrAll(req.body);
        Models.Slider.update({
                status:inputs.status
            },
            {
                where:{id:inputs.id}
            }
        ).then(function () {
            console.log('done');
            res.json('done');
        }).catch(function (err) {
            console.log(err);
            res.json('error');
        })
    },
    slidersEdit:function (req,res) {
        inputs = prInj.PrAll(req.params);
        Models.Slider.findByPk(inputs.id)
            .then(function (v) {
                user = req.session.user;
                res.render('panel/sliders/edit',{v:v,user:user});
            })
            .catch(function (err) {
                console.log(err);
                res.render('errors/500');
            })
    },
    slidersUpdate:function (req,res) {
        inputs      = prInj.PrAll(req.body);
        title       = inputs.title;
        des         = inputs.des;
        image_url   = inputs.thumb;
        link        = inputs.link;


        now = new Date();
        var updated_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');


        var UpdateC = {
            image_url      : image_url,
            title          : title,
            des            : des,
            link           : link,
            updated_at     : updated_at,
        };
        var where = {
            where:{id:inputs.id}
        };
        Models.Slider.update(UpdateC,
            where)
            .then(function (rowsUpdated) {
                res.json({status:true});return;
            }).catch(function (err) {
            console.log(err);
            res.json({status:false});return;
        })



    },





};