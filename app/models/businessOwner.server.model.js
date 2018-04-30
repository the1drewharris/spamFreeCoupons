'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * clients Schema
 */
var couponSchema = new Schema ({
    id: {
        type: String,
        required: 'Must have an id for the coupon',
        unique: 'id must be unique'
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    businesses: {
        type: Array
    }
});


mongoose.model('coupon', couponSchema);