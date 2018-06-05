'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * clients Schema
 */
var businessSchema = new Schema ({
    id: {
        type: String,
        required: 'Must have an id for the business',
        unique: 'id must be unique'
    },
    companyName: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    postalCode: {
        type: String
    },
    phone: {
        type: String
    },
    websiteURL: {
        type: String
    },
    facebook: {
        type: String
    },
    instagram: {
        type: String
    },
    twitter: {
        type: String
    },
    picture: {
        type: String
    },
    status: {
        type: String
    },
    coupons: [{
        id: {
            type: String
        }
    }],
    dateAdded: {
        type: Date
    },
    dateClaimed: {
        type: Date
    },
    dateRemoved: {
        type: Date
    }
});


mongoose.model('business', businessSchema);