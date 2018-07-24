'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    adminModel = require('../models/admin.server.model.js'),
    admin = mongoose.model('admin'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    crypto = require('crypto');



passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserialize sessions
passport.deserializeUser(function(id, done) {
    admin.findOne({
        _id: id
    }, '-salt -password', function(err, user) {
        done(err, user);
    });
});



exports.signIn = function(req, res){
    //businessOwner.findOne with email
    admin.findOne({email: req.body.email}).exec(function (err, foundUser){
        if (err) {
            console.log('there was a problem checking email');
        } else if (foundUser) {
            console.log('found admin with email');

            var adminUser = new admin (foundUser);

            adminUser.password = req.body.password;

            adminUser.authenticate(function(passback){
                if (passback) {
                    adminUser.loginTime = Date.now();
                    adminUser.auth = passback;
                    //console.log('user.auth: ');
                    //console.dir(user.auth);
                    // Then save the user
                    adminUser.save(function(err) {
                        if (err) {
                            return res.status(400).send({
                                message: logger.log("ERROR", __function, err)
                            });
                        } else {
                            // Remove sensitive data before login
                            adminUser.password = undefined;
                            adminUser.salt = undefined;
                            if (adminUser.free) {
                                console.log('admin is free!');
                                req.login(adminUser, function(err) {
                                    if (err) {
                                        res.status(400).send(err);
                                    } else {
                                        res.json(adminUser);
                                    }
                                });
                            } else {
                                console.log('check user.subscription.status == Active');
                                if (adminUser.subscription.status == 'Active'){
                                    console.log('admin has active subscription!');
                                    req.login(adminUser, function(err) {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            res.json(adminUser);
                                        }
                                    });
                                } else {
                                    console.log('admin does NOT have active subscription');
                                    res.status(400).send({message: 'Subscription is not Active.', checkout: true, adminUser: adminUser});
                                }
                            }
                        }
                    });
                } else {
                    res.status(400).send({message: 'incorrect password!', auth: adminUser.auth})
                }
            });

        } else if (!foundUser) {
            console.log('did NOT find admin with email');
            return res.status(400).send({
                message: 'Could not find a admin with that email.'
            })
        }
    });
};

/**
 * SignOut
 */
exports.signOut = function(req, res) {
    req.logout();
    res.redirect('/');
};


exports.me = function(req,res){
    if(req.admin){
        console.log('in auth.me');
        console.dir(req.admin.username);
        res.status(200).send({user: req.admin})
    } else {
        res.status(400);
    }
};




/**
 * @api {post} /admin/create
 * @apiName create
 * @apiGroup admin
 *
 * @apiParam {email} email
 * @apiParam {password} password
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 *  {success: true, id: frequency.id}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
*  "message": "error of some kind"
*     }
 */
exports.create = function (req, res) {
    // used to create ID
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var v = new admin({
        id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
        email: req.body.email,
        password: req.body.password, //TODO: make password hash
        dateCreated: current_date
    });
    v.save(function (err, admin) {
        if (err) {
            return res.status(400).send({
                message:  err
            });
        } else {
            res.status(200).send({success: true, id: admin.id});
        }
    });
};

/**
 * @api {get} /admin
 * @apiName list
 * @apiGroup admin
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {admin}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.list = function (req, res) {
    admin.find().sort('-type').exec(function (err, admins) {
        if (!admin.length) {
            res.status(200).send({admins: admins})
        } else {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.jsonp(admins);
            }
        }
    });
};

/**
 * @api {get} /admin
 * @apiName detail
 * @apiGroup admin
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {admin}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.detail = function (req, res) {
    admin.findOne({id: req.params.id}).sort('-type').exec(function (err, admin) {
        if (!admin) {
            res.status(200).send()
        } else {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                res.jsonp(admin);
            }
        }
    });
};

/**
 * @api {post} /admin
 * @apiName update
 * @apiGroup admin
 *
 * @apiParam {adminid} adminid
 * @apiParam {updatedadmin} Updateadmin
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 *  {results: doc}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
*  "message": "error of some kind"
*     }
 */
exports.update = function (req, res) {
    var query = {id: req.body.id};
    admin.findOneAndUpdate(query, req.body, {upsert: true}, function (err, doc) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.status(200).send({results: doc});
        }
    });
};

/**
 * @api {delete} /admin/:admin
 * @apiName delete
 * @apiGroup admin
 *
 * @apiParam {adminid} adminid
 *
 * @apiSuccessExample Success-Response:
 * 200 OK
 *  {results: doc}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
 *       "message": "error of some kind"
 *  }
 */
exports.delete = function (req, res) {
    var query = {id: req.params.id};
    admin.remove(query, function (err, doc) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.status(200).send({results: doc});
        }
    })
};