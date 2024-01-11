const User = require('../../models/UserModel');
const asyncHandle = require('express-async-handler');

class UserController {
    register = asyncHandle(async (req, res) => {
        const { email, password, firstName, lastName, mobile } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'Missing input',
            });
        }

        const user = await User.find({ email });
        if (user) {
            throw new Error('User is duplicate');
        }

        const response = await User.create(req.body);
        return res.status(200).json({
            success: response ? true : false,
            message: 'Create user successfully!',
            data: response,
        });
    });
}

module.exports = new UserController();
