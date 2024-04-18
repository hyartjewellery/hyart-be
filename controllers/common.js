const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { error, success } = require('../utils/responseWrapper');

const getAllCategory = async (req, res, next) => {

    try {

        const category = await Category.find();
        if(!category) return res.send(error(404, 'Not Found'));
        return res.send(success(200,category));

    } catch (err) {
        return res.send(error(404, err.message));
    }

}

const getProductByID = async (req, res, next) => {

    const { product_id } = req.body;
    await Product.findById(product_id)
        .then(product => {
            return res.send(success(200,product));
        })
        .catch(err => {
            return res.send(error(404, err.message));
        })

}

const getProductByCatID = async (req, res, next) => {
    try {
        const { category_id, filter } = req.body;
        let sortCriteria = {};
        let products;

        const category = Category.findById(category_id);
        if (!category) {
            return res.send(error(404, 'Category not found'));
        }

        let query = { category_id: category_id, archive: false};

        if (!filter) {
            products = await Product.find(query);
            return res.send(success(200,products));
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
        const result = {
            category,
            products
        };
       

        return res.send(success(200,{result}));
    } catch (err) {
        return res.send(error(404, err.message));
    }
};

const getAllProducts = async (req, res) => {
    try {

        const allProducts = await Product.find({ archive: false });
        let trendingProducts = [];

        if (req.body.trending) {
            trendingProducts = allProducts.filter(product => product.trending === true);
        }

        const productsWithCategoryNames = await Promise.all(allProducts.map(async (product) => {
            const category = await Category.findById(product.category_id);
            return {
                ...product._doc,
                category_name: category.name
            };
        }));

       
        shuffleArray(productsWithCategoryNames);
        shuffleArray(trendingProducts);

        return res.send(success(200, { allProducts: productsWithCategoryNames, trendingProducts: trendingProducts }));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const listAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        return res.send(success(200, coupons));
    } catch (err) {
        return res.send(error(404, err.message));
    }
};

const searchProductByName = async (req, res) => {

    const { query } = req.body;
    try {

        const products = await Product.find({ name: { $regex: query, $options: 'i' } , archive: false});
        return res.send(success(200, products));

    } catch (err) {
        return res.send(error(404, err.message));
    }

}


module.exports = {getAllCategory, getProductByID, getProductByCatID, getAllProducts, listAllCoupons, searchProductByName};