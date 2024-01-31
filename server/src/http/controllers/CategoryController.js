const asyncHandler = require('express-async-handler');

const Category = require('../../models/CategoryModel');

class CategoryController {
    // [POST] /api/categories
    create = asyncHandler(async (req, res) => {
        const response = await Category.create(req.body);
        return res.status(200).json({
            success: response ? true : false,
            createdCategory: response ? response : "Can't category!",
        });
    });
}

module.exports = new CategoryController();
