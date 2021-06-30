const Donor = require('mongoose').model('Donor');
const {unlink} = require('fs/promises');
const passport = require('passport');

async function createDonor(req, res, next) {
    const body = req.body;

    if(!body.password) {
        return res.status(400).json({
            success: false,
            msg: 'Algunos campos presentan un error de validación.',
            data: {'password': 'El campo Contraseña es requerido.'}
        });
    }

    if(!body.certified_file) {
        if(!req?.file?.filename) {
            return res.status(400).json({
                success: false,
                msg: 'Algunos campos presentan un error de validación.',
                data: {'certified_file': 'El campo Archivo certificado es requerido.'}
            });
        }
    }

    try {
        body.form_answers = JSON.parse(body.form_answers);
    }
    catch {
        console.log("No es un json");
    }

    if(body.form_answers?.constructor !== Object || (Object.keys(body.form_answers).length === 0 && body.form_answers.constructor === Object)) {
        return res.status(400).json({
            success: false,
            msg: 'Algunos campos presentan un error de validación.',
            data: {'form_answers': 'El Formulario es requerido.'}
        });
    }

    const password = body.password;

    delete body.password;
    body.status = 'activo';
    body.certified_file = req.file.filename;

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
        removeFile(`./public/certified_files/${body.certified_file}`);
    
        if(error.name === 'ValidationError') {
            let validationErrors = {};

            Object.keys(error.errors).forEach(key => {
                validationErrors[key] = error.errors[key].message
            });

            return res.status(400).json({
                success: false,
                msg: 'Algunos campos presentan un error de validación.',
                data: validationErrors
            });
        }

        return res.status(500).json({
            success: false,
            msg: 'Algo salio mal.'
        });
    }
}

async function readOneDonor(req, res, next) {
    const id = req.params.id;
    try {
        const donor = await Donor.findById(id);

        return res.status(200).json({
            success: true,
            data: donor.publicData()
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            msg: 'No se encontro a un Donador con el ID proporcionado.'
        });
    }
}

async function readAllDonors(req, res, next) {
    try {
        const donors = await Donor.find({});

        return res.status(200).json({
            success: true,
            data: donors.map(donor => donor.publicData())
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Algo salio mal.'
        });
    }
}

async function updateDonor(req, res, next) {
    const id = req.user.id;
    const properties = [
        "curp",
        "first_name",
        "last_name",
        "date_of_birth",
        "gender",
        "email",
        "phone_number",
        "place_of_residence",
        "clave_hospital",
        "blood_type",
        "form_answers",
        "status"
    ];

    if(Object.keys(req.body).length < 1) {
        return res.status(400).json({
            success: false,
            msg: 'No hay cambios a efectuar.'
        });
    }

    try {
        const donor = await Donor.findById(id);
        const body = req.body;

        properties.forEach(property => {
            donor[property] = body[property] ? body[property] : donor[property];
        });

        const updatedDonor = await donor.save();

        return res.status(200).json({
            success: true,
            data: updatedDonor.publicData()
        });
    }
    catch (error) {
        if(error.name === 'ValidationError') {
            let validationErrors = {};

            Object.keys(error.errors).forEach(key => {
                validationErrors[key] = error.errors[key].message
            });

            return res.status(400).json({
                success: false,
                msg: 'Algunos campos presentan un error de validación.',
                data: validationErrors
            });
        }

        return res.status(404).json({
            success: false,
            msg: 'No se encontro a un Donador con el ID proporcionado.'
        });
    }
}

async function deleteDonor(req, res, next) {
    if(req.params.id != req.user.id) {
        return res.status(400).json({
            success: false,
            msg: 'Solo puedes eliminar tu propio perfil.'
        });
    }

    const id = req.user.id;

    try {
        const donor = await Donor.findById(id);

        donor.status = 'eliminado';
        
        await donor.save();

        return res.status(200).json({
            success: true,
            msg: 'Tu cuenta a sido eliminada.'
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            msg: 'No se encontro a un Donador con el ID proporcionado.'
        });
    }
}

async function login(req, res, next) {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(200).json({
            success: false,
            msg: "Se require del correo y contraseña."
        });
    }

    passport.authenticate("local-donor", {session: false}, function(err, user, info) {
        if(err) {
            return next(err);
        }
        if(user) {
            return res.status(200).json({
                success: true,
                data: user.toAuthJson()
            });
        }
        else {
            return res.status(400).json(info);
        }
    })(req, res, next);
}

async function search(req, res, next) {
    const properties = [
        "curp",
        "place_of_residence",
        "clave_hospital",
        "blood_type",
        "status"
    ];

    try {
        const body = req.body;
        const search = {};

        Object.keys(body).forEach(key => {
            if(properties.includes(key)) {
                search[key] = body[key];
            }
        });

        if(Object.keys(search).length < 1) {
            return res.status(400).json({
                success: false,
                msg: 'No hay parametros de busqueda.'
            });
        }

        const donor = await Donor.find(search);
        const donors = donor.map(donor => donor.publicData());

        if(donors.length > 0) {
            return res.status(200).json({
                success: true,
                data: donors
            });
        }
        else {
            return res.status(404).json({
                success: false
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Algo salio mal.'
        });
    }
}

async function changeCertifiedFile(req, res, next) {
    if(req.params.id != req.user.id) {
        return res.status(400).json({
            success: false,
            msg: 'Solo puedes cambiar tu propio archivo certificado.'
        });
    }

    const id = req.user.id;

    if(!req.body.certified_file) {
        if(!req?.file?.filename) {
            return res.status(400).json({
                success: false,
                msg: 'Algunos campos presentan un error de validación.',
                data: {'certified_file': 'El campo Archivo certificado es requerido.'}
            });
        }
    }

    try {
        const donor = await Donor.findById(id);

        removeFile(`./public/certified_files/${donor.certified_file}`);

        donor.certified_file = req.file.filename;

        const updatedDonor = await donor.save();

        return res.status(200).json({
            success: true,
            data: updatedDonor.publicData()
        });
    }
    catch (error) {
        removeFile(`./public/certified_files/${req.file.filename}`);

        return res.status(404).json({
            success: false,
            msg: 'No se encontro a un Donador con el ID proporcionado.'
        });
    }
}

async function me(req, res, next) {
    const donor = await Donor.findById(req.user.id);

    return res.status(200).json({
        success: true,
        data: donor.fullData()
    });
}

async function removeFile(path) {
    try {
        await unlink(path);
    }
    catch (error) {
        console.log('El archivo no se pudo eliminar.');
    }
}

module.exports = {
    createDonor,
    readOneDonor,
    readAllDonors,
    updateDonor,
    deleteDonor,
    login,
    search,
    changeCertifiedFile,
    me
}