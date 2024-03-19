const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

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
        let products ;

        
        let query = { category_id: category_id };

        if(!filter) {
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

const addToWishlist = async ( req, res, next) => {

    try{

        const {  product_id } = req.body;
        const user_id = req.user._id;

        const user = await User.findById(user_id);

        if(!user){
            return res.json({
                success: false,
                message: 'User not found'
            })
        }

        if(user.wishList.includes(product_id)){
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

    } catch(err){
        res.json({
            success: false,
            message: err.message
        })
    }
}

const getWishList = async (req, res, next) => {

    try{

        const user_id = req.user._id;

        const data = await User.findById(user_id).populate('wishList');

        res.json({
            success: true,
            data: data.wishList
        })

    }catch(err){
        res.json({
            success: false,
            message: err.message
        })
    }
}

const removeFromWishList = async (req, res, next) => {

    try{

        const { product_id } = req.body;
        const user_id = req.user._id;

        const user = await User.findById(user_id);

        if(!user){
            return res.json({
                success: false,
                message: 'User not found'
            })
        }

        if(!user.wishList.includes(product_id)){
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

    }catch (err){
        res.json({
            success: false,
            message: err.message
        })
    }
}


module.exports ={
    getAllCategory,
    getProductByID,
    getAllProducts,
    addToWishlist,
    getWishList,
    removeFromWishList
}