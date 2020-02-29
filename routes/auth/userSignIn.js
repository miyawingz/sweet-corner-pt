const express = require('express');
const router = express.Router();
const queries = require('../../queries');
const { queryAsync } = require('../../db');
const { compare } = require('../../lib/hash');
const { tokenHandler } = require('../../middleware/token_handler');
const { tokenEncode, tokenDecode } = require('../../lib/jwtHandler');
const { emailValidate } = require('../../lib/userUtils');
const ApiError = require('../../lib/apiError');

router.get('/', tokenHandler, async (req, res, next) => {
    const { uid, token } = res.locals;

    try {
        if (!uid || !token) {
            return next(new ApiError(400, 'invalid user token'))
        }

        const queryInfo = queries.GetUserByUid(uid);
        const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
        if (rowCount === 0) {
            return next(new ApiError(400, 'invalid user token'))
        }

        res.send({ user: rows[0] })

    } catch (err) {
        next(err)
    }

})

router.post('/', tokenHandler, async (req, res, next) => {
    const { cartId } = res.locals;
    const { email, password } = req.body;

    try {
        if (!password || !email || !emailValidate(email)) {
            return next(new ApiError(422, 'invalid email or missing password'));
        }

        const queryInfo = queries.GetUserByEmail(email);
        const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
        if (rowCount === 0) {
            return next(new ApiError(500, 'email does not exist'));
        }

        const { hash, name, pid } = rows[0];

        if (!await compare(password, hash)) {
            return next(new ApiError(500, 'invalid password'));
        }

        if (cartId) {
            const queryInfoUidSQL = queries.GetIdInSQL('users', pid);
            const { rows } = await queryAsync(queryInfoUidSQL.text, queryInfoUidSQL.values);

            const queryInfoGetCurrentCart = queries.GetCartIdByUser(rows[0].id, 2);
            const ResultCurrentCart = await queryAsync(queryInfoGetCurrentCart.text, queryInfoGetCurrentCart.values);
            if (ResultCurrentCart.rowCount > 0) {
                for (let i = 0; i < ResultCurrentCart.rowCount; i++) {
                    const queryInfoCartStatus = queries.UpdateCartStatus(ResultCurrentCart.rows[i].id, 5);
                    await queryAsync(queryInfoCartStatus.text, queryInfoCartStatus.values);
                }
            }

            const queryInfo = queries.UpdateCartUserId(pid, cartId);
            await queryAsync(queryInfo.text, queryInfo.values);
        }

        const token = tokenEncode({ uid: pid, iat: Date.now(), exp: (Date.now() + 12096e5) });

        res.send({
            token,
            user: {
                email, name, pid
            }
        })

    } catch (err) {
        next(err);
    }

})

module.exports = router;