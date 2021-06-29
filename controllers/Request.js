const Request = require('mongoose').model('Request');

async function createRequest(req, res, next) {
    const id_receiver = req.user.id;

    const body = req.body;

    body.status = 'enviada';
    body.id_receiver = id_receiver;

    const request = new Request(body);

    try {
        await request.save();

        return res.status(201).json({
            success: true,
            msg: 'Registro creado correctamente.',
            data: request.publicData()
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

async function readOneRequest(req, res, next) {
    const id_receiver = req.user.id;
    const id = req.params.id;
    try {
        const request = await Request.find({id, id_receiver});

        return res.status(200).json({
            success: true,
            data: request.publicData()
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            msg: 'No se encontro a un Donador con el ID proporcionado.'
        });
    }
}

async function readAllRequests(req, res, next) {
    const id_receiver = req.user.id;
    try {
        const requests = await Request.find({id_receiver});

        return res.status(200).json({
            success: true,
            data: requests.map(request => request.publicData())
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Algo salio mal.'
        });
    }
}

async function updateRequest(req, res, next) {
    const id = req.params.id;
    const {status} = req.body;

    if(!status) {
        return res.status(400).json({
            success: false,
            msg: 'Algunos campos presentan un error de validación.',
            data: {'status': 'El campo Contraseña es requerido.'}
        });
    }

    const donor_updates = [
        'aceptada',
        'rechazada'
    ];

    if(!donor_updates[status]) {
        return res.status(400).json({
            success: false,
            msg: 'Solo puedes aceptar o rechazar la solicitud.'
        });
    }

    try {
        const request = await Request.findById(id);
        if(req.user.type === 'donor-user' && req.user.id === request.id_donor) {

            request.status = status;

            const updatedRequest = await request.save();

            return res.status(200).json({
                success: true,
                data: updatedRequest.publicData()
            });
        }

        throw new Error('Error');
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
            msg: 'No tienes autorización para editar la solicitud.'
        });
    }
}

async function deleteRequest(req, res, next) {
    const id_receiver = req.user.id;
    const id = req.params.id;
    try {
        const request = await Request.findOne({id, id_receiver});

        if(request) {
            request.status = 'eliminada';
            
            await request.save();
    
            return res.status(200).json({
                success: true,
                msg: 'Tu cuenta a sido eliminada.'
            });
        }

        throw new Error('Error');
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({
            success: false,
            msg: 'No se encontro a una Solicitud con el ID proporcionado.'
        });
    }
}

async function search(req, res, next) {
    const id = req.user.id;
    const properties = [
        "curp",
        "place_of_residence",
        "status"
    ];

    try {
        const body = req.body;
        const search = {};

        const type = req.user.type === 'donor-user' ? 'id_donor' : 'id_receiver';
        search[type] = id;

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

        const request = await Request.find(search);
        const requests = request.map(request => request.publicData());

        if(requests.length > 0) {
            return res.status(200).json({
                success: true,
                data: requests
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

module.exports = {
    createRequest,
    readOneRequest,
    readAllRequests,
    updateRequest,
    deleteRequest,
    search
}