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

        return res.send(success(200,products));
    } catch (err) {
        return res.send(error(404, err.message));
    }
};

const getAllProducts = async (req, res, next) => {
    try {
        const categories = await Category.find().populate('products');
        if (!categories) {
            return res.send(error(404, 'Categories not found'));
        }

       
        let allProducts = [];
        categories.forEach(category => {
            allProducts = allProducts.concat(category.products);
        });

       
        const standaloneProducts = await Product.find();

        
        allProducts = allProducts.concat(standaloneProducts);

        return res.send(success(200, allProducts));

    } catch (err) {
        return res.send(error(404, err.message));
    }
};

module.exports = {getAllCategory, getProductByID, getProductByCatID, getAllProducts};