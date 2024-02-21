const jwt = require('jsonwebtoken');
const generateRefreshToken = (id)=>{
    return jwt.sign({id}, process.env.refresh_KEY, {expiresIn:"3d"});
}

module.exports = {generateRefreshToken};