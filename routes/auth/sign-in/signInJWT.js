const queries = require('../../../queries');
const { queryAsync } = require('../../../db');
const ApiError = require('../../../lib/apiError');

module.exports = async function signInJWT(req, res, next) {
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

}

