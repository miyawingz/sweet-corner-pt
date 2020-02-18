const express = require('express');
const router = express.Router();
const queries = require('../../queries');
const { queryAsync } = require('../../db');
const { compare } = require('../../lib/hash');
const { tokenHandler } = require('../../middleware/token_handler');
const { tokenEncode } = require('../../lib/jwtHandler');
const { emailValidate } = require('../../lib/userUtils');
const ApiError = require('../../lib/apiError');

router.get('/', tokenHandler, async (req, res, next) => {
    const { uid } = res.locals;

    try {
        if (!uid) {
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
        if (!emailValidate(email)) {
            return next(new ApiError(422, 'invalid email'));
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
            const queryInfo = queries.UpdateCartUserId(pid, cartId);
            const result = await queryAsync(queryInfo.text, queryInfo.values);
        }

        const token = tokenEncode({ uid: pid });

        res.send({
            token,
            'user': {
                email, name, pid
            }
        })

    } catch (err) {
        next(err);
    }

})

module.exports = router;