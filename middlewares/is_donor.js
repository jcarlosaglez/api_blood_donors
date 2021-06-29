module.exports = function is_donor (req, res, next) {
    if(req.user.type === 'donor-user') {
        next();
    }
    else {
        return res.status(400).json({
            success: false,
            msg: 'Acceso denegado.'
        });
    }
}