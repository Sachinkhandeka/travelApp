const express = require("express");
const router = express.Router({ mergeParams : true});
const { isWishListOwner , isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

const wishlistController = require("../controllers/wishlistController");

router.post(
    "/" ,
    isLoggedIn,
    wrapAsync(wishlistController.postWishListController),
);

router.get(
    "/",
    isLoggedIn,
    wishlistController.getUsersWishList,
)
router.delete(
    "/:id",
    isLoggedIn,
    isWishListOwner,
    wrapAsync(wishlistController.destroyWishListItem),
)

module.exports = router ; 