const express = require("express");
const router = express.Router({ mergeParams : true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listings");
const { isLoggedIn , validateReview, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviewController.js");

//review route - post route
router.post("/" , isLoggedIn,validateReview, wrapAsync( reviewController.createReviewController));

//review route - delete route 
router.delete("/:reviewId" ,isLoggedIn , isReviewAuthor, wrapAsync(reviewController.destroyReviewController));

module.exports = router ; 