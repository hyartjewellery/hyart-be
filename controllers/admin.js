const Category = require('../models/Category');
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const Query = require('../models/Query');
const Coupon = require('../models/Coupon');
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


module.exports = {
    createCategory,
    createProduct,
    deleteProduct,
    getQueries,
    createCoupon
}
