const Category = require('../models/Category');
const Product = require('../models/Product');

const getAllCategory = async (req ,res, next) => {

    try{

        const category = await Category.find();
        res.json({
            success: true,
            data: category
        })

    }catch (err){
    
        res.json({
            success: false,
            message: err.message
        })
     }

}

const getProductByID = async (req, res , next ) => {

    const {product_id} = req.body;
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

        
        let query = { category_id: category_id };

     
        filter.forEach((item) => {
            let field = item.field;
            let sortBy = item.sortBy;

        
            if (sortBy === "asc") {
                sortCriteria[field] = 1;
            } else if (sortBy === "desc") {
                sortCriteria[field] = -1;
            }
        });

        
        let products = await Product.find(query).sort(sortCriteria);

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




module.exports ={
    getAllCategory,
    getProductByID,
    getAllProducts
}