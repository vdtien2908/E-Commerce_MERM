const asyncHandler = require('express-async-handler');

const User = require('../../models/UserModel');

class UserController {
    // [GET] /api/users/
    getUsers = asyncHandler(async (req, res) => {
        const users = await User.find().select('-refreshToken -password -role');
        return res.status(200).json({
            success: true,
            data: users,
        });
    });

    // [PUT] /api/users/update
    updateUser = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        if (!_id || Object.keys(req.body).length === 0) {
            throw new Error('Missing inputs');
        }

        const { role, ...data } = req.body;
        const user = await User.findByIdAndUpdate(_id, data, {
            new: true,
        }).select('-password -role -refreshToken');

        return res.status(200).json({
            success: user ? true : false,
            data: user ? user : 'Some thing went wrong',
        });
    });

    // [PUT] /api/users?_id=1123
    updateUserByAdmin = asyncHandler(async (req, res) => {
        const { uid } = req.query;
        if (Object.keys(req.body).length === 0) {
            throw new Error('Missing inputs');
        }

        const { role, ...data } = req.body;
        const user = await User.findByIdAndUpdate(uid, data, {
            new: true,
        }).select('-password -role -refreshToken');

        return res.status(200).json({
            success: user ? true : false,
            data: user ? user : 'Some thing went wrong',
        });
    });

    // [DELETE] /api/users?_id=13123
    deleteUser = asyncHandler(async (req, res) => {
        const { _id } = req.query;
        if (!_id) {
            throw new Error('Missing input');
        }
        const user = await User.findByIdAndDelete(_id);
        return res.status(200).json({
            success: user ? true : false,
            deleteUser: user
                ? `User with email ${user.email} deleted`
                : 'No user delete',
        });
    });
}

module.exports = new UserController();
