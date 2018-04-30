'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * admin Schema
 */
var adminSchema = new Schema ({
    id: {
        type: String,
        required: 'Must have an id for the admin',
        unique: 'id must be unique'
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    dateCreated: {
        type: Date
    }
});


mongoose.model('admin', adminSchema);