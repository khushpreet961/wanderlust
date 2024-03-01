const express= require("express");
const app = express();
const mongoose= require("mongoose");
const Listing = require("./model/listing.js");
const path = require("path");
const methodOverride = require("method-override");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
 
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect( MONGO_URL);
}

app.set("views",path.join(__dirname,"viewa"));
app.use(methodOverride("_method"));

app.get("/",async(req,res)=>{
    res.send("this is working");
});

// app.get("/test/listing", async(req,res)=>{
// let sampleListing = await new Listing({
//     Title: "THE GRAND VILAA",
//     description:"In the villa you get every facilities, in this there is swimming pool, cenima hall, gym and many more stuff",
//     price:"10000000",
//     location:"ALWAR(RAJASTHAN)",
//     country: "India"
// })
// sampleListing.save();
// console.log(sampleListing);
// res.send("the data is saved in database successfully");
// });

app.listen("8080",(req,res)=>{
    console.log("the port is listening ");
});