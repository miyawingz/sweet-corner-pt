const express = require('express');
const router = express.Router();
const queries = require('../../queries');
const { query } = require('../../db');
const ApiError = require('../../lib/apiError');

router.get('/full', (req, res, next) => {

})

router.get('/:product_id', (req, res, next) => {
    const id = req.params['product_id'];
    const queryInfo = queries.GetProductById(id);
    query(queryInfo.text, queryInfo.values, (err, result) => {
        if (err) {
            return next(err)
        }

        if (result.rowCount === 0) {
            return next(new ApiError(500, `productId ${id} does not exist`))
        }

        const { product } = result.rows[0];

        res.send(product);
    })
})


router.get('/', (req, res, next) => {
    const queryInfo = queries.GetAllProducts();
    query(queryInfo.text, queryInfo.values, (err, result) => {
        if (err) {
            return next(err);
        }

        const { products } = result.rows[0];

        if (!products) {
            return next(new ApiError(500, 'no product available'));
        }

        res.send({ products });
    })
})

module.exports = router;