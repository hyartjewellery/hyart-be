const Payment = require('../models/Payment');
const crypto = require('crypto');
const { error } = require('../utils/responseWrapper');
const User = require('../models/User');
const Order = require('../models/Order');

const paymentVerification = async (req, res) => {
    try {
       

        const user = await User.findById(req.user._id);
        const { orderCreationId, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, receipt } = req.body;
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
                amount,
                status: 'successful'
            });

            payment = new_payment; // Assign new payment to the 'payment' variable
        }

        const order = await Order.findOneAndUpdate(
            { _id: receipt },
            { $set: { status: 'confirmed' } },
            { new: true }
        );

        return res.status(200).send(success(200, 'Payment successful', { payment, order }));
    } catch (error) {
        console.error("Error in payment verification:", error);
        return res.status(500).send(error(500, 'Internal Server Error'));
    }
};

module.exports = { paymentVerification };