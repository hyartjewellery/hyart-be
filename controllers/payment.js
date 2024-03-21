const Payment = require('../models/Payment');
const crypto = require('crypto');

const paymentVerification = async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Payment is successful, update the payment status in the database
        try {
            const payment = await Payment.findOneAndUpdate(
                { razorpay_order_id, razorpay_payment_id },
                { $set: { status: 'successful' } },
                { new: true }
            );

            if (!payment) {
                // If payment record not found, create a new payment document
                await Payment.create({
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    status: 'successful'
                });
            }

            // Redirect to payment success page
            return res.redirect(`http://localhost:3000/payment-success?reference=${razorpay_payment_id}`);
        } catch (error) {
            // Handle database error
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        // Payment failed due to invalid signature
        res.json({ success: false, message: 'Payment failed' });
    }
};

module.exports = {paymentVerification};
