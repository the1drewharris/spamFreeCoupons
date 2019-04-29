'use strict';

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    core = require('./controllers/core.server.controller.js');

app.use(passport.initialize());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

router.get('/',core.index);


/*
 * business ROUTES
 * @type {exports|module.exports}
 */
var business = require('./controllers/business.server.controller.js');
router.get('/business/list', business.list);
router.get('/business/detail/:id', business.detail);
router.get('/business/sendCode/:id', business.sendCode);
router.post('/business/search', business.search);
router.post('/business/create', business.create);
router.post('/business/update', business.update);
router.post('/business/setCode', business.setCode);
router.delete('/business/delete/:id', business.delete);


/*
 * user ROUTES
 * @type {exports|module.exports}
 */
var user = require('./controllers/user.server.controller.js');
router.get('/user/list', user.list);
router.get('/user/detail/:id', user.detail);
router.get('/user/signOut',user.signOut);
router.get('/user/me', user.me);
router.post('/user/search', user.search);
router.post('/user/signIn',user.signIn);
router.post('/user/create', user.create);
router.post('/user/update', user.update);
router.delete('/user/delete/:id', user.delete);


/*
 * coupon ROUTES
 * @type {exports|module.exports}
 */
var coupon = require('./controllers/coupon.server.controller.js');
router.post('/coupon/create', coupon.create);
router.get('/coupon/list', coupon.list);
router.get('/coupon/detail/:id', coupon.detail);
router.post('/coupon/search', coupon.search);
router.post('/coupon/update', coupon.update);
router.delete('/coupon/delete/:id', coupon.delete);
router.delete('/coupon/bDelete/:businessId', coupon.bDelete);


var authentication = require('./controllers/authentication.server.controller.js');
router.get('/authentication/authenticate', authentication.authenticate);

module.exports = router;