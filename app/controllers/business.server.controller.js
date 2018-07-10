'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    businessModel = require('../models/business.server.model.js'),
    business = mongoose.model('business'),
    crypto = require('crypto'),
    async = require('async');



var accountSid = 'ACd48994f8b5519fcdd48822353ec64b2f',
    authToken = 'bd0cd72dfe7e7d82a41cec4283f2058b',
    client = require('twilio')(accountSid, authToken);

/**
 * @api {post} /business/create
 * @apiName create
 * @apiGroup business
 *
 * @apiParam {companyName} companyName
 * @apiParam {address} address
 * @apiParam {city} city
 * @apiParam {state} state
 * @apiParam {postalCode} postalCode
 * @apiParam {phone} phone
 * @apiParam {websiteURL} websiteURL
 * @apiParam {facebook} facebook
 * @apiParam {instagram} instagram
 * @apiParam {twitter} twitter
 * @apiParam {picture} picture
 * @apiParam {status} status
 * @apiParam {coupons} coupons
 * @apiParam {dateAdded} dateAdded
 * @apiParam {dateClaimed} dateClaimed
 * @apiParam {dateRemoved} dateRemoved
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
    var v = new business({
        id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
        companyName: req.body.companyName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        phone: req.body.phone,
        websiteURL: req.body.websiteURL,
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        twitter: req.body.twitter,
        picture: req.body.picture,
        status: req.body.status,
        coupons: req.body.coupons,
        businessOwnerId: req.body.businessOwnerId,
        dateAdded: current_date,
        dateClaimed: req.body.dateClaimed,
        dateRemoved: req.body.dateRemoved

    });

    v.save(function (err, business) {
        if (err) {
            return res.status(400).send({
                message:  err
            });
        } else {
            res.status(200).send({success: true, id: business.id});
        }
    });

};

/**
 * @api {get} /business
 * @apiName list
 * @apiGroup business
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {business}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.list = function (req, res) {
    business.find().sort('-type').exec(function (err, businesses) {
        if (!business.length) {
            res.status(200).send({businesses: businesses})
        } else {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.jsonp(businesses);
            }
        }
    });
};

/**
 * @api {get} /business
 * @apiName detail
 * @apiGroup business
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {business}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.detail = function (req, res) {
    business.findOne({id: req.params.id}).sort('-type').exec(function (err, business) {
        if (!business) {
            res.status(200).send()
        } else {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                res.jsonp(business);
            }
        }
    });
};

/**
 * @api {post} /business
 * @apiName search
 * @apiGroup business
 *
 * @apiParam {businessOwnerId} businessOwnerId
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {business}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.search = function (req, res) {
    var query = req.body;
    business.find(query).sort('-type').exec(function (err, businesses) {
        if (!business) {
            res.status(200).send({business: businesses})
        } else {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.jsonp(businesses);
            }
        }
    });
};

/**
 * @api {post} /business
 * @apiName setCode
 * @apiGroup business
 *
 * @apiParam {businessid} businessid
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
exports.setCode = function (req, res) {
    var query = {id: req.body.id};
    var code = {
        verifyCode: crypto.randomBytes(4).toString('hex')
    };
    business.findOneAndUpdate(query, code, {upsert: true}, function (err) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.status(200).send(code);
        }
    });
};

exports.sendCode = function (req, res) {
    var businessCode = '';

    async.series([
        function(callback) {

            business.findOne({id: req.params.id}).sort('-type').exec(function (err, business) {
                if (!business) {
                    console.log('no business found with that Id')
                } else {
                    businessCode = business.verifyCode
                }
            callback();
            });


        },

        function() {

            console.log(businessCode);
            console.log('in send code function for bizId: ' + req.params.id + ' With code: ' + businessCode);
            client.calls.create({
                    url: 'https://handler.twilio.com/twiml/EH709db3cd5812c6bf1722fe5f6811eddb?code=' +  businessCode,
                    to: '+19188042101',
                    from: '+19189927111'
                },
                function (err) {
                    if(err) {
                        return res.status(400).send({
                            message: err
                        });
                    } else {
                        return res.status(200).send({
                            body: 'congrats, your phone will ring with your code. Business id: ' + req.params.id + ' With code: ' + businessCode
                        })
                    }
                });
        }
    ])
};

/**
 * @api {post} /business
 * @apiName update
 * @apiGroup business
 *
 * @apiParam {businessid} businessid
 * @apiParam {updatedbusiness} Updatebusiness
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
    business.findOneAndUpdate(query, req.body, {upsert: true}, function (err, doc) {
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
 * @api {delete} /business/:business
 * @apiName delete
 * @apiGroup business
 *
 * @apiParam {businessid} businessid
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
    business.remove(query, function (err, doc) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.status(200).send({results: doc});
        }

    })
};
