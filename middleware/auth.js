const User = require('../models/User')

const protect = async (req, res, next) => {
    try {
      
        const accessToken = req.cookies.accessToken;

        if (!accessToken ) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized - Token missing'
            });
        }
 
        const decodedAccessToken = jwt.verify(accessToken, process.env.SECRET_KEY);
        const userId = decodedAccessToken.id;
        const userProf = await User.findOne({ _id: userId });
        userProf.password = undefined;
        userProf.confirmPassword = undefined;
   

        if (!userProf) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized - User not found'
            });
        }
    
        
        req.user = userProf;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            // Handle token expiration
            res.clearCookie('accessToken');
            req.session.destroy();
            res.sendStatus(401);
        } else {
            console.error(err);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong !!'
            });
        }
    }
};

module.exports = {protect}
