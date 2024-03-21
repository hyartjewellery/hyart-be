const router = require('express').Router(); 
const checkPermission = require('../middleware/aclPermission');
const protect = require('../middleware/auth');
const userController = require('../controllers/user');
const paymentController = require('../controllers/payment');

router.post('/all-category',protect.protect, checkPermission(["user"]), userController.getAllCategory);
router.post('/product',protect.protect, checkPermission(["user"]), userController.getProductByID);
router.post('/all-products',protect.protect, checkPermission(["user"]), userController.getAllProducts);
router.post('/add-to-wishlist',protect.protect, checkPermission(["user"]), userController.addToWishlist);
router.post('/remove-from-wishlist',protect.protect, checkPermission(["user"]), userController.removeFromWishList);
router.post('/get-wishlist',protect.protect, checkPermission(["user"]), userController.getWishList);
router.post('/place-order', protect.protect, checkPermission(["user"]), userController.placeOrder ,paymentController.paymentVerification); 

module.exports = router;