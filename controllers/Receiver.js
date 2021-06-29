const Receiver = require('mongoose').model('Receiver');
const passport = require('passport');

async function createReceiver(req, res, next) {
    const body = req.body;

    if(!body.password) {
        return res.status(400).json({
            success: false,
            msg: 'Algunos campos presentan un error de validación.',
            data: {'password': 'El campo Contraseña es requerido.'}
        });
    }

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

async function readOneReceiver(req, res, next) {
    const id = req.params.id;
    try {
        const receiver = await Receiver.findById(id);

        return res.status(200).json({
            success: true,
            data: receiver.publicData()
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            msg: 'No se encontro a un Donador con el ID proporcionado.'
        });
    }
}

async function readAllReceivers(req, res, next) {
    try {
        const receivers = await Receiver.find({});

        return res.status(200).json({
            success: true,
            data: receivers.map(receiver => receiver.publicData())
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Algo salio mal.'
        });
    }
}

async function updateReceiver(req, res, next) {
    if(req.params.id != req.user.id) {
        return res.status(400).json({
            success: false,
            msg: 'Solo puedes editar tu propio perfil.'
        });
    }

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
        "status"
    ];

    if(Object.keys(req.body).length < 1) {
        return res.status(400).json({
            success: false,
            msg: 'No hay cambios a efectuar.'
        });
    }

    try {
        const receiver = await Receiver.findById(id);
        const body = req.body;

        properties.forEach(property => {
            receiver[property] = body[property] ? body[property] : receiver[property];
        });

        const updatedReceiver = await receiver.save();

        return res.status(200).json({
            success: true,
            data: updatedReceiver.publicData()
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

async function deleteReceiver(req, res, next) {
    if(req.params.id != req.user.id) {
        return res.status(400).json({
            success: false,
            msg: 'Solo puedes eliminar tu propio perfil.'
        });
    }

    const id = req.user.id;

    try {
        const receiver = await Receiver.findById(id);

        receiver.status = 'eliminado';
        
        await receiver.save();

        return res.status(200).json({
            success: true,
            msg: 'Tu cuenta a sido eliminada.'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({
            success: false,
            msg: 'No se encontro a un Receptor con el ID proporcionado.'
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

    passport.authenticate("receiver-donor", {session: false}, function(err, user, info) {
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

        const receiver = await Receiver.find(search);
        const receivers = receiver.map(receiver => receiver.publicData());

        if(receivers.length > 0) {
            return res.status(200).json({
                success: true,
                data: receivers
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

async function me(req, res, next) {
    const receiver = await Receiver.findById(req.user.id);

    return res.status(200).json({
        success: true,
        data: receiver.fullData()
    });
}

module.exports = {
    createReceiver,
    readOneReceiver,
    readAllReceivers,
    updateReceiver,
    deleteReceiver,
    login,
    search,
    me
}