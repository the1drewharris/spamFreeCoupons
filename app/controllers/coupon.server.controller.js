'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    businessModel = require('../models/business.server.model.js'),
    business = mongoose.model('business'),
    crypto = require('crypto');

/**
 * @api {post} /business
 * @apiName add coupon
 * @apiGroup business
 *
 * @apiParam {businessid} businessid
 * @apiParam {coupon} coupon
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
exports.addCoupon = function (req, res) {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var query = {id: req.body.id};
    var newCoupon = req.body.coupons;
    newCoupon.couponId = crypto.createHash('sha1').update(current_date + random).digest('hex');
    business.findOneAndUpdate(query, {$push: {coupons: newCoupon}}, {upsert: true}, function (err, doc) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.status(200).send({id: req.body.id});
        }
    });
};


/**
 * @api {get} /coupon
 * @apiName list
 * @apiGroup coupon
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {coupon}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.list = function (req, res) {
    coupon.find().sort('-type').exec(function (err, coupons) {
        if (!coupon.length) {
            res.status(200).send({coupons: coupons})
        } else {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.jsonp(coupons);
            }
        }
    });
};

/**
 * @api {get} /coupon
 * @apiName detail
 * @apiGroup coupon
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {coupon}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.detail = function (req, res) {
    coupon.findOne({id: req.params.id}).sort('-type').exec(function (err, coupon) {
        if (!coupon) {
            res.status(200).send()
        } else {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                res.jsonp(coupon);
            }
        }
    });
};

/**
 * @api {post} /coupon
 * @apiName update
 * @apiGroup coupon
 *
 * @apiParam {couponid} couponid
 * @apiParam {updatedcoupon} Updatecoupon
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
    coupon.findOneAndUpdate(query, req.body, {upsert: true}, function (err, doc) {
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
 * @api {post} /business
 * @apiName remove coupon
 * @apiGroup business
 *
 * @apiParam {businessid} businessid
 * @apiParam {coupon} coupon
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
exports.removeCoupon = function (req, res) {
    var query = {id: req.body.id};
    business.findOneAndUpdate(query, {$pull: {coupons: {couponId: req.body.couponId}}}, {upsert: true}, function (err, doc) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.status(200).send({results: doc});
        }
    });
};