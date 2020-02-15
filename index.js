const express = require('express');
const { routes } = require('./routes');
const logger = require('./middleware/default_logger');
const defaultErrorHandler = require('./middleware/default_error_handler');

const baseApp = express();
baseApp.use('/', logger);
baseApp.use(express.json());

const app = routes(baseApp);

app.use('/', defaultErrorHandler);

app.listen(9000, () => {
    console.log('server listening on 9000')
})
