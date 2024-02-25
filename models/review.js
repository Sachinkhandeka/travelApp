const mongoose = require("mongoose");
const Listing = require("./listings");

const reviewSchemma  = new mongoose.Schema({
    comment : {
        type : String ,
        required : true,
    } , 
    rating : {
        type : Number ,
        min : 1,
        max : 5,  
        required : true
    } ,
    createdAt : {
        type : Date,
        default : Date.now()
    },
    author : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User",
    }

});

const Review = mongoose.model("Review" , reviewSchemma);
module.exports = Review ; 