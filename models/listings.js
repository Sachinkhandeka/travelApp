const mongoose = require("mongoose");
const Review = require("./review");

const listingSchema = new mongoose.Schema({
    title : {
        type : String ,
        required : true,
    },
    description : {
        type : String ,
        required : true, 
    },
    image : {
        url : String,
        filename : String,
     },
    price : {
        type : Number,
    },
    location : {
        type : String
    },
    country : {
        type : String,
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId , 
            ref : "Review",
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    geometry : {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }, 
    category : {
        type : String , 
        enum : ["Amazing-View","Play","Tiny-Home","Tree-House","Farm","Amazing-Pools","Arctic","Beach","Mountain","Peaceful","Wild-Life","OMG","Yoga","Nature","Trending"]
    }
});

listingSchema.post("findOneAndDelete" , async(listing)=> {
    try {
        if(listing) {
            await Review.deleteMany({_id : { $in : listing.reviews }});
        }
    } catch(err) {
        console.log(err);
    }
});

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing ;