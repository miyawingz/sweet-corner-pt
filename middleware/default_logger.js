module.exports = (req, res, next) => {
    const {path, body, params, headers} = req;
    console.log(`default logger, request path -> ${path}, header -> ${headers}, body -> ${body}, params -> ${params}`);
    next();
}