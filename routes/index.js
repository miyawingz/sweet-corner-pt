const express = require('express');

function ApplyRoutes(app) {

    const apiRouter = express.Router();

    apiRouter.use('/cart', require('./cart'));
    apiRouter.use('/products', require('./products'));
    apiRouter.use('/orders', require('./orders'));
    apiRouter.use('/auth', require('./auth'));

    app.use('/api', apiRouter);

    return app;
}

module.exports.routes = ApplyRoutes;