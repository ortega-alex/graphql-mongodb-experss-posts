const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const authenticate = (req, _, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.verifiedUser = verified?.user;
        next();
    } catch (error) {
        next();
    }
};

module.exports = { authenticate };
