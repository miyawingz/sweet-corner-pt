const jwt = require('jwt-simple');
const { jwtSecret } = require('../config/jwtSecret');

module.exports = {
    tokenEncode: (payload) => {
        return jwt.encode(payload, jwtSecret)
    },
    tokenDecode: (token) => {
       return jwt.decode(token, jwtSecret)
    }
}
