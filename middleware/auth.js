const jwt = require('jsonwebtoken');
const { error } = require('../utils/responseWrapper');
const User = require('../models/User');

exports.protect = async (req, res, next) => {

    if(!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
        return res.send(error(401, 'Authorization header is required'));
    }

    const accessToken = req.headers.authorization.split(" ")[1];

    try{
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        const user = await User.findById(decoded._id);
        if(!user){
            return res.send(error(404, 'User not found'));
        }
        req.user = user;
        next();
    } catch(err){
        console.log(err);
        return res.send(error(401, 'Invalid access key'));
    }
}