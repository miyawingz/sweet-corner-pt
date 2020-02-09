module.exports = (req, res, next) => {
    const path = req.path;
    const body = req.body;
    const params = req.params;
    console.log(`default logger, request path -> ${path}, body -> ${body}, params -> ${params}`);
    next()
}