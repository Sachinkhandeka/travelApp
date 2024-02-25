const Review = require("../models/review");
const Listing = require("../models/listings");

//review calback - post route 
module.exports.createReviewController = async(req ,res)=> {
    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id ; 
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success" , "Review Added Successfully");
    res.redirect(`/listings/${req.params.id}`);
}

//destroy review calback - delete route 
module.exports.destroyReviewController = async(req ,res)=> {
    let { id , reviewId } = req.params ; 

    await Listing.findByIdAndUpdate(id , { $pull : { reviews : reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}