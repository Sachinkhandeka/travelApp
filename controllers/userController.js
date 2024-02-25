const User = require("../models/user");
const Listing = require("../models/listings");
const WishList = require("../models/wishlist");

module.exports.getSignupFormController = (req ,res)=> {
    res.render("users/signup");
}

//signup post callback 
module.exports.createUserController = async(req ,res)=> {
    try {
        let { user } = req.body; 
        const password = user.password ;

        let url = req.file.path ;
        let filename  = req.file.filename; 

        const newUser = new User(user);
        newUser.avatar = { url , filename };

        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser , (err)=> {
            if(err) {
                return next(err);
            }
            req.flash("success"  , "Welcome to Wanderlust");
            let redirectUrl = res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
        });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("signup");
    }
}

//get login form callback 
module.exports.getLoginFormController = (req ,res)=> {
    res.render("users/login");
}

//log in post route callback 
module.exports.loginUserController =  async(req ,res)=> {
    let { username ,password } = req.body ; 
    
    req.flash("success" , "Welcome back to Wanderlust");
   
    let redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
}

//logout user callback 
module.exports.logoutUserController = (req ,res , next)=> {
    req.logOut((err)=> {
        if(err) {
            return next(err);
        }
        req.flash("success" , "logged out successfully");
        res.redirect("/listings");
    });
}
