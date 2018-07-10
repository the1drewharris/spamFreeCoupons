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
 * admin ROUTES
 * @type {exports|module.exports}
 */
var admin = require('./controllers/admin.server.controller.js');
router.get('/admin/list', admin.list);
router.get('/admin/detail/:id', admin.detail);
router.get('/admin/signOut',admin.signOut);
router.get('/admin/me', admin.me);
router.post('/admin/signIn',admin.signIn);
router.post('/admin/create', admin.create);
router.post('/admin/update', admin.update);
router.delete('/admin/delete/:id', admin.delete);

/*
 * business ROUTES
 * @type {exports|module.exports}
 */
var business = require('./controllers/business.server.controller.js');
router.get('/business/list', business.list);
router.get('/business/detail/:id', business.detail);
router.get('/sendCode/:id', business.sendCode);
router.post('/business/search', business.search);
router.post('/business/create', business.create);
router.post('/business/update', business.update);
router.post('/business/setCode', business.setCode);
router.delete('/business/delete/:id', business.delete);


/*
 * businessOwner ROUTES
 * @type {exports|module.exports}
 */
var businessOwner = require('./controllers/businessOwner.server.controller.js');
router.get('/businessOwner/list', businessOwner.list);
router.get('/businessOwner/detail/:id', businessOwner.detail);
router.get('/businessOwner/signOut',businessOwner.signOut);
router.get('/businessOwner/me', businessOwner.me);
router.post('/businessOwner/search', businessOwner.search);
router.post('/businessOwner/signIn',businessOwner.signIn);
router.post('/businessOwner/create', businessOwner.create);
router.post('/businessOwner/update', businessOwner.update);
router.delete('/businessOwner/delete/:id', businessOwner.delete);

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

var authentication = require('./controllers/authentication.server.controller.js');
router.get('/authentication/authenticate', authentication.authenticate);

module.exports = router;