const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Query = require('../models/Query');
const userConfirmationTemplate = require('../utils/template/userConfirmation');
const contactUsTemplate = require('../utils/template/contactUs');
const mailSender = require('../utils/mailSender');
const { error, success } = require('../utils/responseWrapper');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});


const placeOrder = async (req, res) => {
    
    try {

        const { products } = req.body;
        const user_id = req.user._id;
        const user = await User.findById(user_id);
       
        if (!user) {
            return res.send(error(404, 'User not found'));
        }

        let totalAmount = 0;

        for (const { product_id, quantity } of products) {
            const product = await Product.findById(product_id);
      
            if (!product) {
                return res.send(error(404, 'Product not found'));
            }

            if (product.quantity < quantity) {
                return res.send(error(404, 'Quantity not available'));
            }

            totalAmount += product.price * quantity;
                  
        }

        const order = {
            user_id: user_id,
            totalAmount: totalAmount,
            status: 'pending',
            products: products.map(({ product_id, quantity }) => ({ product_id, quantity })),
        };
     
        const createdOrder = await Order.create(order);

        for (const { product_id, quantity } of products) {
            await Product.findByIdAndUpdate(product_id, { $inc: { quantity: -quantity } });
        }
      
        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100, 
            currency: 'INR',
            receipt: createdOrder._id.toString(), 
            payment_capture: 1
        });


        await Payment.create({
            order_id: createdOrder._id,
            amount: totalAmount,
            status: 'pending', 
            paymentMethod: 'razorpay', 
        });

        return res.send(success(200,razorpayOrder));

    } catch (err) {

        return res.send(error(404, err.message));
        
    }
};


const addToWishlist = async (req, res, next) => {

    try {

        const { product_id } = req.body;
        const user_id = req.user._id;

        const user = await User.findById(user_id);

        if (!user) {
           return res.send(error(404, 'User not found'));
        }

        if (user.wishList.includes(product_id)) {
            return res.send(error(404, 'Product already in wishlist'));
        }

        await User.findByIdAndUpdate(user_id, { $push: { wishList: product_id } });

        return res.send(success(200,'Product added to wishlist'));

    } catch (err) {
        return res.send(error(404, err.message));
    }
}

const getWishList = async (req, res, next) => {

    try {

        const user_id = req.user._id;

        const data = await User.findById(user_id).populate('wishList');

        if (!data) {
            return res.send(error(404, 'User not found'));
        }

        return res.send(success(200,data.wishList));

    } catch (err) {
        return res.send(error(404, err.message));
    }
}

const removeFromWishList = async (req, res, next) => {

    try {

        const { product_id } = req.body;
        const user_id = req.user._id;

        const user = await User.findById(user_id);

        if (!user) {
            return res.send(error(404, 'User not found'));
        }

        if (!user.wishList.includes(product_id)) {
            return res.send(error(404, 'Product not in wishlist'));
        }

        await User.findByIdAndUpdate(user_id, { $pull: { wishList: product_id } });

        return res.send(success(200,'Product removed from wishlist'));

    } catch (err) {
        return res.send(error(404, err.message));
    }
}

const contactUs = async (req, res, next) => {
    try {
        const { email, subject, message } = req.body;
        const admin = process.env.MAIL_USERNAME;

        if (!email || !subject || !message) {
            return res.send(error(404, 'All fields are required'));
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.send(error(404, 'Invalid email'));

        }


        const user_id = req.user._id;
        const user = await User.findById(user_id);
        const user_name = user.name;

        if (!user) {
            return res.send(error(404, 'User not found'));
        }

        if(email != user.email) {
            return res.send(error(404, 'Email does not match with the logged in user'));
        }
        const name = req.user.name; 
        const userConfirmationBody = userConfirmationTemplate(name);
        await mailSender(email, 'Contact Form Submission Confirmation', userConfirmationBody);
        await mailSender(admin,'User Query', contactUsTemplate(email, user_name, subject, message));;

        const query = {
            name: user_name,
            email: email,
            subject: subject,
            message: message
        };

        await Query.create(query);

        return res.send(success(200,'Query submitted successfully'));
    } catch (err) {
        return res.send(error(404, err.message));
    }
};




module.exports = {
    addToWishlist,
    getWishList,
    removeFromWishList,
    placeOrder,
    contactUs
}