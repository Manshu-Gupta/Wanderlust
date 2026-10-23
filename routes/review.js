const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/reviews.js"); 
const ExpressError = require("../utils/ExpressErr");

const Listing = require("../models/listing");
const { listingSchema } = require("../schema");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

//REVIEW ROUTE
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));
//delete review route  


router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;