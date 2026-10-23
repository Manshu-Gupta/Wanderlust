const express=require("express");
const router=express.Router();
const multer = require('multer');

const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const listingController=require("../controllers/listing.js")
const { listingSchema } = require("../schema");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router.route("/").get( wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;