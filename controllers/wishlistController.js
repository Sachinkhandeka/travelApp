const Listing = require("../models/listings");
const WishList = require("../models/wishlist");

//post route for wishlist
module.exports.postWishListController = async(req ,res)=> {
    let { listingId } = req.body ; 

    let wishlistListing = await Listing.findById(listingId);
    let wishlistUserId = req.user._id ; 

    let newWishList = new WishList({
        user : wishlistUserId, 
        wishList : wishlistListing
    });

    let savedWishList = await newWishList.save();
    req.flash("success", "Item added to your Wishlist!!");
    res.redirect(`/listings/${listingId}`);
}

//get route for wishlist
module.exports.getUsersWishList = async(req ,res)=> {
    let currUser = req.user._id ; 
    let allWishList = await WishList.find({user : currUser}).populate("user").populate("wishList");
    res.render("./pages/wishlist.ejs" ,{ allWishList });
}

//delete route for wishlist
module.exports.destroyWishListItem = async(req ,res)=> {
    let { id } = req.params ;
    let currUser = req.user._id ; 

    const updatedWishList = await WishList.findOneAndDelete(
        { wishList : id },
        // { new : true }
    );
    if(!updatedWishList) {
        req.flash("error" , "Item not found in WishList");
        res.redirect("/wishlists/users");
    }

    console.log(updatedWishList);
    req.flash("success" , "Item removed from Wishlist");
    res.redirect("/wishlists/users");
}