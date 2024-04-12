const Category = require('../models/Category');
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const Query = require('../models/Query');
const Coupon = require('../models/Coupon');
const Order = require('../models/Order');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { error, success } = require('../utils/responseWrapper');


const createCategory = async (req, res) => {

    try {

        const { name, description} = req.body;

        if( !name ){
           return res.send(error(400, 'Please provide name'))
        }

        const category = await Category.create({
            name,
            description
        });

        return res.send(success(201, category));
    } catch (error) {
       return res.send(error(500, error.message));
    }
}

const createProduct = async (req, res) => {
    try {
        const { category_id, name, description, price, image, quantity, trending } = req.body;

        if (!category_id || !name || !description || !price || !image || !quantity) {
           return res.send(error(400, 'Please provide all required fields'));
        }

        const cloudImg = await cloudinary.uploader.upload(image, { folder: 'postImg' });

        const product = await Product.create({
            category_id,
            name,
            description,
            price,
            image: {
                publicId: cloudImg.public_id,
                url: cloudImg.url
            },
            quantity,
            trending
        });

       
        await Category.findByIdAndUpdate(category_id, { $push: { products: product._id } });

        return res.send(success(201, product));
    } catch (error) {
        return res.send(error(500, error.message));
    }
};

const updateProduct = async(req, res) => {

    try{

        const { product_id, name, description, price, image, quantity, trending } = req.body;

        if(!product_id){
            return res.send(error(400, 'Please provide product id'));
        }

        const product = await Product.findById(product_id);
        if(!product){
            return res.send(error(404, 'Product not found'));
        }

        const previousPrice = product.price;

        if(name){
            product.name = name;
        }
        if(description){
            product.description = description;
        }
        if (price) {

            product.price = price;

            await Order.updateMany(
                { 'products.product_id': product_id },
                { $set: { 'products.$.priceAtPurchase': price } }
            );
        }
        if(image){
            const cloudImg = await cloudinary.uploader.upload(image, { folder: 'postImg' });
            product.image = {
                publicId: cloudImg.public_id,
                url: cloudImg.url
            }
        }
        if(quantity){
            product.quantity = quantity;
        }
        if(trending){
            product.trending = trending;
        }

        await product.save();

        return res.send(success(200, product));

    }catch(err){
        return res.send(error(500, 'Internal server error'));
    }
}

const deleteProduct = async (req, res) => {

    try {
        
        const { product_id } = req.body;
        const product = await Product.findByIdAndUpdate(product_id, { archive: true });
        if (!product) {
           return res.send(error(404, 'Product not found'));
        }
        return res.send(success(201, 'Product deleted successfully'));
    } catch (error) {
        return res.send(error(404, 'Product not found'));
    }

}

const getQueries = async (req, res) => {
    try {
        const queries = await Query.find();

        if(!queries){
            return res.send(error(404, 'No queries found'));
        }
        
        return res.send(success(200, queries));
    } catch (err) {
        return res.send(error(404, 'No queries found'));
    }

}

const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountAmount, validFrom, validUntil, maxUses } = req.body;

        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.send(error(400, 'Coupon already exists'));
        }

    
        const coupon = await Coupon.create({
            code,
            discountType,
            discountAmount,
            validFrom,
            validUntil,
            maxUses
        });

        return res.send(success(201, coupon));
    } catch (error) {
        console.error(error);
        return res.send(error(500, 'Internal server error'));
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { order_id, status } = req.body;

        const order = await Order.findByIdAndUpdate(order_id, { $set: { status } }, { new: true });

        if (!order) {
            return res.send(error(404, 'Order not found'));
        }

        return res.send(success(200, order));
    } catch (error) {
        return res.send(error(500, 'Internal server error'));
    }
};

const getOrderStatus = async (req, res) => {
    try {
        const { order_id } = req.body;

        const order = await Order.findById(order_id);

        if (!order) {
            return res.send(error(404, 'Order not found'));
        }

        return res.send(success(200, order));

    } catch (error) {
        return res.send(error(500, 'Internal server error'));
    }
}

const updateTrending = async (req, res) => {
    try {
        // Validate input
        const { product_id, status } = req.body;
        if (!product_id || typeof status !== 'boolean') {
            return res.status(400).send(error(400, 'Invalid input'));
        }

        // Find the product
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).send(error(404, 'Product not found'));
        }

        // Check if the product is already in the desired trending status
        if (product.trending === status) {
            const message = status ? 'Product is already trending' : 'Product is already not trending';
            return res.status(400).send(error(400, message));
        }

        // If trending is true and status is false, update trending to false
        if (product.trending && !status) {
            await Product.findByIdAndUpdate(product_id, { trending: status });
            return res.send(success(200, 'Product marked as not trending successfully', product));
        }

        // If trending is false and status is true, check the count of trending products
        if (!product.trending && status) {
            const trendingProductsCount = await Product.countDocuments({ trending: true });
            if (trendingProductsCount >= 8) {
                return res.status(400).send(error(400, 'Trending product limit reached'));
            }
        }

        // Update the trending status
        const updatedProduct = await Product.findByIdAndUpdate(product_id, { trending: status });
        return res.send(success(200, `Product marked as ${status ? 'trending' : 'not trending'} successfully`, updatedProduct));
    } catch (error) {
        console.error(error);
        return res.status(500).send(error(500, 'Internal server error'));
    }
};

const getTotalCount = async (req, res) => {

    try{
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments({ archive: false});
        const totalCategories = await Category.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'confirmed' });
        const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
        const completedOrders = await Order.countDocuments({ status: 'completed' });

        const ans = {
            totalUsers,
            totalOrders,
            totalProducts,
            totalCategories,
            pendingOrders,
            cancelledOrders,
            completedOrders
        }
     
        return res.send(success(200, ans));

    }catch (err){
        return res.send(error(500, 'Internal server error'));
    }
}

const getEarning = async (req, res) => {
    try {
     
        
        const { filter } = req.body;

       
        const today = new Date();
        let filterObject = {};

        if (filter === 'day') {
            filterObject = {
                createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()), $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) },
                status: 'successful'
            };
        } else if (filter === 'month') {
            filterObject = {
                createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1), $lt: new Date(today.getFullYear(), today.getMonth() + 1, 1) },
                status: 'successful'
            };
        } else if (filter === 'year') {
            filterObject = {
                createdAt: { $gte: new Date(today.getFullYear(), 0, 1), $lt: new Date(today.getFullYear() + 1, 0, 1) },
                status: 'successful'
            };
        } else if (filter === 'yesterday') {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            filterObject = {
                createdAt: { $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()), $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
                status: 'successful'
            };
        } else if (filter === 'lastmonth') {
            const lastMonth = new Date(today);
            lastMonth.setMonth(today.getMonth() - 1);
            filterObject = {
                createdAt: { $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1), $lt: new Date(today.getFullYear(), today.getMonth(), 1) },
                status: 'successful'
            };
        } else if (filter === 'lastyear') {
            const lastYear = new Date(today);
            lastYear.setFullYear(today.getFullYear() - 1);
            filterObject = {
                createdAt: { $gte: new Date(lastYear.getFullYear(), 0, 1), $lt: new Date(today.getFullYear(), 0, 1) },
                status: 'successful'
            };
        } else {
            return res.status(400).send('Invalid filter type');
        }

        // Aggregate the total earnings
        const result = await Payment.aggregate([
            { $match: filterObject },
            { $group: { _id: null, totalAmount: { $sum: { $divide: ['$amount', 100] } } } }
        ])

        // Extract total earnings from the result
        const totalEarnings = result.length > 0 ? result[0].totalAmount : 0;

        // Return total earnings as API response
        
        return res.send(success(200, { totalEarnings }));
    } catch (error) {
        console.error(error);
        return res.send(error(500, 'Internal server error'));
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { category_id } = req.body;

        const category = await Category.findById(category_id);
        if (!category) {
            return res.send(error(404, 'Category not found'));
        }

        if(category.products.length > 0){
         return res.send(error(400, 'Category has products, cannot delete'));   
        }

        await Category.findByIdAndDelete(category_id);
        return res.send(success(201, 'Category deleted successfully'));
    }
    catch (error) {
        return res.send(error(500, 'Internal Server Error'));
    }
}

const editCategory = async (req, res) => {
    try {
        const { category_id, name, description } = req.body;

        if(!category_id){
            return res.send(error(400, 'Please provide category id'));
        }

        const category = await Category.findById(category_id);

        if (!category) {
            return res.send(error(404, 'Category not found'));
        }

        if (name) {
            category.name = name;
        }
        if (description) {
            category.description = description;
        }

        category.save();

        return res.send(success(200, category));

    } catch (error) {
        return res.send(error(500, 'Internal server error'));
    }
};

const getUsers = async (req, res) => {
    try {

        const users = await User.find();

        if (!users) {
            return res.send(error(404, 'No users found'));
        }

        const newUser = users.filter(user => user.role !== 'admin');

        newUser.forEach(user => {
            user.password = undefined;
            user.confirmPassword = undefined;
        });

        return res.send(success(200, newUser));


    } catch (error) {

        return res.send(error(500, 'Internal server error'));
    }
}

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: 'confirmed' })
            .populate({
                path: 'user_id',
                model: 'User',
                select: '-password -confirmPassword' 
            })
            .populate({
                path: 'products.product_id',
                model: 'Product'
            });

        if (!orders) {
            return res.send(error(404, 'No orders found'));
        }

     
        const transformedOrders = orders.map(order => ({
            ...order.toObject(),
            products: order.products.map(product => ({
                ...product.toObject(),
                currentPrice: product.product_id.price,
            })),
        }));

        return res.send(success(200, transformedOrders));
    } catch (error) {
        return res.send(error(500, 'Internal server error'));
    }
}


const deliverCOD = async (req, res) => {
    try {

        const { order_id } = req.body;

        const order = await Order.findById(order_id);
      

        if (!order) {
            return res.send(error(404, 'Order not found'));
        }

        if (order.status !== 'confirmed') {
            return res.send(error(400, 'Order is not confirmed'));
        }

        const payment = await Payment.findOne({ order_id: order_id });
        if (!payment) {
            return res.send(error(404, 'Payment not found for this order'));
        }

        if (payment.paymentMethod !== 'cod') {

            return res.send(error(400, 'Payment method is not COD'));

        }

        order.status = 'delivered';
        payment.status = 'successful';
        
        await order.save();
        await payment.save();

        return res.send(success(200, {order, payment}));

    } catch (error) {

        return res.send(error(500, 'Internal server error'));
    }
}


module.exports = {
    createCategory,
    createProduct,
    deleteProduct,
    getQueries,
    createCoupon,
    updateOrderStatus,
    updateTrending,
    getOrderStatus,
    getTotalCount,
    getEarning,
    updateProduct,
    deleteCategory,
    editCategory,
    getUsers,
    getOrders,
    deliverCOD
}
