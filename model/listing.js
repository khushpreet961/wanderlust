const mongoose= require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String, 
        required : true  
    },
    description:{
        type:String
    },
    image:{
        type:String,
        default:"https://www.istockphoto.com/photo/a-large-gray-craftsman-new-construction-house-with-a-landscaped-yard-and-leading-gm1448386210-485915364?utm_campaign=category_photos_bottom&utm_content=https%3A%2F%2Funsplash.com%2Fimages&utm_medium=affiliate&utm_source=unsplash&utm_term=images%3A%3A%3A",
        Set:(v)=> v==="" ? "https://www.istockphoto.com/photo/a-large-gray-craftsman-new-construction-house-with-a-landscaped-yard-and-leading-gm1448386210-485915364?utm_campaign=category_photos_bottom&utm_content=https%3A%2F%2Funsplash.com%2Fimages&utm_medium=affiliate&utm_source=unsplash&utm_term=images%3A%3A%3A" : v
       
    
    },
    price:{
        type:Number,
        
    },
    location:{
        type:String,
        
    },
    country:{
        type:String,
        
    },
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports= Listing;