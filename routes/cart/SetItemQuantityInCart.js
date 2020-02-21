const express = require('express');
const router = express.Router();
const queries = require('../../queries');
const { queryAsync } = require('../../db');
const ApiError = require('../../lib/apiError');

router.use('/', async (req, res, next) => {
    const { itemId, cartId } = res.locals;
    const cartIdSQL = res.locals.sqlInfo.cartId;

    if (!cartId) {
        return next(new ApiError('500', 'invalid auth'))
    }
    
})