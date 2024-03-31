const Category = require('../models/Category');
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const Query = require('../models/Query');
const Coupon = require('../models/Coupon');
const Order = require('../models/Order');
const { error, success } = require('../utils/responseWrapper');


const createCategory = async (req, res) => {

    try {

        const { name, description} = req.body;

        if( !name || !description ){
           return res.send(error(400, 'Please provide name and description'))
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

const deleteProduct = async (req, res) => {

    try {
        const { product_id } = req.body;
        const product = await Product.findByIdAndDelete(product_id);
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



const addToBanner = async (req, res) => {

    try{



    }catch (error){
        return res.send(error(500, 'Internal server error'));
    }
}


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





module.exports = {
    createCategory,
    createProduct,
    deleteProduct,
    getQueries,
    createCoupon,
    updateOrderStatus,
    updateTrending,
    getOrderStatus
}
