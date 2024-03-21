const Category = require('../models/Category');
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const Query = require('../models/Query');
const Coupon = require('../models/Coupon');


const createCategory = async (req, res) => {

    try {

        const { name, description} = req.body;

        if( !name || !description ){
            return res.status(400).json({
                success: false,
                message: 'Please provide name and description'
            })
        }

        const category = await Category.create({
            name,
            description
        });

        res.status(201).json({
            success: true,
            data: category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const createProduct = async (req, res) => {
    try {
        const { category_id, name, description, price, image, quantity, trending } = req.body;

        if (!category_id || !name || !description || !price || !image || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Please provide category, name, description, price, image, and quantity'
            });
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

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {

    try {
        const { product_id } = req.body;
        const product = await Product.findByIdAndDelete(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

}

const getQueries = async (req, res) => {
    try {
        const queries = await Query.find();
        res.json({
            success: true,
            data: queries
        });
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }

}

const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountAmount, validFrom, validUntil, maxUses } = req.body;

        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ success: false, message: 'Coupon code already exists' });
        }

    
        const coupon = await Coupon.create({
            code,
            discountType,
            discountAmount,
            validFrom,
            validUntil,
            maxUses
        });

        res.status(201).json({ success: true, data: coupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


module.exports = {
    createCategory,
    createProduct,
    deleteProduct,
    getQueries,
    createCoupon
}
