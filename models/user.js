const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
        type : String,
        required : true
    },
    lastName: {
        type : String,
        required : true
    },
    avatar : {
        url : String,
        filename : String,
     },
    dateOfBirth: {
        type : String,
        required : true
    },
    phoneNumber: {
        type : Number,
        required : true
    },
});
userSchema.plugin(passportLocalMongoose);


module.exports =  mongoose.model("User" , userSchema); 