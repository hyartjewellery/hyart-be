const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  razorpay_order_id:{
    type:String,
  },
  razorpay_payment_id:{
    type:String,
  },
  razorpay_signature:{
    type:String,
  }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;