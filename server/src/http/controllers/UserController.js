const asyncHandle = require('express-async-handler');
const jwt = require('jsonwebtoken');

const User = require('../../models/UserModel');
const {
    generateAccessToken,
    generateRefreshToken,
} = require('../middlewares/jwt');

class UserController {
    // [POST] /api/user/register
    register = asyncHandle(async (req, res) => {
        const { email, password, firstName, lastName, mobile } = req.body;
        if (!email || !password || !firstName || !lastName || !mobile) {
            return res.status(400).json({
                success: false,
                message: 'Missing inputs',
            });
        }

        // Check User
        const user = await User.findOne({ email });
        if (user) {
            throw new Error('User has existed!');
        }

        const response = await User.create(req.body);
        return res.status(200).json({
            success: response ? true : false,
            message: 'Create user successfully!',
            data: response,
        });
    });

    // [POST] /api/user/login
    login = asyncHandle(async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing inputs',
            });
        }

        const user = await User.findOne({ email });
        const isCheckPass = await user.isCorrectPassword(password);
        if (user && isCheckPass) {
            const { password, role, ...userFilter } = user.toObject();

            // Create accessToken
            // + Authentication
            // + Decentralization
            const accessToken = generateAccessToken(userFilter._id, role);

            // Create refreshToken
            // + RefreshToken has a new function of accessToken
            const refreshToken = generateRefreshToken(userFilter._id);

            // Save refreshToken to database
            await User.findByIdAndUpdate(
                userFilter._id,
                { refreshToken },
                { new: true }
            );

            // Save refreshToken to cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                success: true,
                data: {
                    accessToken,
                    refreshToken,
                    user: userFilter,
                },
            });
        } else {
            throw new Error('Invalid credentials');
        }
    });

    // [GET] /api/user/current-user
    getCurrent = asyncHandle(async (req, res, next) => {
        const { _id } = req.user;
        const user = await User.findById({ _id }).select(
            '-refreshToken -password -role'
        );
        return res.status(200).json({
            success: true,
            data: user ? user : 'User not found',
        });
    });

    // [POST] /api/user/refreshToken
    refreshAccessToken = asyncHandle(async (req, res, next) => {
        const cookie = req.cookies;
        if (!cookie && !cookie.refreshToken) {
            throw new Error('No refresh token in cookies');
        }

        const result = await jwt.verify(
            cookie.refreshToken,
            process.env.JWT_SECRET
        );

        const user = await User.findOne({
            _id: result._id,
            refreshToken: cookie.refreshToken,
        });

        if (!user) throw new Error('User is not define!');

        return res.status(200).json({
            success: true,
            newAccessToken: generateAccessToken(user._id, user.role),
        });
    });

    // [GET] /api/user/logout
    logout = asyncHandle(async (req, res, next) => {
        const cookie = req.cookies;
        if (!cookie || !cookie.refreshToken) {
            throw new Error('No refresh token in cookies');
        }

        await User.findOneAndUpdate(
            { refreshToken: cookie.refreshToken },
            { refreshToken: '' },
            { new: true }
        );
        res.clearCookie('refreshToken', { httpOnly: true, secure: true });
        res.status(200).json({
            success: true,
            message: 'Logout successfully',
        });
    });
}

module.exports = new UserController();
