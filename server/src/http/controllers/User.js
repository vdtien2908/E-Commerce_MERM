const User = require('../../models');
const asyncHandle = require('express-async-handler');

const register = asyncHandle(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            success: false,
            message: 'Missing input',
        });
    }

    const response = await User.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        message: 'Create user successfully!',
        data: response,
    });
});

module.exports = { register };
