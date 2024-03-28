const Payment = require('../models/Payment');
const crypto = require('crypto');
const { error } = require('../utils/responseWrapper');

const paymentVerification = async (req, res, next) => {

    const User = await User.findById(req.user._id);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        try {

            const payment = await Payment.findOneAndUpdate(
                { razorpay_order_id, razorpay_payment_id, amount, user_id },
                { $set: { status: 'successful' } },
                { new: true }
            );
            

            console.log(payment);

            if (!payment) {
              
                const sex = await Payment.create({
                    user_id: User._id,
                    order_id:razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    amount,
                    status: 'successful'
                });
                console.log(sex);
            }


            return res.redirect(`/payments/success`);
        } catch (err) {
            return res.send(error(500, err.message));
        }
    } else {
        return res.redirect(`/payments/fail`);
    }
};

module.exports = { paymentVerification };