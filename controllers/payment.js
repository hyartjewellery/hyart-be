const Payment = require('../models/Payment');
const crypto = require('crypto');
const { error, success } = require('../utils/responseWrapper');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

const paymentVerification = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { orderCreationId, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, receipt, paymentMethod, products  } = req.body;
        const body = orderCreationId + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).send(error(400, 'Transaction is not legit'));
        }

        let payment = await Payment.findOneAndUpdate(
            { razorpay_order_id, razorpay_payment_id, amount, user_id: user._id },
            { $set: { status: 'successful' } },
            { new: true }
        );

        if (!payment) {
            const new_payment = await Payment.create({
                user_id: user._id,
                order_id: receipt,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                paymentMethod,
                amount,
                status: 'successful'
            });

            payment = new_payment;
        }

        const order = await Order.findOneAndUpdate(
            { _id: receipt },
            { $set: { status: 'confirmed', paymentMethod: "Online" } },
            { new: true }
        );

        for (const { product_id, quantity } of products) {

            const product = await Product.findById(product_id);

            if (!product) {
                return res.status(404).send(error(404, 'Product not found'));
            }

            product.quantity -= quantity;

            await product.save();
        }

        if (!user.orders) {
            user.orders = [];
        }


        user.orders.push(order._id);

        await user.save();


        return res.status(200).send(success(200, 'Payment successful', { payment, order }));
    } catch (err) {
        return res.status(500).send(error(500, err.message));
    }
};

module.exports = { paymentVerification };