const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  order_id: {
    type: String
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
    required: true,
    enum: ['razorpay', 'cod']
  },
  createdAt: {
    type: Date,
    default: Date.now
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