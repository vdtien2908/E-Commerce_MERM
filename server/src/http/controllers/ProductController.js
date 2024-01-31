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

    // [GET] /api/products?_query
    getProducts = asyncHandler(async (req, res) => {
        const queries = { ...req.query };
        const excludeFields = ['limit', 'sort', 'page', 'fields'];
        excludeFields.forEach((item) => delete queries[item]);

        // Sort
        let queryString = JSON.stringify(queries);
        queryString.replace(/\b(gte|gt|lt|lte)\b/g, (item) => `$${item}`);
        const formatQueries = JSON.parse(queryString);

        // Filtering
        if (queries?.title) {
            formatQueries.title = { $regex: queries.title, $options: 'i' };
        }

        let queryCommand = Product.find(formatQueries);

        // Execute query

        const response = await queryCommand.exec();
        const counts = await Product.find(formatQueries).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            counts: counts,
            products: response ? response : 'Can not get products',
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

    // [PUT] /api/products/rating
    ratings = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const { star, comment, pid } = req.body;

        if (!pid || !star) {
            throw new Error('Missing inputs');
        }
        const ratingProduct = await Product.findById(pid);
        const alreadyRating = ratingProduct?.ratings?.find(
            (item) => item.postedBy.toString() === _id
        );
        if (alreadyRating) {
            // Update & comment
            await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRating },
                },
                {
                    $set: {
                        'ratings.$.star': star,
                        'ratings.$.comment': comment,
                    },
                },
                { new: true }
            );
        } else {
            // add star & comment
            await Product.findByIdAndUpdate(
                pid,
                { $push: { ratings: { star, comment, postedBy: _id } } },
                { new: true }
            );
        }

        const updateProduct = await Product.findById(pid);
        const ratingCount = updateProduct.ratings.length;
        const sumRatings = updateProduct.ratings.reduce((sum, item) => {
            return sum + item.star;
        }, 0);
        console.log(ratingCount);
        console.log(sumRatings);
        updateProduct.totalRatings =
            Math.round((sumRatings * 10) / ratingCount) / 10;

        await updateProduct.save();

        return res.status(200).json({
            success: true,
            updateProduct,
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
