/**
 * Created by r on 6.3.2014.
 */

//get the db model
var mongoose = require('mongoose');
var userDB = mongoose.model('userDB');

/*
 * GET a listing of all the users names.
 */
exports.index = function(req, res) {

    userDB.find(function(err, userlist) {
        if (err) return console.error(err);

        res.render('list', {title: 'UserDB', users: userlist});

    });
}