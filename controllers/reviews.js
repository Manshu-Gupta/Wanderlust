const Listing = require("../models/listing");
const Review = require("../models/reviews.js");

module.exports.createReview =async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author=req.user._id;
    await newReview.save();
    
    await listing.save();
    console.log("new review saved");
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${listing._id}`);  
};
module.exports.destroyReview =async(req,res)=>{
    let{id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
};