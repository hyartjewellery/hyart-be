const router = require('express').Router(); 
const checkPermission = require('../middleware/aclPermission');
const adminController = require('../controllers/admin');
const protect = require('../middleware/auth');


router.post('/create-category',protect.protect, checkPermission(["admin"]), adminController.createCategory);
router.post('/create-product',protect.protect, checkPermission(["admin"]), adminController.createProduct);
router.post('/delete-product',protect.protect, checkPermission(["admin"]), adminController.deleteProduct);
router.post('/get-queries',protect.protect, checkPermission(["admin"]), adminController.getQueries);
router.post('/create-coupon',protect.protect, checkPermission(["admin"]), adminController.createCoupon);
router.post('/update-order-status',protect.protect, checkPermission(["admin"]), adminController.updateOrderStatus);
router.post('/get-order-status',protect.protect, checkPermission(["admin"]), adminController.getOrderStatus);
router.post('/update-trending',protect.protect, checkPermission(["admin"]), adminController.updateTrending);
router.post('/get-count',protect.protect, checkPermission(["admin"]), adminController.getTotalCount);
router.post('/update-product',protect.protect, checkPermission(["admin"]), adminController.updateProduct);
router.post('/earning',protect.protect, checkPermission(["admin"]), adminController.getEarning);
router.post('/delete-category',protect.protect, checkPermission(["admin"]), adminController.deleteCategory);
router.post('/update-category',protect.protect, checkPermission(["admin"]), adminController.editCategory);
router.post('/get-users',protect.protect, checkPermission(["admin"]), adminController.getUsers);
router.post('/get-orders',protect.protect, checkPermission(["admin"]), adminController.getOrders);
router.post('/delivered-cod',protect.protect, checkPermission(["admin"]), adminController.deliverCOD);

module.exports = router;