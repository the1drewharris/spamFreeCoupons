'use strict';

exports.authenticate = function (req, res) {
    console.log('in auth');
    console.log(req.user);
    if (req.user) {
        res.status(200).send(true);
    } else {
        console.log('foo');
        res.status(200).send(false);
    }
};
