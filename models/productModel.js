const mongoose = require('mongoose'); // Erase if already required
//const User = require("./userModel");
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type :String,
        required : false,
        uniuqe : true,
        lowercase : true
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
    },
    brand :{
        type: String,
        required:false,
    },
    sold:{
        type:Number,
        default : 0
    },
    quantity:{
        type : Number,
    },
    images:{
        type: Array,
    },
    colour:{
        type:Array,
    },
    ratings:[{
        star: Number,
        postedby:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
        comment : String,
        postedOn : Date,
        firstname:String,
        lastname:String,
    }],
    totalRating:{
        type : Number,
        default : 0
    }
    },    
    {
        timestamps:true
    }
);

//Export the model
module.exports = mongoose.model('Product', productSchema);