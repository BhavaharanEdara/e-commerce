const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    Products:[{
        Product:{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product"
        },
        count : Number,
        color : String,
    }],
    paymentIntent:{},
    orderStatus:{
        type:String,
        default : "Not Processed",
        enum : ["Not Processed","Processing","Processed","Dispatched", "Out for Delevery", "Delivered", "Canclled"]
    },
    orderBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref :"User"
    },
    address:String,
    phoneNumber:String

    },{
        timeStamps: true,
    }
);

//Export the model
module.exports = mongoose.model('Order', orderSchema);