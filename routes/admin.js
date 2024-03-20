const router = require('express').Router(); 
const checkPermission = require('../middleware/aclPermission');
const adminController = require('../controllers/admin');
const protect = require('../middleware/auth');
// const storage = require('../middleware/upload');
// const multer = require('multer');



// const upload = multer({storage: storage})

router.post('/create-category',protect.protect, checkPermission(["admin"]), adminController.createCategory);
router.post('/create-product',protect.protect, checkPermission(["admin"]), adminController.createProduct);
router.post('/delete-product',protect.protect, checkPermission(["admin"]), adminController.deleteProduct);

module.exports = router;