const express = require('express');
const router = express.Router();
const queries = require('../../queries');
const { queryAsync } = require('../../db');
const { generate } = require('../../lib/hash');
const { emailValidate, passwordValidate } = require('../../lib/userUtils');
const ApiError = require('../../lib/apiError');
const { tokenHandler } = require('../../middleware/token_handler');
const { tokenEncode } = require('../../lib/jwtHandler');


router.post('/', tokenHandler, async (req, res, next) => {
    const { email, firstName, lastName, password } = req.body;
    const { cartId } = res.locals;
    const hashPW = await generate(password);

    try {
        if (!emailValidate(email) || !passwordValidate(password)) {
            return next(new ApiError(422, 'invalid email or password'));
        }

        const queryInfo = queries.CreateNewUser(email, firstName, lastName, hashPW);
        const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);

        if (rowCount === 0) {
            return next(new ApiError(500, 'fail to add user'));
        }

        const uid = rows[0].pid;
        const token = tokenEncode({ uid });

        if (cartId) {
            const queryInfo = queries.UpdateCartUserId(uid, cartId);
            const result = await queryAsync(queryInfo.text, queryInfo.values);
        }

        res.send({
            token,
            "user": { ...rows[0] }
        })

    } catch (err) {
        next(err)
    }
})

module.exports = router;