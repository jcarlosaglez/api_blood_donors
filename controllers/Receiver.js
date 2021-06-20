const Receiver = require('mongoose').model('Receiver');

async function r_create(req, res, next) {
    const body = req.body;
    const password = body.password;

    delete body.password;
    body.status = 'activo';

    const receiver = new Receiver(body);
    receiver.createPassword(password);

    try {
        await receiver.save();
        return res.status(201).json({
            success: true,
            msg: 'Registro creado correctamente.',
            data: receiver.toAuthJson()
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500);
    }
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

function r_login(req, res, next) {
    return res.status(200).json({
        success: true,
        msg: "TODO Login"
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
    r_login,
    r_search
}