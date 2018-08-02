'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * coupon Schema
 */
var couponSchema = new Schema ({
    id: {
        type: String,
        required: 'Must have an id for the coupon',
        unique: 'id must be unique'
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    repeatFrequency: {
        type: Array
    },
    category: {
        type: Array
    },
    status: {
        type: String
    },
    couponCode: {
        type: String
    },
    postalCode: {
        type: String
    },
    businessId: {
        type: String
    },
    dateAdded: {
        type: Date
    },
    dateDeleted: {
        type: Date
    }
});


mongoose.model('coupon', couponSchema);