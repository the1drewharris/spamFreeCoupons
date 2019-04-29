'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    userModel = require('../models/user.server.model.js'),
    user = mongoose.model('user'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    crypto = require('crypto');


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserialize sessions
passport.deserializeUser(function(id, done) {
    user.findOne({
        id: id
    }, '-salt -password', function(err, user) {
        done(err, user);
    });
});

exports.signIn = function(req, res){
    //businessOwner.findOne with email
    console.dir(req.body);
    user.findOne({email: req.body.email}).exec(function (err, foundUser){
        if (err) {
            console.log('there was a problem checking email');
        } else if (foundUser) {
            console.log('found user with email');

            var newUser = new user (foundUser);

            if (req.body.password && req.body.password != null && req.body.password != '') {
                newUser.password = req.body.password;


                newUser.authenticate(function(passback){
                    if (passback) {
                        newUser.loginTime = Date.now();
                        newUser.auth = passback;
                        //console.log('user.auth: ');
                        //console.dir(user.auth);
                        // Then save the user
                        newUser.save(function(err) {
                            if (err) {
                                return res.status(400).send({
                                    message: err
                                });
                            } else {
                                // Remove sensitive data before login
                                newUser.password = undefined;
                                newUser.salt = undefined;
                                req.login(newUser, function(err) {
                                    if (err) {
                                        res.status(400).send(err);
                                    } else {
                                        res.json(newUser);
                                    }
                                });

                            }
                        });
                    } else {
                        res.status(400).send({message: 'incorrect password!', auth: newUser.auth})
                    }
                });
            } else {
                res.status(400).send({message: 'password required', auth: newUser.auth})
            }

        } else if (!foundUser) {
            console.log('did NOT find user with email');
            return res.status(400).send({
                message: 'Could not find a user with that email.'
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
 * @api {post} /user/create
 * @apiName create
 * @apiGroup user
 *
 * @apiParam {email} email
 * @apiParam {password} password
 * @apiParam {businesses} businesses
 * @apiParam {roles} roles
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
    var v = new user({
        id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        businessId: req.body.businessId,
        businesses: req.body.businesses,
        roles: req.body.roles,
        createdDate: current_date
    });
    v.save(function (err, user) {
        if (err) {
            return res.status(400).send({
                message:  err
            });
        } else {
            res.status(200).send({success: true, id: user.id});
        }
    });
};

/**
 * @api {get} /user/list
 * @apiName list
 * @apiGroup user
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {user}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
 * "message": "error of some kind"
 *     }
 */
exports.list = function (req, res) {
    console.log('in list users function');
    user.find().sort('-type').exec(function (err, user) {
        if (!user.length) {
            res.status(200).send({user: user})
        } else {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.jsonp(user);
            }
        }
    });
};

/**
 * @api {get} /user
 * @apiName detail
 * @apiGroup user
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {user}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
 * "message": "error of some kind"
 *     }
 */
exports.detail = function (req, res) {
    user.findOne({id: req.params.id}).sort('-type').exec(function (err, user) {
        if (!user) {
            res.status(200).send()
        } else {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                res.jsonp(user);
            }
        }
    });
};

/**
 * @api {post} /user
 * @apiName list
 * @apiGroup user
 *
 * @apiParam {userId} userId
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {user}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
 * "message": "error of some kind"
 *     }
 */
exports.search = function (req, res) {
    var query = req.body;
    user.findOne(query).sort('-type').exec(function (err, user) {
        if (!user) {
            res.status(200).send(user)
        } else {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.jsonp(user);
            }
        }
    });
};

/**
 * @api {post} /user
 * @apiName update
 * @apiGroup user
 *
 * @apiParam {userId} userId
 * @apiParam {updatedUser} updatedUser
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
    user.findOneAndUpdate(query, req.body, {upsert: true}, function (err, doc) {
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
 * @api {delete} /user/:userId
 * @apiName delete
 * @apiGroup user
 *
 * @apiParam {userId} userId
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
    user.remove(query, function (err, doc) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.status(200).send({results: doc});
        }

    })
};