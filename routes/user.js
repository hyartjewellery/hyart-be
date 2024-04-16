const router = require('express').Router(); 
const checkPermission = require('../middleware/aclPermission');
const protect = require('../middleware/auth');
const userController = require('../controllers/user');
const paymentController = require('../controllers/payment');


router.post('/add-to-wishlist',protect.protect, checkPermission(["user"]), userController.addToWishlist);
router.post('/remove-from-wishlist',protect.protect, checkPermission(["user"]), userController.removeFromWishList);
router.post('/get-wishlist',protect.protect, checkPermission(["user"]), userController.getWishList);
router.post('/place-order', protect.protect, checkPermission(["user"]), userController.placeOrder); 
router.post('/paymentVerification',protect.protect, checkPermission(["user"]), paymentController.paymentVerification);
router.post('/contact-us',protect.protect, checkPermission(["user"]), userController.contactUs);
router.post('/get-order-status',protect.protect, checkPermission(["user"]), userController.getOrderStatus);
router.post('/place-cod-order',protect.protect, checkPermission(["user"]), userController.placeCODOrder);
router.post('/get-orders',protect.protect, checkPermission(["user"]), userController.getOrders);

module.exports = router;