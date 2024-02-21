//404 not found
const  notFound = (req,res, next)=>{
    const error = new Error(`Not found : ${req.originalUrl}`);
    req.status(404);
    next(error);
}

module.exports = notFound;