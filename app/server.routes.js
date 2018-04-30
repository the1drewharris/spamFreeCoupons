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
router.post('/business/create', business.create);
router.post('/business/update', business.update);
router.delete('/business/delete/:id', business.delete);

/*
 * businessOwner ROUTES
 * @type {exports|module.exports}
 */
var businessOwner = require('./controllers/businessOwner.server.controller.js');
router.get('/businessOwner/list', businessOwner.list);
router.get('/businessOwner/detail/:id', businessOwner.detail);
router.post('/businessOwner/create', businessOwner.create);
router.post('/businessOwner/update', businessOwner.update);
router.delete('/businessOwner/delete/:id', businessOwner.delete);

/*
 * coupon ROUTES
 * @type {exports|module.exports}
 */
var coupon = require('./controllers/coupon.server.controller.js');
router.get('/coupon/list', coupon.list);
router.get('/coupon/detail/:id', coupon.detail);
router.post('/coupon/create', coupon.create);
router.post('/coupon/update', coupon.update);
router.delete('/coupon/delete/:id', coupon.delete);

module.exports = router;