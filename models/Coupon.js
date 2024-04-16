const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discountType: {
        type: String,
        enum: ['percentage'],
        required: true
    },
    discountAmount: {
        type: Number,
        required: true
    },
    validFrom: {
        type: Date,
        required: true
    },
    validUntil: {
        type: Date,
        required: true
    },
    maxUses: {
        type: Number,
        default: 1
    },
    userUsage: [{
      userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
      },
      usedCount: {
          type: Number,
          default: 0
      }
  }]
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
