const asyncHandle = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const sendMail = require('../../utils/sendMail');
const User = require('../../models/UserModel');
const {
    generateAccessToken,
    generateRefreshToken,
} = require('../middlewares/jwt');

class AuthController {
    // [POST] /api/auth/register
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
        });
    });

    // [POST] /api/auth/login
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
            const { password, role, refreshToken, ...userFilter } =
                user.toObject();

            // Create accessToken
            // + Authentication
            // + Decentralization
            const accessToken = generateAccessToken(userFilter._id, role);

            // Create refreshToken
            // + RefreshToken has a new function of accessToken
            const NewRefreshToken = generateRefreshToken(userFilter._id);

            // Save refreshToken to database
            await User.findByIdAndUpdate(
                userFilter._id,
                { refreshToken: NewRefreshToken },
                { new: true }
            );

            // Save refreshToken to cookie
            res.cookie('refreshToken', NewRefreshToken, {
                httpOnly: true, // Only method 'http'
                maxAge: 7 * 24 * 60 * 60 * 1000, // Set time cookie
            });

            return res.status(200).json({
                success: true,
                data: {
                    accessToken,
                    user: userFilter,
                },
            });
        } else {
            throw new Error('Invalid credentials');
        }
    });

    // [GET] /api/auth/current-user
    getCurrent = asyncHandle(async (req, res) => {
        const { _id } = req.user;
        const user = await User.findById({ _id }).select(
            '-refreshToken -password -role'
        );
        return res.status(200).json({
            success: user ? true : false,
            data: user ? user : 'User not found',
        });
    });

    // [POST] /api/auth/refreshToken
    refreshAccessToken = asyncHandle(async (req, res) => {
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

    // [GET] /api/auth/logout
    logout = asyncHandle(async (req, res) => {
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

    // [GET] /api/auth/forgot-password?email=demo@example.com
    forgotPassword = asyncHandle(async (req, res) => {
        const { email } = req.query;

        if (!email) {
            throw new Error('Missing email');
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found!');
        }

        // Create reset password token
        const resetToken = user.createPasswordChangeToke();
        // Save reset password token
        await user.save();

        // - Send Email
        // Create content email
        const html = `
        <p>
            Xin vui lòng click vào đây để thay đổi mật khẩu. Link này sẽ hết hạn sau 15 phút từ lúc bạn nhận được. 
            <a href="${process.env.URL_SERVER}/api/auth/reset-password/${resetToken}">
                Bấm vào đây để thay đổi mật khẩu
            </a>
        <p/>
        `;
        const data = {
            email,
            html,
        };
        const response = await sendMail(data);
        return res.status(200).json({
            success: true,
            response,
        });
    });

    // [PUT] /api/auth/reset-password
    resetPassword = asyncHandle(async (req, res) => {
        const { password, token } = req.body;

        if (!password || !token) {
            throw new Error('Missing inputs');
        }

        const passwordResetToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            throw new Error('Invalid reset token');
        }

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.passwordChangeAt = Date.now();
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Update password successfully',
        });
    });
}

module.exports = new AuthController();
