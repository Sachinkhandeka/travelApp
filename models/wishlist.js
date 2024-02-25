const mongoose = require("mongoose");

const wishLististSchema = new  mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    wishList : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Listing",
        }
    ]
});

const WishList = mongoose.model("WishList", wishLististSchema);
module.exports = WishList ; 