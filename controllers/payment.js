const Payment = require('../models/Payment');
const crypto = require('crypto');
const { error, success } = require('../utils/responseWrapper');

const paymentVerification = async (req, res, next) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        
        try {
            const payment = await Payment.findOneAndUpdate(
                { razorpay_order_id, razorpay_payment_id },
                { $set: { status: 'successful' } },
                { new: true }
            );

            if (!payment) {
              
                await Payment.create({
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    status: 'successful'
                });
            }

    
            return res.redirect(`http://localhost:3000/payment-success?reference=${razorpay_payment_id}`);
        } catch (error) {
           
            return res.send(error(500, error.message));
        }
    } else {
        
     
        return res.send(error(500, 'Internal server error'));
    }
};

module.exports = {paymentVerification};
