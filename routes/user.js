const router = require('express').Router(); 
const checkPermission = require('../middleware/aclPermission');
const protect = require('../middleware/auth');
const userController = require('../controllers/user');

router.post('/all-category',protect.protect, checkPermission(["user"]), userController.getAllCategory);
router.post('/product',protect.protect, checkPermission(["user"]), userController.getProductByID);
router.post('/all-products',protect.protect, checkPermission(["user"]), userController.getAllProducts);

module.exports = router;