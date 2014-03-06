/**
 * Created by r on 3.3.2014.
 */

var mongoose = require("mongoose");

//configure the db connection
mongoose.connect('mongodb://localhost:27017/users');
var db = mongoose.connection;
db.once('open', function callback() {
    console.log("DB connection successful");
});


//set up the schema for the db
var Schema = mongoose.Schema;
var userDB = new Schema({
    firstName: String,
    lastName: String,
    emailAddress: String,
    socialNumber: String,
    birthDate: Date
});

//set the model for later use
mongoose.model('userDB', userDB);
