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
            res.render('panel/freeArt/add',{type:type,user:user});
        }
        else {
            res.status(500);
            res.render('errors/500');
        }

    }



};