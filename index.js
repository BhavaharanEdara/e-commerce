const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoute');
const categoryRouter = require('./routes/categoryRoute');
const brandRouter = require('./routes/brandRoute');
const dbConnect = require('./config/dbConnect');
const bodyParser = require('body-parser');
const notFound = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const productRouter = require("./routes/productRout")
const couponRouter = require("./routes/couponRout")
const colorRouter = require("./routes/colorRoute")
const cors = require("cors");
app.use(cors());
dbConnect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/category', categoryRouter);
app.use('/brand', brandRouter);
app.use('/color', colorRouter);
app.use('/coupon', couponRouter);


app.use('/', (req,res)=>{
    res.send("")
})
app.listen(PORT,()=>{
    console.log(`Server up at ${PORT}`);
});

app.use(notFound);