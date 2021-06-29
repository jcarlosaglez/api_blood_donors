module.exports = function is_receiver (req, res, next) {
    if(req.user.type === 'receiver-user') {
        next();
    }
    else {
        return res.status(400).json({
            success: false,
            msg: 'Acceso denegado.'
        });
    }
}