const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js")
const { log } = require("console");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema,reviewSchema } = require("./schema.js");
const Reviews = require("./models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}
// views setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req, res) => {
  res.send("this is working");
});
// midddleware for schema
const validateListing = (req, res, next)=>{
  let{error} =listingSchema.validate(req.body);
  if(error){
    let errMSg = error.details.map((el) =>el.message).join(",");
    throw new ExpressError(400 ,errMSg );
  }else{
    next();
  }
};
// middleware of serverside for review
const validateReviews = (req, res, next)=>{
  let{error} =reviewSchema.validate(req.body);
  if(error){
    let errMSg = error.details.map((el) =>el.message).join(",");
    throw new ExpressError(400 ,errMSg );
  }else{
    next();
  }
};

//  index route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
}));

//   new route
app.get("/listings/new", wrapAsync(async (req, res) => {
  await res.render("./listings/new.ejs");
}));

//show route
app.get("/listings/:id",  wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate('review');
  res.render("./listings/show.ejs", { listing });
}));

// create route
app.post("/listings", validateListing,wrapAsync(async (req, res, next) => {
  let {title, description, image, price, country, location} = req.body.listing;
  const newListing = new Listing({
      title:title,
      description:description,
      location:location,
      country:country,
      price:price,
  });
  newListing.image.url = image;
  await newListing.save();
  console.log(newListing);
  res.redirect("/listings");
})
);
 

// edit route

app.get("/listings/:id/edit",  wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res, next) => {
  if(!req.body.listing){
    throw new ExpressError(400,"send a valid data");
  }
  let {id} = req.params;
  let {title, image, description, location, country, price}  = req.body.listing;
  
  let newL = await Listing.findByIdAndUpdate(id, {
      title:title,
      description:description,
      location:location,
      country:country,
      price:price,
      'image.url' :image
  }, {new:true});
  console.log(newL);
  res.redirect(`/listings/${id}`);
  }));

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

// review route
app.post("/listings/:id/reviews",validateReviews, wrapAsync(async(req,res)=>{
 let listing = await Listing.findById(req.params.id);
 let newReview = new Reviews (req.body.review);
 listing.review.push(newReview);
 await newReview.save();
 await listing.save();
 
 res.redirect(`/listings/${listing._id}`);
})); 

// delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
  let{id , reviewId}= req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}})
  await Reviews.findByIdAndDelete(reviewId)
  res.redirect(`/listings/${id}`)

}))


app.all("*" , (req, res, next)=>{
  next(new ExpressError(404,"page not found"));
});


// middleware (handling the async errors)
app.use((err,req,res,next)=>{
  let{statusCode =500,message="something went wrong"}= err;
   res.status(statusCode).render("error.ejs",{message});
})

app.listen("8080", (req, res) => {
  console.log("app is listening");
});
