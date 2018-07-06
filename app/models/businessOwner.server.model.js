'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    foo = 'anonymousCoupons';


var businessOwnerSchema = new Schema ({
    id: {
        type: String,
        required: 'Must have an id for the coupon',
        unique: 'id must be unique'
    },
    name: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        required: 'Email address is required',
        unique: 'There is already an account associated with that email address.',
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: 'password is required'
    },
    free: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    businessId: {
        type: String
    },
    businesses: [{
        id: {
            type: String
        }
    }],
    dateCreated: {
        type: Date
    }
});

/**
 * Hook a pre save method to hash the password
 */
businessOwnerSchema.pre('save', function(next) {
    console.log('in pre save');
    if (this.password) {
        console.log('this.password: ' + this.password);
        //this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        console.log('foo: ' + foo);
        this.password = this.hashPassword(this.password);
        console.log('pre save password result: ' + this.password);
    }

    next();
});

/**
 * Create instance method for hashing a password
 */
businessOwnerSchema.methods.hashPassword = function(password) {
    console.log('in hashPassword');
    if (foo && password) {
        console.log('foo && password: return hashed password using this.foo');
        console.log('this.foo: ' + foo);
        return crypto.createHash('sha1').update(foo + password).digest('hex');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
businessOwnerSchema.methods.authenticate = function(callback) {
    console.log('in authenticate');
    var checkPassword = this.password.toString();
    var hashedPassword = this.hashPassword(checkPassword).toString();
    //console.log('checkPassword: ' + checkPassword + ' hashPassword: ' + hashedPassword);
    //pull the hashed password for this user
    this.model('businessOwner').findOne({email: this.email}).exec(function (err, foundUser){
        //console.log('foundUser.password: ' + foundUser.password + ' hashPassword: ' + hashedPassword);
        //console.log('still in authenticate: ' + foundUser.password == hashedPassword);
        //this.auth = foundUser.password === hashedPassword;
        callback(foundUser.password == hashedPassword);
    });
};

mongoose.model('businessOwner', businessOwnerSchema);