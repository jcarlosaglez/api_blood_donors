const Request = require('mongoose').model('Request');

function r_create(req, res, next) {
    return res.status(200).json({
        success: true,
        msg: "TODO Create"
    });
}

function r_readOne(req, res, next) {
    return res.status(200).json({
        success: true,
        msg: "TODO Read one"
    });
}

function r_readAll(req, res, next) {
    return res.status(200).json({
        success: true,
        msg: "TODO Read all"
    });
}

function r_update(req, res, next) {
    return res.status(200).json({
        success: true,
        msg: "TODO Update"
    });
}

function r_delete(req, res, next) {
    return res.status(200).json({
        success: true,
        msg: "TODO Delete"
    });
}

function r_search(req, res, next) {
    return res.status(200).json({
        success: true,
        msg: "TODO Search"
    });
}

module.exports = {
    r_create,
    r_readOne,
    r_readAll,
    r_update,
    r_delete,
    r_search
}