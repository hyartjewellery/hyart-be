const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

const getAllCategory = async (req, res, next) => {

    try {

        const category = await Category.find();
        res.json({
            success: true,
            data: category
        })

    } catch (err) {

        res.json({
            success: false,
            message: err.message
        })
    }

}

const getProductByID = async (req, res, next) => {

    const { product_id } = req.body;
    await Product.findById(product_id)
        .then(product => {
            res.json({
                success: true,
                data: product
            })
        })
        .catch(err => {
            res.json({
                success: false,
                message: err.message
            })
        })

}

const getAllProducts = async (req, res, next) => {
    try {
        const { category_id, filter } = req.body;
        let sortCriteria = {};
        let products;


        let query = { category_id: category_id };

        if (!filter) {
            products = await Product.find(query);
            return res.json({
                success: true,
                data: products
            });
        }


        filter.forEach((item) => {
            let field = item.field;
            let sortBy = item.sortBy;


            if (sortBy === "asc") {
                sortCriteria[field] = 1;
            } else if (sortBy === "desc") {
                sortCriteria[field] = -1;
            }
        });


        products = await Product.find(query).sort(sortCriteria);

        res.json({
            success: true,
            data: products
        });
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};


const placeOrder = async (req, res, next) => {
    try {
        const { products } = req.body;

        const user_id = req.user._id;

        const user = await User.findById(user_id);
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }


        let totalAmount = 0;

        for (const { product_id, quantity } of products) {
            const product = await Product.findById(product_id);
            console.log("PROD",product);
            if (!product) {
                return res.json({
                    success: false,
                    message: 'Product not found'
                });
            }

            if (product.quantity < quantity) {
                return res.json({
                    success: false,
                    message: `Product '${product.name}' is out of stock`
                });
            }

            console.log("CROSS 2");
            totalAmount += product.price * quantity;
            console.log(totalAmount);
        }

        const order = {
            user_id: user_id,
            totalAmount: totalAmount,
            status: 'pending',
            products: products.map(({ product_id, quantity }) => ({ product_id, quantity })),
        };

      
        const createdOrder = await Order.create(order);

      
        // Decrease product quantities in the database
        for (const { product_id, quantity } of products) {
            await Product.findByIdAndUpdate(product_id, { $inc: { quantity: -quantity } });
        }
      

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100, // Razorpay accepts amount in paise
            currency: 'INR',
            receipt: createdOrder._id.toString(), // Receipt ID, can be order ID from your database
            payment_capture: 1 // Auto capture payment
        });

        // Store payment details in your database
        await Payment.create({
            order_id: createdOrder._id,
            amount: totalAmount,
            status: 'pending', // Payment status initially pending until success
            paymentMethod: 'razorpay', // Assuming payment method is Razorpay
        });

        res.json({
            success: true,
            message: 'Order placed successfully',
            razorpayOrder: razorpayOrder // Return Razorpay order details to the client
        });
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};


const addToWishlist = async (req, res, next) => {

    try {

        const { product_id } = req.body;
        const user_id = req.user._id;

        const user = await User.findById(user_id);

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            })
        }

        if (user.wishList.includes(product_id)) {
            return res.json({
                success: false,
                message: 'Product already in wishlist'
            })
        }

        await User.findByIdAndUpdate(user_id, { $push: { wishList: product_id } });

        res.json({
            success: true,
            message: 'Product added to wishlist'
        })

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}

const getWishList = async (req, res, next) => {

    try {

        const user_id = req.user._id;

        const data = await User.findById(user_id).populate('wishList');

        res.json({
            success: true,
            data: data.wishList
        })

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}

const removeFromWishList = async (req, res, next) => {

    try {

        const { product_id } = req.body;
        const user_id = req.user._id;

        const user = await User.findById(user_id);

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            })
        }

        if (!user.wishList.includes(product_id)) {
            return res.json({
                success: false,
                message: 'Product not in wishlist'
            })
        }

        await User.findByIdAndUpdate(user_id, { $pull: { wishList: product_id } });

        res.json({
            success: true,
            message: 'Product removed from wishlist'
        })

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}


module.exports = {
    getAllCategory,
    getProductByID,
    getAllProducts,
    addToWishlist,
    getWishList,
    removeFromWishList,
    placeOrder
}