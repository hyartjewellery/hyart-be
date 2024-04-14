const User = require('../models/User');
const { error, success } = require('../utils/responseWrapper');

const checkPermission = (requiredRole) => {

    return async function (req, res, next) {

        const id = req.user.id;
        const user = await User.findById(id);
        const userRole = user.role;

        if (requiredRole.includes(userRole)) {
            next();
        } else {
           
           return res.send(error(403, "You are unauthorized to perform this action"));
            // res.status(403).json({ error: "You are unauthorized to perform this action" });
        }
    };
};

module.exports = checkPermission;