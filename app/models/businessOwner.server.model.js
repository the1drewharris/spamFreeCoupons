'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var businessOwnerSchema = new Schema ({
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
    createdDate: {
        type: Date
    },
    businesses: [{
        id: {
            type: String
        }
    }]
});


mongoose.model('businessOwner', businessOwnerSchema);