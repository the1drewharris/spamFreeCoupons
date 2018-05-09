'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    adminModel = require('../models/admin.server.model.js'),
    admin = mongoose.model('admin'),
    crypto = require('crypto');


/**
 * @api {post} /admin/create
 * @apiName create
 * @apiGroup admin
 *
 * @apiParam {email} email
 * @apiParam {password} password
 * @apiParam {DateCreated} DateCreated
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
        password: req.body.password,
        DateCreated: current_date
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
*  "message": "error of some kind"
*     }
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