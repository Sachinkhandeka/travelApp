const Listing = require("./models/listings");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schemaValidation");
const WishList = require("./models/wishlist");

//middlewares 
module.exports.isLoggedIn = (req ,res,next)=> {
    if(!req.isAuthenticated()) {
        // redirect URL
        req.session.redirectUrl = req.originalUrl ; 
        req.flash("error", "Please Login on wanderlust first");
        return res.redirect("/users/login");
    } 
    next();
}

module.exports.saveRedirectUrl = (req ,res , next)=> {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl ; 
    }
    next();
}

module.exports.isOwner = async(req ,res , next)=> {
    const { id } = req.params ; 
    const listing = await Listing.findById(id);
    if( !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error" , "Authorization Failed !! Please Try with Correct User Info");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//1 } validate Listing Schema 
module.exports.validateListing = (req ,res ,next)=>  {
    let { error } = listingSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el)=> {
            return el.message ;
        }).join(",");
        throw new ExpressError(400 , errMsg);
    }
    next();
}
//2} validate review sschema 
module.exports.validateReview = (req , res ,next)=> {
    let { error } =  reviewSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el)=> {
            return el.message ; 
        }).join(",");
        throw new ExpressError(400 , errMsg);
    }
    next();
}

module.exports.isReviewAuthor = async(req ,res , next)=> {
    const {id , reviewId } = req.params ; 
    const review = await Review.findById(reviewId);
    if( !review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error" , "Authorization Failed !! Please Try with Correct User Info");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//checking for owner of wishlist 
module.exports.isWishListOwner = async(req ,res ,next)=> {
    let { id } = req.params ;
    const wishList = await WishList.find({ wishList : id }).populate("user");

    if(!wishList[0].user._id.equals(res.locals.currUser._id)) {
        req.flash("error" , "Authorization Failed !! Please Try with Correct User Info");
        return res.redirect("wishlists/users");
    }
    next();
}