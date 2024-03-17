const router = require('express').Router(); 
const checkPermission = require('../middleware/aclPermission');
const adminController = require('../controllers/admin');
const protect = require('../middleware/auth');


router.post('/create-category',protect.protect, checkPermission(["admin"]), adminController.createCategory);
router.post('/create-product',protect.protect, checkPermission(["admin"]), adminController.createProduct);

module.exports = router;