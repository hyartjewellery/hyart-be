const Category = require('../models/Category');
const Product = require('../models/Product');
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

        let query = { category_id: category_id };

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
        // Fetch all products from the database
        const allProducts = await Product.find();

        // Fetch trending products (assuming you have logic for this)
        // const trendingProducts = await getTrendingProducts();

        // Map over allProducts to populate category names
        const productsWithCategoryNames = await Promise.all(allProducts.map(async (product) => {
            const category = await Category.findById(product.category_id);
            return {
                ...product._doc,
                category_name: category.name
            };
        }));

        // Respond with success and the products
        return res.send(success(200, { allProducts: productsWithCategoryNames }));
    } catch (err) {
        // Handle errors
        return res.send(error(500, err.message));
    }
};




// get All Products --> filter -> trending true (limit 8), mixed to show on home page




module.exports = {getAllCategory, getProductByID, getProductByCatID, getAllProducts};