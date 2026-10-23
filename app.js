const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();
const express= require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressErr");
const { listingSchema } = require("./schema");
//const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

const dbUrl=process.env.ATLASDB_URL;

const Review = require("./models/reviews.js"); 
const { reviewSchema } = require("./schema");
const session = require("express-session");
const MongoStore=require("connect-mongo").default;
const listings=require("./routes/listing.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
async function main(){
    await mongoose.connect(dbUrl);
}

main() 
   .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {

     console.error("Error connecting to MongoDB:", err);
    });

// app.get("/", (req, res) => {
//     res.send("Hello World");
// });

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600
});
store.on("error",()=>{
    console.log("Error in mongo session",err);
});
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.set("view engine" , "ejs");
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("views", path.join(__dirname, "views"));
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});



app.use("/listings", listings);
app.use("/listings/:id/reviews", require("./routes/review.js"));
app.use("/", userRouter);


app.all("/{*splat}", (req,res,next)=>{
    next(new ExpressError("Page Not Found", 404));
});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
});

// app.use((err, req, res, next) => {
//     if (res.headersSent) {
//         return next(err);
//     }

//     const { statusCode = 500, message = "Something went wrong" } = err;

//     res.status(statusCode).render("error.ejs", { message });
// });

// app.get("/testListings", async (req, res) => {
//     let sampleListing = new Listing({
//         title:"My new villa",
//         description:"This is a beautiful villa located in the heart of the city.",
//         price:1200,
//         location:"chandigarh",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("Sample listing created");
//     res.send("Sample listing created!");
// });

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});