'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    businessOwnerModel = require('../models/businessOwner.server.model.js'),
    businessOwner = mongoose.model('businessOwner'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    crypto = require('crypto');


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserialize sessions
passport.deserializeUser(function(id, done) {
    businessOwner.findOne({
        _id: id
    }, '-salt -password', function(err, user) {
        done(err, user);
    });
});



exports.signIn = function( req, res){
    //businessOwner.findOne with email
    businessOwner.findOne({email: req.body.email}).exec(function (err, foundUser){
        if (err) {
            console.log('there was a problem checking username');
        } else if (foundUser) {
            console.log('found user with username');

            var user = new businessOwner (foundUser);

            user.password = req.body.password;

            user.authenticate(function(passback){
                if (passback) {
                    user.loginTime = Date.now();
                    user.auth = passback;
                    //console.log('user.auth: ');
                    //console.dir(user.auth);
                    // Then save the user
                    user.save(function(err) {
                        if (err) {
                            return res.status(400).send({
                                message: logger.log("ERROR", __function, err)
                            });
                        } else {
                            // Remove sensitive data before login
                            user.password = undefined;
                            user.salt = undefined;
                            if (user.free) {
                                console.log('user is free!');
                                req.login(user, function(err) {
                                    if (err) {
                                        res.status(400).send(err);
                                    } else {
                                        res.json(user);
                                    }
                                });
                            } else {
                                console.log('check user.subscription.status == Active');
                                if (user.subscription.status == 'Active'){
                                    console.log('user has active subscription!');
                                    req.login(user, function(err) {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            res.json(user);
                                        }
                                    });
                                } else {
                                    console.log('user does NOT have active subscription');
                                    res.status(400).send({message: 'Subscription is not Active.', checkout: true, user: user});
                                }
                            }
                        }
                    });
                } else {
                    res.status(400).send({message: 'incorrect password!', auth: user.auth})
                }
            });

        } else if (!foundUser) {
            console.log('did NOT find user with username');
            return res.status(400).send({
                message: 'Could not find a user with that username.'
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
    if(req.user){
        console.log('in auth.me');
        console.dir(req.user.username);
        res.status(200).send({user: req.user})
    } else {
        res.status(400);
    }
};

/**
 * @api {post} /businessOwner/create
 * @apiName create
 * @apiGroup businessOwner
 *
 * @apiParam {email} email
 * @apiParam {password} password
 * @apiParam {businesses} businesses
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
    var v = new businessOwner({
        id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
        email: req.body.email,
        password: req.body.password,
        businesses: req.body.businesses,
        createdDate: current_date
    });
    v.save(function (err, businessOwner) {
        if (err) {
            return res.status(400).send({
                message:  err
            });
        } else {
            res.status(200).send({success: true, id: businessOwner.id});
        }
    });
};

/**
 * @api {get} /businessOwner
 * @apiName list
 * @apiGroup businessOwner
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {businessOwner}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.list = function (req, res) {
    businessOwner.find().sort('-type').exec(function (err, businessOwners) {
        if (!businessOwner.length) {
            res.status(200).send({businessOwners: businessOwners})
        } else {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.jsonp(businessOwners);
            }
        }
    });
};

/**
 * @api {get} /businessOwner
 * @apiName detail
 * @apiGroup businessOwner
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {businessOwner}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.detail = function (req, res) {
    businessOwner.findOne({id: req.params.id}).sort('-type').exec(function (err, businessOwner) {
        if (!businessOwner) {
            res.status(200).send()
        } else {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                res.jsonp(businessOwner);
            }
        }
    });
};

/**
 * @api {post} /businessOwner
 * @apiName update
 * @apiGroup businessOwner
 *
 * @apiParam {businessOwnerid} businessOwnerid
 * @apiParam {updatedbusinessOwner} UpdatebusinessOwner
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
    businessOwner.findOneAndUpdate(query, req.body, {upsert: true}, function (err, doc) {
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
 * @api {delete} /businessOwner/:businessOwner
 * @apiName delete
 * @apiGroup businessOwner
 *
 * @apiParam {businessOwnerid} businessOwnerid
 *
 * @apiSuccessExample Success-Response:
 * 200 OK
 *  {results: doc}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
*  "message": "error of some kind"
*     }
 */
exports.delete = function (req, res) {
    var query = {id: req.params.id};
    businessOwner.remove(query, function (err, doc) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.status(200).send({results: doc});
        }

    })
};