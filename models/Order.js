const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
 products:[
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        required: true
      }
    }
 ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  couponApplied: {
    type: Boolean,
    default: false
},
couponCode: {
    type: String
},
couponDiscountAmount: {
    type: Number,
    default: 0
}
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
