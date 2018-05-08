'use strict';

var mongoose = require('mongoose'),
    envLoaded = require('./env/' + process.env.NODE_ENV);
/*
var testdb = mongoose.createConnection('localhost', 'drew');

testdb.on('error', function () {
    console.log('Error! Database connection failed.');
});

testdb.once('open', function (argument) {
    console.log('Database connection established!');
    console.dir(testdb);
    var current_date = (new Date()).valueOf().toString();
    var client = testdb.model('client');
    var v = new client({
        id: 'foo',
        Name: 'joe',
        Email: 'drew@aol.com',
        Type: 'type',
        DateCreated: current_date
    });

    v.save(function (err, client) {
        if (err){
            console.dir(err);
        } else {
            console.log('client created');
            console.dir(client);
        }

    });
    /*
     testdb.collectionNames(function (error, names) {
     if (error) {
     console.log('Error: '+ error);
     } else {
     console.log(names);
     };
     });
     */
//});


exports.userDBConnection = function (userDb, callback) {
    if (envLoaded.user){
        var userConn = mongoose.createConnection('mongodb://'+ envLoaded.user + ':' + envLoaded.pass + '@' + envLoaded.replset + userDb);
    } else{
        console.log('no envLoaded.user');
        console.log(envLoaded.db + userDb);
        var userConn = mongoose.createConnection(envLoaded.db + userDb, function(err){
            if (err) {
                console.log('Can not reach Mongo database');
                console.log(err);
            }
        });
    }
    userConn.on('error', function() {
        console.log('Error! Database connection failed to: ' + userDb);
    });
    userConn.once('open', function (argument) {
        console.log('Database connection established to: ' + userDb);
        callback(userConn);
    })
};