if(process.env.NODE_ENV != "production") {
   require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 8080 ;
const mongoose = require("mongoose") ;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter =  require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const wishListRouter = require("./routes/wishlist.js");
const { isLoggedIn } = require("./middleware.js");

app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.static(path.join(__dirname ,"public")));
app.use(express.urlencoded({ extended : true }));

app.set("views" , path.join(__dirname , "/views"));
app.set("view engine" , "ejs");
app.engine("ejs" , ejsMate);

const DB_URL = process.env.MONOG_ATLAS_URL;

main().then(()=> {
    console.log("connection to wanderlust successful!!");
})
.catch((err)=> {
    console.log(err);
});

async function main() {
    mongoose.connect(DB_URL);
}

//creating mongo-store
const store = MongoStore.create({
    mongoUrl : DB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

store.on("error", (err)=> {
    console.log("ERROR IN MONGO SESSION STORE" , err);
})

//session options 
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires : Date.now() + 8 * 24 * 60 * 60 * 1000,
        maxAge : 8 * 24 * 60 * 60 * 1000,
        hhtpOnly : true
    }
}


//session middleware 
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req ,res,next)=> {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//router paths for listings & reviews
app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/users" , userRouter);
app.use("/wishlists/users" , wishListRouter);

//reserve route 
app.post("/reserve/:id" , isLoggedIn,(req ,res)=> {
    let { checkin , checkout} = req.body ; 
    let { id } = req.params ; 

    if( !checkin && !checkin) {
        req.flash("error" , "Please Enter Dates");
        return res.redirect(`/listings/${id}`);
    }

    let bookingID = "";
    while (bookingID.length < 10) {
        bookingID += Math.floor(Math.random() * 10).toString();
    }

    // Simulate processing delay
    setTimeout(() => {
        req.flash("success", `Your booking ID is ${bookingID}. Reservation from ${checkin} to ${checkout} is initiated.`);
        res.redirect(`/listings/${id}`);
    }, 2000);
});

app.all("*" ,(req,res,next)=> {
    next(new ExpressError(404 , "Page Not Found"));
});

//error handling middleware 
app.use((err,req,res,next)=> {
    let { status=500,message="Some Error Occured"} = err ;
    res.status(status).render("error.ejs" , {message});
    // res.status(status).send(message);
});


app.listen(port , ()=> {
    console.log(`port is listening on port ${port}`);
});
