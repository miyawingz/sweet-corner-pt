const { tokenDecode } = require('../lib/jwtHandler');
const queries = require('../queries');
const { queryAsync } = require('../db')

async function tokenHandler(req, res, next) {
    const userToken = req.headers.authorization;
    const cartToken = req.headers['x-cart-token'];
    const token = userToken || cartToken;
    res.locals = {};

    let decode = {}
    if (token) {
        decode = tokenDecode(token);
        res.locals.token = token;
    }

    if (decode.uid) {
        res.locals.uid = decode.uid;
        const queryInfo = queries.GetCartByUser(decode.uid);
        const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
        if (rowCount > 0) {
            res.locals.cartId = rows[0].data.cartId;
        }
    }

    if (decode.cartId) {
        res.locals.cartId = decode.cartId;
    }

    next();
}

module.exports.tokenHandler = tokenHandler;