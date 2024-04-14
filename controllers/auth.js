const User = require('../models/User');
const OTP = require('../models/Otp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error, success } = require('../utils/responseWrapper');
const otpGenerator = require('otp-generator');
const mailSender = require('../utils/mailSender');
const passwordUpdated = require('../utils/template/passwordUpdate');
const welcomeEmail = require('../utils/template/welcome');
const crypto = require('crypto');

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.send(error(400, 'Email is required'));
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.send(error(409, 'User is already registered'));
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });
        
        const result = await OTP.findOne({ otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false
            });
           
        }

        const newOtp = new OTP({
            email,
            otp
        });

        await newOtp.save();

        return res.send(success(200, 'OTP sent successfully'));

    } catch (err) {
   
        return res.send(error(500, err.message));
    }
}

const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, otp, phoneNumber, role } = req.body;
        

        if (!name || !email || !password || !confirmPassword || !phoneNumber || !otp) {
            return res.send(error(400, 'All fields are required'));
        }

   

        if (password !== confirmPassword) {
            return res.send(error(400, 'Passwords do not match'));
        }

    

        const oldUser = await User.findOne({ email });


        if (oldUser) {
            return res.send(error(409, 'User is already registered'));
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }


        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ message: 'Invalid phone number' });
        }

        const response = await OTP.findOne({ email }).sort({ createdAt: -1 });
     
        if (!response) {
            return res.send(error(404, 'OTP not found'));
        }
       

        if (response.otp !== otp) {
            return res.send(error(403, 'Invalid OTP'));
        }

   

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);


        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            confirmPassword: hashedConfirmPassword,
            phoneNumber,
            role
        })

     

        await mailSender(user.email, 'Welcome to our platform', welcomeEmail(user.name));

        

        user.password = undefined;
        user.confirmPassword = undefined;
        return res.send(success(201, user));

    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send(error(400, 'All fields are required'));
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.send(error(404, 'User not found'));
        }

        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            return res.send(error(403, 'Invalid credentials'));
        }

        const accessToken = generateAccessToken({ _id: user._id })
        const refreshToken = generateRefreshToken({ _id: user._id })

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })

        return res.send(success(200, {accessToken}))

    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const refreshAccessToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.jwt) {
        return res.send(error(401, 'Refresh token in cookie is required'));
    }

    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
        const _id = decoded._id;
        const accessToken = generateAccessToken({ _id });
        return res.send(success(201, { accessToken }));
    } catch (e) {
        console.log(e);
        return res.send(error(401, 'Invalid refresh token'));
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        });
        //refresh token deleted and access token should be deleted by frontend
        return res.send(success(200, 'user logged out'));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const generateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '1d' });
        return token;
    } catch (e) {
        console.log(e);
    }
}

const generateRefreshToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: '1y' });
        return token;
    } catch (e) {
        console.log(e);
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all the required fields'
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const token = crypto.randomBytes(20).toString('hex');

        const updatedDetails = await User.findOneAndUpdate(
            { email },
            { resetPasswordToken: token, resetPasswordExpire: Date.now() + 3600000 },
            { new: true }
        );

        const url = `http://localhost:3000/update-password/${token}`;
        const message = `Click on the link below to reset your password:\n\n${url}`;

        await mailSender(
            user.email,
            'Reset Password',
            message
        );

        res.send(success(200, 'Email sent successfully'));

    } catch (err) {
        console.log(err);
        return res.send(error(500, err.message));
    }
}

const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, resetPasswordToken } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all the required fields'
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords and confirm passwords do not match'
            })
        }

        const user = await User.findOne({ resetPasswordToken });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Invalid token'
            })
        }

        if (Date.now() > user.resetPasswordExpire) {
            return res.status(400).json({
                success: false,
                message: 'Token expired, Please regenerate token'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            { resetPasswordToken },
            { password: hashedPassword, resetPasswordToken: null, resetPasswordExpire: null },
            { new: true }
        );

        const emailResponse = await mailSender(
            user.email,
            'Password updated successfully',
            passwordUpdated(user.email, `${user.firstName} ${user.lastName}`)
        );

        res.send(success(200, 'Password updated successfully'));

    } catch (err) {
        console.log(err);
        return res.send(error(500, err.message));
    }
}

const updatePassword = async (req, res) => {
    try {
        const userDetails = await User.findById(req.user._id);
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const matched = await bcrypt.compare(oldPassword, userDetails.password);

        if (!matched) {
            return res.status(401).json({
                success: false,
                message: "The password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(
            req.user._id,
            { password: hashedPassword },
            { new: true });

        await mailSender(
            userDetails.email,
            "Password updated successfully",
            passwordUpdated(userDetails.email, `${userDetails.firstName} ${userDetails.lastName}`)
        )

        res.send(success(200, 'Password updated successfully'));

    } catch (err) {
        console.log(err);
        res.send(error(500, err.message));
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        user.password = undefined;
        user.confirmPassword = undefined;

        res.send(success(200, user));

    } catch (err) {
        console.log(err);
        res.send(error(500, err.message));
    }
}

const updateProfile = async (req, res) => {   
    try {

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.send(error(404, 'User not found'));
        }

        let updateFields = {};

        if (req.body.image) {
            const cloudImg = await cloudinary.uploader.upload(req.body.image, { folder: 'postImg' });
            updateFields.userAvatar = {
                publicId: cloudImg.public_id,
                url: cloudImg.url
            };
        }
  
        if (req.body.location) {


            const { city, state, pincode, address, country } = req.body.location;

         
            if (!city || !state || !pincode || !address || !country) {
                return res.send(error(400, 'All fields in the location object are required'));
            }

            updateFields.location = {
                city: city,
                state: state,
                pincode: pincode,
                address: address,
                country: country
            };
        }
     
        const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, { new: true });

        await user.save();

        updatedUser.password = undefined;
        updatedUser.confirmPassword = undefined;

        res.send(success(200, updatedUser));
    } catch (err) {
        console.log(err);
        res.send(error(500, err.message));
    }
}

module.exports = {
    sendOtp,
    register,
    login,
    getProfile,
    forgotPassword,
    resetPassword,
    updatePassword,
    refreshAccessToken,
    updateProfile,
    logout
};