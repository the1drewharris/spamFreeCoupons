'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    businessOwnerModel = require('../models/businessOwner.server.model.js'),
    businessOwner = mongoose.model('businessOwner'),
    crypto = require('crypto');


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
        businesses: [{
            id: req.body.id
        }]

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