
//get the db model
var mongoose = require('mongoose');
var userDB = mongoose.model('userDB');

//includes utility functions to aid
var utility = require('../utility');



/*
 * GET a form to fill in new user information with blank infos
 */
exports.newuser = function(req, res) {

    //pass an empty variable since we are creating a new user
    var emptyUser = {
        firstName: "",
        lastName: "",
        emailAddress: "",
        socialNumber: "",
        birthDate: ""
    }

    //all fields are true, because we are creating a new user
    var emptyUserFailed = {
        firstName: true,
        lastName: true,
        emailAddress: true,
        socialNumber: true,
        birthDate: true
    }

    //userInfo, failed and whatFailed are used later for displaying userinfo when modifying
    res.render('userform', { title: 'UserDB', userInfo: emptyUser, failed: false, whatFailed: emptyUserFailed});
};


/*
 * GET old info for the user we are going to modify. renders the userform -page
 * with the old data filled in.
 */
exports.modifyuser = function(req, res) {

    var userId = req.param('id');

    //findbyid and then render the form page
    userDB.findById(userId, function(err, user) {

        //since we got the info from the db, everything is ok
        var validInformation = {
            firstName: true,
            lastName: true,
            emailAddress: true,
            socialNumber: true,
            birthDate: true
        }

        if (err) return console.error(err);

        res.render('userform', { title:'UserDB', userInfo: user, failed: false, whatFailed: validInformation });

    })
}


/*
 *POST new/update existing user info. In the begining we validate the info. If all the
 * fields dont pass validation, we need to render the userform again, and tell the user
 *  which text field was invalid.
 * When data is valid, we create a new db entry if we don't find a _id (not a old user.)
 * If a _id is found, we update the user information
 */
exports.createuser = function(req, res) {

    //check for invalid inputs
    var checked = utility.checkInfo(req.body);

    //collect the posted information from the form
    var info = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        socialNumber: req.body.socialNumber,
        birthDate: new Date( req.body.birthDate)
    }

    //iterate the different checked inputs to see if the user gave valid data
    for(var tmp in checked) {
        if(!checked[tmp]) {

            //display the userform again. whatFailed has information which text field has the invalid data.
            res.render('userform', { title: 'UserDB',userInfo: info, failed: true, whatFailed: checked });
            return;
        }
    }

    //we get the userid to see if we are creating a new user, or updating an old one
    var userId = req.param('id');

    //if not undefined, update old user information
    if (userId !== undefined ) {

        //update the gotten userinfo into the database
        userDB.update({_id: userId}, { $set: info }, function (err){
            if (err) return console.error(err);
        });

    } else {


        //check if theres a user with the same socialnumber since it must be unique
        userDB.find({"socialNumber": info.socialNumber}, function(err, result) {

            if (typeof result[0] !== 'undefined'){
                checked.socialNumber = false;
                return res.render('userform', { title: 'UserDB', userInfo: info, failed: true, whatFailed: checked });
            }


            //save a completely new user to the database if no uniques found.
            new userDB(info).save( function(err) {
                if (err) return console.error(err);
            });

            res.redirect('/');


        })



        //save a completely new user to the database.
        /*new userDB(info).save( function(err) {
                if (err) return console.error(err);
        });
        */

    }

    //res.redirect('/');
}


/*
*GET deletes the user with the given id, and redirects back to the mainpage
 */
exports.deleteuser = function(req, res) {

    var userId = req.param('id');

    userDB.remove({ _id: userId }, function (err) {
        if (err) return console.error(err);
    });

    res.redirect('/');
}



/*
 *GET info for a certain user. id is given as a param.
 */
exports.showinfo = function(req, res) {

    var userId = req.param('id');

    //searches the db for userinfo with the given id and render it
    userDB.findById(userId, function(err, user) {

        if (err) return console.error(err);

        res.render('userinfo', { title:'UserDB', userInfo: user });

    })

}
