'use strict';

var mongoose = require('mongoose');
var async = require('async'),
    request = require('superagent'),
    fs = require('fs-extra'),
    _ = require('lodash');

//vars to do database manipulation
var envLoaded = require('../../config/env/' + process.env.NODE_ENV);
// Connection URL
var url;
if (!envLoaded.db) {
    url = 'mongodb://' + envLoaded.user + ':' + envLoaded.pass + '@' + envLoaded.replset + envLoaded.dbname;
} else {
    url = envLoaded.db;
}

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


exports.index = function (req, res) {
    // console.log('called')
    /*
    * This if does not seem to work correctly
    if (!mongoose.connections._hasOpened){
     console.log('connection is not open');
     res.render('error')
     } else
     */
    //console.log('in core.server.controller.js: 32 - req.user: ')
    //console.dir(req.user);
    if (req.user) {
        //console.dir(req.user.displayName);
        res.render('index', {
            user: req.user,
            env: process.env.NODE_ENV,
            request: req
        });
    } else {
        //res.render('index');
        res.render('signin');
    }
    //  }

};


/**
 * Provides versioning information for the app.
 * Expects ./deploy-properties.json to exist for deployment related info (buildNumber, gitBranch, etc.)
 * If ./deploy-properties does not exist, only the package.json version & node version are provided.
 * @param req
 * @param res
 */
exports.version = function(req, res) {
    var packageJson = fs.readJsonSync('./package.json');
    var versionJson = {
        version: packageJson.version,
        nodeVersion: process.version
    };

    fs.stat('./deploy-properties.json', function (err, stats) {
        if (err) {
            console.log("Error retrieving deploy-properties file: " + err);
        }
        else {
            _.extend(versionJson, fs.readJsonSync('./deploy-properties.json'));
        }
        res.json(versionJson);
    });
};
/**
 * Provides release notes for the app.
 * Expects ./releaseNotes.txt to exist for.
 * If ./releaseNotes.txt does not exist, and empty string is returned and an error is logged.
 * @param req
 * @param res
 */
exports.releaseNotes = function(req, res) {
    var releaseNotes = "";
    fs.stat('./releaseNotes.txt', function (err, stats) {
        if (err) {
            console.log("ERROR", __function, "Missing releaseNotes.txt", req, res)
        }
        else {
            releaseNotes = fs.readFileSync('./releaseNotes.txt');
        }
        res.type('text/plain');
        res.send(releaseNotes);
    });
};

var myseeds = [];
var savemessage = [],
    querymessage = [],
    errormessage = [],
    updatemessage = [];



function getSeeds (myModel,myMode,mySeeds,dupField,app,triggeraudit,limit,offset) {
    return new Promise(function (fulfill, reject) {
        myseeds = mySeeds.seed(limit,offset,function (err, res) {
            if (err) {
                reject(err);
                console.log('Error getting seeds: ' + err);
            } else {
                fulfill(res);
                myseeds = res;
                //console.log('myseeds: ');
                //console.dir(myseeds);
                plantSeeds(myModel,myMode,dupField,app,myseeds);
            }
        });
        //console.dir(myseeds);
    });
}

function plantSeeds (myModel,myMode,dupField,app,myseeds) {
    //output the vars to the console
    console.log('plantSeeds app: ' + app);
    //console.log(myModelFile);
    //console.log(myModel);
    console.log('seed length: ' + myseeds.length);
    console.log('mode: ' + myMode);

    //switch on the mode append will be the default because it is the least intrusive
    if (myMode == 'dropAppend' || myMode == 'dropappend') {

        //drop the entire collection and add our seeds
        myModel.remove(app, function (err, result) {
            if (err) {
                var dropmessage = console.log("ERROR", __function, err, req, res)
            } else {
                //loop over mySeeds array
                for (var i = 0; i < myseeds.length; i++) {
                    var currentSeed = myseeds[i];
                    var finalSeed = _.omit(currentSeed, '_id');
                    finalSeed = _.omit(finalSeed, '__v');
                    //add the current seed
                    var seed = new myModel(finalSeed);
                    seed.save(function (err) {
                        if (err) {
                            savemessage[i] = console.log("ERROR", __function, err, req, res)
                        } else {
                            savemessage[i] = i + ' seed saved';
                            console.log(savemessage[i]);
                        }
                    })
                }
            }
        });

        var thisMode = 'drop and append';
        console.log(thisMode);

    } else if (myMode == 'updateAppend' || myMode == 'updateappend') {

        // loop over mySeeds array
        if (typeof myseeds !== 'undefined' && myseeds.length > 0) {
            for (var i = 0; i < myseeds.length; i++) {
                (function (i) {
                    var currentSeed = myseeds[i]; // current seed in iteration
                    //console.log('current seed : ' + JSON.stringify(currentSeed)); // let's look at the current seed

                    var myDupValue = currentSeed[dupField]; // field we are comparing in current seed iteration
                    var objSend = {}; //
                    objSend[dupField] = myDupValue.trim();
                    console.log('need to search using this: ' + JSON.stringify(objSend));

                    //query to see if we find a matching record
                    var query = myModel.find(objSend);

                    query.exec(function (err, duplicates) {
                        // console.log('queryPrefunction: ' + duplicates);
                        (function (i) {
                            // console.log([i] + ': query result:' + duplicates);
                            // var seedId = currentSeed._id;
                            // console.log('this is our current seed id : ' + seedId);

                            var finalSeed = _.omit(currentSeed, '_id');

                            // console.log('preIF dup found - Id for current record:' + seedId);
                            // console.log(duplicates);
                            // console.log(finalSeed);

                            if (err) {
                                // querymessage[i] = console.log("ERROR", __function, err, req, res)
                                console.log(err);
                            } else {

                                //check to see if there was a record found
                                if (typeof duplicates === 'undefined' || duplicates.length <= 0) {
                                    //no dup found
                                    console.log('no dup found so we need to ADD');
                                    // seedId = currentSeed._id;
                                    finalSeed = _.omit(currentSeed, '_id');
                                    finalSeed = _.omit(finalSeed, '__v');
                                    // console.log('ADD: seed without _id: ' + finalSeed);

                                    //add the current seed
                                    var seed = new myModel(finalSeed);
                                    seed.save(function (err) {
                                        if (err) {
                                            savemessage[i] = console.log("ERROR", err);
                                            console.log('error adding as new record: ' + err);
                                        } else {
                                            savemessage[i] = i + ' seed saved';
                                            console.log(savemessage[i]);
                                        }
                                    })
                                } else {
                                    //duplicate found, simply update the record
                                    if (duplicates.length > 0) {
                                        console.log('duplicate found, so we need to update this record: ' + duplicates[0]._id);
                                        //console.log('duplicate: ' + JSON.stringify(duplicates));

                                        // ** This is the broken part **
                                        /*
                                         var stringDup = JSON.stringify(duplicates);
                                         console.log('stringify dup: ' + stringDup);

                                         var myDup = JSON.parse('{"dupes":'+stringDup+'}');
                                         console.log('myDup: ' + myDup);
                                         */
                                        // var updateId = myDup.dupes[0]._id;
                                        var updateId = duplicates[0]._id;

                                        finalSeed = _.omit(currentSeed, '_id');
                                        finalSeed = _.omit(finalSeed, '__v');
                                        var findQuery = myModel.find({_id: updateId});

                                        console.log('UPDATE: updateId to use in findOneAndUpdate: ' + updateId);

                                        //update the record
                                        myModel.findOneAndUpdate(findQuery, finalSeed, {upsert: false}, function (err, doc) {
                                            if (err) {
                                                //updatemessage[i] = console.log("ERROR", __function, err, req, res)
                                                console.log('error updating existing record: ');
                                                console.dir(err);
                                            } else {
                                                console.log(i + ' seed updated');
                                            }

                                        });

                                        //end if duplicates.length > 0
                                    } else {
                                        console.log('there was no length to the duplicates')
                                    }
                                }
                                //end if there was no error found in executing the duplicate find query
                            }
                            //Close function after query exec
                        })(i);
                    });
                    //close something
                })(i);
                //close for loop
            }
            thisMode = 'update and append';
            console.log(thisMode);
        } else {
            console.log('seeds: ')
            console.dir(myseeds);
            //console.log(err);
            console.error('There are no seeds for ' + app + '.');
        }
    } else {

        //if we find a matching record ignore that seed and move onto the next
        //if we do not find a matching record append the seed to the existing recordset
        //loop over mySeeds array

        for (var i = 0; i < myseeds.length; i++) {
            (function (i) {
                var currentSeed = myseeds[i];
                var myDupValue = currentSeed[dupField];
                var objSend = {};
                objSend[dupField] = myDupValue;
                console.log(objSend);
                // should be {'dupFieldProp':'myDupValueValue'}
                //try to dynamically build your search string
                //var searchStr = '{"'+dupField + '":"' + myDupValue + '"}';
                console.log('1: myDupValue - ' + i + '= ' + myDupValue);
                console.log('1: search string - ' + i + '= ' + objSend);
                //query to see if we find a matching record
                //var query = myModel.find(_id: myDupValue);
                var query = myModel.find(objSend);
                query.exec(function (err, duplicates) {
                    //check to see if there was a record found
                    console.log('2: myDupValue - ' + i + '= ' + myDupValue);
                    console.log('2: search string - ' + i + '= ' + objSend);
                    //console.log('query: ' + query);
                    console.log('dup found:' + duplicates);
                    //console.log('length of dups found = ' + duplicates.length);
                    if (err) {
                        querymessage[i] = console.log("ERROR", __function, err, req, res)
                        errormessage[i] = err;
                    } else {

                        if (typeof duplicates === 'undefined' || duplicates == "" || duplicates == null) {
                            //no dup found
                            console.log('no dup found so we need to ADD');
                            //no duplicate found
                            var seedId = currentSeed._id;
                            var finalSeed = _.omit(currentSeed, '_id');
                            finalSeed = _.omit(finalSeed, '__v');
                            //add the current seed
                            var seed = new myModel(finalSeed);
                            console.log('should add new record' + i + finalSeed);
                            seed.save(function (err) {
                                if (err) {
                                    savemessage[i] = console.log("ERROR", __function, err, req, res)
                                    console.log(err);
                                } else {
                                    savemessage[i] = i + ' seed saved';
                                    console.log(savemessage[i]);
                                }
                            })

                        } else {
                            //we have a record already there
                            savemessage[i] = i + 'seed already there: ' + duplicates + 'not added';
                            console.log(savemessage[i]);
                        }
                    }
                });
                //close something
            })(i);
            //close for loop
        }
        thisMode = 'append';
        console.log(thisMode);
    }
}


exports.seed = function (req, res) {
    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
    /*TODO: Add check to see if seeds already exist in mongo
     * this can be done by looping over each item and the array and checking to see
     * IF that _id or "DupCheck" data element is already there...
     * THEN if NOT  do a standard create for it vs. a bulk/batch insert
     * for each item in the array
     */
    if (typeof req.params.app !== 'undefined' && req.params.app) {
        // Set the app var and include the correct file dyamically
        console.log('started seed');
        var app = req.params.app;
        // I had to comment this dynamic model include out because it was causing mongo schema issues
        // var myModelFile = require('../models/' + app + '.server.model');
        var upperModel = app.toProperCase();
        var myModel = mongoose.model(upperModel);
        var mySeeds = require('../seeds/' + app + '.js');
        var myMode = req.params.mode,
            savemessage = [],
            querymessage = [],
            errormessage = [],
            updatemessage = [],
            dupField = req.params.field,
            //left off here... need to check this as defaults vs false
            limit = false,
            offset = false,
            triggeraudit = true,
            batch = 500,
            totalcount = 0;
        console.log('1: batch: ' + batch);
        if (typeof req.body.triggeraudit !== "undefined") {
            triggeraudit = req.body.triggaudit;
        }

        if (typeof req.body.batch !== "undefined") {
            limit = req.body.batch;
            batch = req.body.batch;
        }
        console.log('2: batch: ' + batch);
        //console.dir(req);
        getSeeds(myModel, myMode, mySeeds, dupField, app, triggeraudit, limit, offset);
        console.log('2: totalcount: ' + totalcount);
        console.log('3: batch: ' + batch);


        if (triggeraudit) {
            //FIXME: Audit.create is not a function
            // Audit.create('TT', 'Seed ran', req.body, 'Seeds', req.method, res.body);
        }
        res.status(200).send({
            success: true,
            savemessage: savemessage,
            updatemessage: updatemessage,
            querymessage: querymessage,
            errormessage: errormessage
        });
    } else {
        res.status(412).send({success: false, message: 'req.params.app is undefined in URL request'});
    }

};