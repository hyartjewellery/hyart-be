const Payment = require('../models/Payment');
const crypto = require('crypto');
const { error } = require('../utils/responseWrapper');
const User = require('../models/User');
const Order = require('../models/Order');

const paymentVerification = async (req, res) => {
    
    console.log("Motu patlo,", req.user._id);
    const user = await User.findById(req.user._id);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, receipt } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        try {

            const payment = await Payment.findOneAndUpdate(
                { razorpay_order_id, razorpay_payment_id, amount, user_id: user._id},
                { $set: { status: 'successful' } },
                { new: true }
            );
            
            console.log(payment);

            if (!payment) {
              
                await Payment.create({
                    user_id: user._id,
                    order_id: receipt,
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    amount,
                    status: 'successful'
                });
                
            }

            const order = await Order.findOneAndUpdate(
                {   order_id },// TODO 
                { $set: { status: 'confirmed' } },
                { new: true }
            );

            console.log("Updated order", order);


            return res.redirect(`http://localhost:3000/payments/success`);
        } catch (err) {
            return res.send(error(500, err.message));
        }
    } else {
        return res.redirect(`http://localhost:3000/payments/failed`);
    }
};

module.exports = { paymentVerification };