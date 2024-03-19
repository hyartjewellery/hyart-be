const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  confirmPassword: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  role:{
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  wishList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;
