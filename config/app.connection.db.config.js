'use strict';

var mongoose = require('mongoose'),
    envLoaded = require('./env/' + process.env.NODE_ENV);
console.dir(process.env,NODE_ENV);
exports.appDBConnection = function (callback) {
    if (envLoaded.user){
        var appdb = mongoose.createConnection('mongodb://'+ envLoaded.user + ':' + envLoaded.pass + '@' + envLoaded.replset + envLoaded.dbname, function(err){
            if (err){
                console.log('Can not reach Mongo database');
                console.log(err);
            }
            //console.dir(appdb);
            callback(appdb);
        });
    } else{
        var appdb = mongoose.createConnection(envLoaded.db + envLoaded.dbname, function(err){
            if (err) {
                console.log('Can not reach Mongo database');
                console.log(err);
            }
            //console.dir(appdb);
            callback(appdb);
        });
    };
};