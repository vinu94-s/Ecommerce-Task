const mongoose = require('mongoose');

const Productschema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:[true,'Product must have a name ']
    },
    
    image:[String],
    description:{
        type:String,
        required:[true,'Product should have a description ']
    },
    category:{

        type:String,
        required:[true,'Product should belong to a category']
    },
    subcategory:{
        type:String,
        required:[true,'Product should have a Subcategory']
    },
    price:{
        type:Number,
        required:[true,'Product should have a Price']
    },
    brand:{
        type:String,
        required:[true,'Product should belong to a brand']   
    },
    rating:{
        type:Number,
        default:4.5,
        set:val=>Math.round(val*10)/10
    },
    numReviews:{
        type:Number,
        default:0
    },
    countInStock:{
        type:Number,
        default:1
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    
});

Productschema.virtual('reviews',{
    ref:'Review',
    foreignField:'product',
    localField:'_id'
});




const Product = mongoose.model('Product',Productschema);





module.exports = Product;