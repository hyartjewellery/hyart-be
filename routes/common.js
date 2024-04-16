const router = require('express').Router();
const commonController = require('../controllers/common');

router.post('/all-category', commonController.getAllCategory);
router.post('/product', commonController.getProductByID);
router.post('/products',  commonController.getProductByCatID);
router.post('/all-products', commonController.getAllProducts);
router.post('/list-coupons', commonController.listAllCoupons);

module.exports = router;