const jwt = require('jsonwebtoken');

const generateAccessToken = (uid, role) => {
    const secretKey = process.env.JWT_SECRET;
    const payload = { _id: uid, role };
    return jwt.sign(payload, secretKey, { expiresIn: '2d' });
};

const generateRefreshToken = (uid) => {
    const secretKey = process.env.JWT_SECRET;
    const payload = { _id: uid };
    return jwt.sign(payload, secretKey, { expiresIn: '7d' });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
