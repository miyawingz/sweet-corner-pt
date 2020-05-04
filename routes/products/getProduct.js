const queries = require('../../queries');
const { queryAsync } = require('../../db');
const ApiError = require('../../lib/apiError');

module.exports = async function getProducts(req, res, next) {
    const id = req.params['product_id'];

    try {
        if (id) {
            const queryInfo = queries.GetProductById(id);
            const { rows, rowCount } = queryAsync(queryInfo.text, queryInfo.values);

            if (rowCount < 1) {
                return next(new ApiError(500, `productId ${id} does not exist`))
            }

            const { product } = rows[0];

            res.send(product);
            return;
        }

        if (!id) {
            const queryInfo = queries.GetAllProducts();
            const { rows } = await queryAsync(queryInfo.text, queryInfo.values);
            const { products } = rows[0];

            if (!products) {
                return next(new ApiError(500, 'no product available'));
            }

            res.send({ products });
            return;
        }

    } catch (err) {
        next(err);
    }
}
