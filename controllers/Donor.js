const mongoose = require('mongoose');
const Donor = mongoose.model('Donor');

async function d_create(req, res, next) {
    const body = req.body;
    const password = body.password;

    delete body.password;
    body.status = 'activo';

    const donor = new Donor(body);
    donor.createPassword(password);

    try {
        await donor.save();
        return res.status(201).json({
            success: true,
            msg: 'Registro creado correctamente.',
            data: donor.toAuthJson()
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500);
    }
}

function d_readOne(req, res, next) {
    return res.status(200).json({
        success: true,
        msg: "TODO Read one"
    });
}

function d_readAll(req, res, next) {
    return res.status(200).json({
        success: true,
        msg: "TODO Read all"
    });
}

function d_update(req, res, next) {
    return res.status(200).json({
        success: true,
        msg: "TODO Update"
    });
}

function d_delete(req, res, next) {
    return res.status(200).json({
        success: true,
        msg: "TODO Delete"
    });
}

function d_login(req, res, next) {
    return res.status(200).json({
        success: true,
        msg: "TODO Login"
    });
}

function d_search(req, res, next) {
    return res.status(200).json({
        success: true,
        msg: "TODO Search"
    });
}

module.exports = {
    d_create,
    d_readOne,
    d_readAll,
    d_update,
    d_delete,
    d_login,
    d_search
}