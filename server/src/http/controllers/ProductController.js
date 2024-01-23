const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const Product = require('../../models/ProductModel');

class ProductController {
    // [POST] /api/products/
    createProduct = asyncHandler(async (req, res) => {
        if (Object.keys(req.body).length === 0) {
            throw new Error('Missing Inputs');
        }

        if (req.body && req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const newProduct = await Product.create(req.body);
        return res.status(200).json({
            success: newProduct ? true : false,
            createdProduct: newProduct
                ? newProduct
                : 'Can not create new product',
        });
    });

    // [GET] /api/products/:pid
    getProduct = asyncHandler(async (req, res) => {
        const { pid } = req.params;

        const product = await Product.findById(pid);

        return res.status(200).json({
            success: product ? true : false,
            product: product ? product : 'Can not get product',
        });
    });

    // [GET] /api/products/ !!!!!!!
    getProducts = asyncHandler(async (req, res) => {
        const products = await Product.find();

        return res.status(200).json({
            success: products ? true : false,
            products: products ? products : 'Can not get products',
        });
    });

    // [PUT] /api/products/:pid
    updateProduct = asyncHandler(async (req, res) => {
        const { pid } = req.params;
        if (req.body && req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
            new: true,
        });

        return res.status(200).json({
            success: updatedProduct ? true : false,
            updatedProduct: updatedProduct
                ? updatedProduct
                : 'Can not update product',
        });
    });

    // [DELETE] /api/product/:pid
    deleteProduct = asyncHandler(async (req, res) => {
        const { pid } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(pid);

        return res.status(200).json({
            success: deletedProduct ? true : false,
            deletedProduct: deletedProduct
                ? deletedProduct
                : 'Can not delete product',
        });
    });
}

module.exports = new ProductController();
