const express = require("express");
const router = express.Router();
const Listing = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner ,  validateListing } = require("../middleware");

const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listingController");

//creating new Listing 
router.get("/new" , isLoggedIn, (req ,res)=> {
    res.render("./pages/new.ejs");   
});

//filter route 
router.get(
    "/search",
   wrapAsync(listingController.filterController));

//router.route 
router.route("/")
    //index route
   .get(listingController.indexController)
   //post route for new Listing 
   .post(
       isLoggedIn,
       upload.single('listing[image]'), 
       validateListing,
       wrapAsync(listingController.createNewController)
   );


// router.post("/" ,upload.single('listing[image]'), (req ,res)=> {
//     res.send(req.file.filename);
// });


//router.route - view,update,delete
router.route("/:id")
    //view route 
   .get(wrapAsync(listingController.viewController))
   //updating listing -post route
   .put(
       isLoggedIn,
       isOwner,
       upload.single('listing[image]'), 
       validateListing,
       wrapAsync(listingController.updateListingController)
    )
    //delete route 
    .delete( 
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListingController)
    );

//getting form for update route 
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editFormController)
);

//filter route 
router.get(
    "/category/:filterId",
    listingController.filterListingController,
)




module.exports = router ;