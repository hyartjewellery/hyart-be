const Category = require('../models/Category');
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

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
module.exports = {
    createCategory,
    createProduct
}
