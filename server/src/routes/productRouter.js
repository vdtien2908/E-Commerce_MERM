const router = require('express').Router();

const ProductController = require('../http/controllers/ProductController');
const {
    isAdmin,
    verifyAccessToken,
} = require('../http/middlewares/verifyToken');

router.post('/', [verifyAccessToken, isAdmin], ProductController.createProduct);
router.get('/', ProductController.getProducts);
router.put(
    '/:pid',
    [verifyAccessToken, isAdmin],
    ProductController.updateProduct
);
router.delete(
    '/:pid',
    [verifyAccessToken, isAdmin],
    ProductController.deleteProduct
);
router.get('/:pid', ProductController.getProduct);

module.exports = router;
