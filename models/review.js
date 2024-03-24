const mongoose= require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema ({
    comment:{
        type:String
    },
    rating:{
        type:Number
    },
    createdAt:{
        type:Date,
        default: Date.now()
    }
});

// exporting and model 
module.exports= mongoose.model ("Reviews",reviewSchema);