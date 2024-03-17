const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {

    if(!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
        return res.status(401).json({
            success: false,
            message: 'Authorization header is required'
        })
    }

    const accessToken = req.headers.authorization.split(" ")[1];

    try{
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        const user = await User.findById(decoded._id);
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        req.user = user;
        next();
    } catch(err){
        console.log(err);
        return res.status(401).json({
            success: false,
            message: 'Token verification failed',
            error: err.message
        })
    }
}