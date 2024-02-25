const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsyn = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");
const { saveRedirectUrl , isLoggedIn } = require("../middleware");

const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const userController = require("../controllers/userController");

//signup routes
router.route("/signup")
   .get(userController.getSignupFormController)
   .post(  
        saveRedirectUrl,
        upload.single('user[avatar]'), 
        wrapAsyn(userController.createUserController)
    );

//login routes
router.route("/login")
    .get(userController.getLoginFormController)
    .post(
        saveRedirectUrl,
        passport.authenticate("local" , {failureRedirect : "login", failureFlash : true}),
        userController.loginUserController,
    );

//logout route
router.get("/logout" , userController.logoutUserController);


module.exports = router