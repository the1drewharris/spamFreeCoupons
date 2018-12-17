'use strict';

exports.authenticate = function (req, res) {
    console.log(req.user);
    if (req.user) {
        res.status(200).send(true);
    } else {
        res.status(200).send(false);
    }
};
