const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Query = require('../models/Query');
const Coupon = require('../models/Coupon');
const userConfirmationTemplate = require('../utils/template/userConfirmation');
const contactUsTemplate = require('../utils/template/contactUs');
const mailSender = require('../utils/mailSender');
const { error, success } = require('../utils/responseWrapper');
const orderConfirmationTemplate = require('../utils/template/orderConfirmation');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

const placeOrder = async (req, res) => {

    try {
        const { products, couponCode } = req.body;

        const user_id = req.user._id;
        const user = await User.findById(user_id);

        if (!user) {
            return res.send(error(404, 'User not found'));
        }

        if (!user.location.address && !user.location.city && !user.location.state && !user.location.pincode && !user.location.country) {
            return res.send(error(404, 'Please update your location before placing an order'));
        }

        let totalAmount = 0;

        for (const { product_id, quantity } of products) {
            const product = await Product.findById(product_id);

            if (!product) {
                return res.send(error(404, 'Product not found'));
            }

            if (product.archive) {
                res.send(error(404, 'Product is not available'));
            }

            if (product.quantity < quantity) {
                return res.send(error(404, 'Quantity not available'));
            }

            totalAmount += product.price * quantity;
        }



        let discountAmount = 0;
        let couponApplied = false;
        let couponDiscountAmount = 0;
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode });

            if (!coupon) {
                return res.send(error(404, 'Coupon not found'));
            }

            const currentDate = new Date();
            if (currentDate < coupon.validFrom || currentDate > coupon.validUntil) {
                return res.send(error(400, 'Coupon is not valid at this time'));
            }

            const userCouponUsage = coupon.userUsage.find(u => u.userId.toString() === user_id.toString());
            if (userCouponUsage && userCouponUsage.usedCount >= coupon.maxUses) {
                return res.send(error(400, 'You have reached the maximum usage limit for this coupon'));
            }

            if (coupon.discountType === 'percentage') {
                discountAmount = (totalAmount * coupon.discountAmount) / 100;
            }

            couponApplied = true;
            couponDiscountAmount = discountAmount;

            if (userCouponUsage) {
                userCouponUsage.usedCount++;
            } else {
                coupon.userUsage.push({ userId: user_id, usedCount: 1 });
            }

            await coupon.save();
        }

        const finalAmount = totalAmount - discountAmount;


        const order = {
            user_id: user_id,
            totalAmount: finalAmount,
            status: 'pending',
            products: products.map(({ product_id, quantity }) => ({ product_id, quantity })),
            couponApplied: couponApplied,
            couponDiscountAmount: couponDiscountAmount
        };

        const createdOrder = await Order.create(order);

        for (const { product_id, quantity } of products) {
            await Product.findByIdAndUpdate(product_id, { $inc: { quantity: -quantity } });
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: finalAmount * 100,
            currency: 'INR',
            receipt: createdOrder._id.toString(),
            payment_capture: 1
        });

        await Payment.create({
            order_id: createdOrder._id,
            amount: finalAmount,
            status: 'pending',
            paymentMethod: 'razorpay',
        });

        await mailSender(
            user.email,
            'Order Confirmed',
            orderConfirmationTemplate(
                user.name,
                createdOrder._id,
                new Date().toLocaleDateString(),
                finalAmount,
                user.location.address
            )
        );

        return res.send(success(200, razorpayOrder));

    } catch (err) {
        return res.send(error(500, err.message));
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

        return res.send(success(200, 'Product added to wishlist'));

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

        return res.send(success(200, data.wishList));

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

        return res.send(success(200, 'Product removed from wishlist'));

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

        if (email != user.email) {
            return res.send(error(404, 'Email does not match with the logged in user'));
        }
        const name = req.user.name;
        const userConfirmationBody = userConfirmationTemplate(name);
        await mailSender(email, 'Contact Form Submission Confirmation', userConfirmationBody);
        await mailSender(admin, 'User Query', contactUsTemplate(email, user_name, subject, message));;

        const query = {
            name: user_name,
            email: email,
            subject: subject,
            message: message
        };

        await Query.create(query);

        return res.send(success(200, 'Query submitted successfully'));
    } catch (err) {
        return res.send(error(404, err.message));
    }
};

const getOrderStatus = async (req, res) => {
    try {
        const { order_id } = req.body;

        const order = await Order.findById(order_id);

        if (!order) {
            return res.send(error(404, 'Order not found'));
        }

        return res.send(success(200, order));

    } catch (error) {
        return res.send(error(500, 'Internal server error'));
    }
}

const placeCODOrder = async (req, res) => {

    try {

        const { products, couponCode } = req.body;

        const user_id = req.user._id;
        const user = await User.findById(user_id);

        if (!user) {
            return res.send(error(404, 'User not found'));
        }

        if (!user.location.address && !user.location.city && !user.location.state && !user.location.pincode && !user.location.country) {
            return res.send(error(404, 'Please update your location before placing an order'));
        }

        let totalAmount = 0;

        for (const { product_id, quantity } of products) {

            const product = await Product.findById(product_id);

            if (!product) {
                return res.send(error(404, 'Product not found'));
            }

            if (product.archive) {
                return res.send(error(404, 'Product is not available'));
            }

            if (product.quantity < quantity) {
                return res.send(error(404, 'Quantity not available'));
            }

            totalAmount += product.price * quantity;
        }


        let discountAmount = 0;
        let couponApplied = false;
        let couponDiscountAmount = 0;
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode });

            if (!coupon) {
                return res.send(error(404, 'Coupon not found'));
            }

            const currentDate = new Date();
            if (currentDate < coupon.validFrom || currentDate > coupon.validUntil) {
                return res.send(error(400, 'Coupon is not valid at this time'));
            }

            const userCouponUsage = coupon.userUsage.find(u => u.userId.toString() === user_id.toString());
            if (userCouponUsage && userCouponUsage.usedCount >= userCouponUsage.usedCount) {
                return res.send(error(400, 'You have reached the maximum usage limit for this coupon'));
            }

            if (coupon.discountType === 'percentage') {
                discountAmount = (totalAmount * coupon.discountAmount) / 100;
            }

            couponApplied = true;
            couponDiscountAmount = discountAmount;

            if (userCouponUsage) {
                userCouponUsage.usedCount++;
            } else {
                coupon.userUsage.push({ userId: user_id, usedCount: 1 });
            }

            await coupon.save();
        }


        const finalAmount = totalAmount - discountAmount;


        const order = {
            user_id: user_id,
            totalAmount: finalAmount,
            status: 'confirmed',
            products: products.map(({ product_id, quantity }) => ({ product_id, quantity })),
            couponApplied: couponApplied,
            couponDiscountAmount: couponDiscountAmount
        };


        const createdOrder = await Order.create(order);

        for (const { product_id, quantity } of products) {
            await Product.findByIdAndUpdate(product_id, { $inc: { quantity: -quantity } });
        }

        await Payment.create({
            order_id: createdOrder._id,
            amount: finalAmount,
            status: 'pending',
            paymentMethod: 'cod',
        });

        await mailSender(
            user.email,
            'Order Confirmed',
            orderConfirmationTemplate(
                user.name,
                createdOrder._id,
                new Date().toLocaleDateString(),
                finalAmount,
                user.location.address
            )
        );


        return res.send(success(200, 'Order placed successfully'));

    } catch (err) {
        return res.send(error(500, 'Internal server error'));
    }
}

const getOrders = async (req, res) => {
    try {
        const user_id = req.user._id;

        const orders = await Order.find({ user_id: user_id }).populate({
            path: 'products.product_id',
            model: 'Product',
            select: 'name price image'
        })

        return res.send(success(200, orders));

    } catch (error) {
        return res.send(error(500, 'Internal server error'));
    }
}


module.exports = {
    addToWishlist,
    getWishList,
    removeFromWishList,
    placeOrder,
    getOrderStatus,
    contactUs,
    placeCODOrder,
    getOrders
}