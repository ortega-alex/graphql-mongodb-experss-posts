const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');
const createJWTToken = user =>
    jwt.sign({ user }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });

module.exports = createJWTToken;
