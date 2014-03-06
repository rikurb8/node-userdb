/**
 * Created by r on 4.3.2014.
 * Helper functions to help in the validation of received data etc. misc. tasks
 */

var validator = require('validator');

module.exports = {

    //the main function responsible for the check of data gotten from the user
    //return: a json that tells what inputs are ok and which not
    checkInfo: function(userInfo) {

        //the json we are going to return, value true if input is ok, else false
        var formOk = {
            firstName: true,
            lastName: true,
            emailAddress: true,
            socialNumber: true,
            birthDate: true
        };

        //replace the scandinavian letters, since they are ok, but the validator
        //we are using doesn't recognize them
        var firstName = userInfo.firstName.replace(/ä|ö|å|Ä|Ö|Å/g, 'a');
        var lastName = userInfo.lastName.replace(/ä|ö|å|Ä|Ö|Å/g, 'a');

        //first the first and lastname, only chars are ok
        if (!validator.isAlpha(firstName) ) {

            formOk.firstName = false;
        }

        if (!validator.isAlpha(lastName)) {
            formOk.lastName = false;
        }

        //has to be email format, xxx@xxx.xxx
        if (!validator.isEmail(userInfo.emailAddress)) {
            formOk.emailAddress = false;
        }

        //check different criterias for the social security number
        if (!checkSocialNumber(userInfo.socialNumber, userInfo.birthDate)) {
            formOk.socialNumber = false;
        }

        var date = validator.toDate(userInfo.birthDate);
        if (!validator.isDate(date)) {
            formOk.birthDate = false;
        }

        return formOk;
    }

};

//check if the given social security number is in the correct form, and matches
//with the given birthdate
var checkSocialNumber = function(socialNumber, birthDate) {


    console.log(socialNumber);
    //birthDate = validator.toDate(birthDate);

    //when changing user data, the date is in a different format
    //and needs to be changed
    if (birthDate.search("(EET)") !== -1) {
        var tmp = birthDate.split(" ");

        var months = {'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05',
            'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'}

        var datetmp = months[tmp[1]] + '/' + tmp[2] + '/' + tmp[3];
        birthDate = datetmp;

    }

    //length has to be 11 chars to be a legit finnish social security number
    if (socialNumber.length != 11) return false;

    //check if the 6 first digits match the users birthdate
    var date = birthDate.substring(3, 5);
    date += birthDate.substring(0,2);
    date += birthDate.substring(8, 10);
    if (date !== socialNumber.substring(0,6)) return false;

    //7th char in the socialNumber is a checksum for the centry
    //1800- its supose to be: +
    //1900- its supose to be: -
    //2000- its supose to be: A
    var checks = {"18":'+', "19":'-', 20:'A'};
    var centry = birthDate.substring(6, 8);
    var check = socialNumber.substring(6, 7);
    if(checks[centry] !== check) return false;

    //the last char of the socialNumber is also a checksum
    //it is the determined by "first 6 chars % 31"
    //eg. 160390 % 31
    //the modulo is mapped to the hashtable underneath

    var modulos = { 0:"0", 1:"1", 2:"2", 3:"3", 4:"4", 5:"5", 6:"6", 7:"7",
                    8:"8", 9:"9", 10:"A", 11:"B", 12:"C", 13:"D", 14:"E", 15:"F",
                    16:"H", 17:"J", 18:"K", 19:"L", 20:"M", 21:"N", 22:"P",
                    23:"R", 24:"S", 25:"T", 26:"U", 27:"V", 28:"W", 29:"X", 30:"Y" }

    //calculate the checksum and compare it to the last char of the given socialnumber
    var lastDigit = socialNumber[10];
    var countedModulo = parseInt(socialNumber.substring(0, 6)) % 31;
    if (lastDigit !== modulos[countedModulo]) return false;

    //if we get here, socialnumber was ok
    return true;




}

