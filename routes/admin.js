const router = require('express').Router(); 
const checkPermission = require('../middleware/aclPermission');
const adminController = require('../controllers/admin');
const protect = require('../middleware/auth');


router.post('/create-category',protect.protect, checkPermission(["admin"]), adminController.createCategory);
router.post('/create-product',protect.protect, checkPermission(["admin"]), adminController.createProduct);
router.post('/delete-product',protect.protect, checkPermission(["admin"]), adminController.deleteProduct);
router.post('/get-queries',protect.protect, checkPermission(["admin"]), adminController.getQueries);
router.post('/create-coupon',protect.protect, checkPermission(["admin"]), adminController.createCoupon);

module.exports = router;