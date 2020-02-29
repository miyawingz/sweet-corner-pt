const { tokenDecode } = require('../lib/jwtHandler');
const ApiError = require('../lib/apiError');

async function tokenHandler(req, res, next) {
    const userToken = req.headers.authorization;
    const cartToken = req.headers['x-cart-token'];
    const token = userToken || cartToken;

    let decode = {}
    if (token) {
        try {
            decode = tokenDecode(token);
        } catch (err) {
            return next(new ApiError(500, err));
        }
    }

    res.locals.token = token;

    if (decode.exp && Date.now() > decode.exp) {
        return next(new ApiError(500, 'token has expired'))
    }

    res.locals.uid = decode.uid;
    res.locals.cartId = decode.cartId;

    next();
}

module.exports.tokenHandler = tokenHandler;