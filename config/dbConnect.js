const mongoose = require('mongoose');
const dbURL = process.env.MONGO_URL;
const dbConnect = ()=>{
    try{
        const connect = mongoose.connect(dbURL);
        console.log("connected sucessfully");
    }
    catch(error){
        console.log("error in db");
        throw new Error(error);
        
    }
}
module.exports = dbConnect;
