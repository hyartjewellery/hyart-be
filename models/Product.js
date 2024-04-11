const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    publicId: String,
    url: String,
  },
  quantity: {
    type: Number,
    required: true
  },
  rating:{
    type: Number,
    default: 0
  },
  trending: {
    type: Boolean,
    default: false
  },
  archive: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
