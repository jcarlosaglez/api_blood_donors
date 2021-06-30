const Request = require('mongoose').model('Request');
const Donor = require('mongoose').model('Donor');

async function createRequest(req, res, next) {
    const id_receiver = req.user.id;

    const body = req.body;

    body.status = 'enviada';
    body.id_receiver = id_receiver;

    const request = new Request(body);

    try {
        const donor = await Donor.findById(body.id_donor);
    
        if(!donor) {
            return res.status(404).json({
                success: false,
                msg: 'El Donador con el ID seleccionado no existe.'
            });
        }

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
        
        if(error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                msg: 'El Donador con el ID seleccionado no existe.'
            });
        }

        return res.status(500).json({
            success: false,
            msg: 'Algo salio mal.'
        });
    }
}

async function readOneRequest(req, res, next) {
    const id = req.params.id;
    try {
        let request = {};

        if(req.user.type === 'donor-user') {
            request= await Request.findOne({_id: id, id_donor: req.user.id}).exec();

            if(request.status !== 'aceptada') {
                request = await request.populate('id_receiver', 'first_name last_name').execPopulate();
            }
            else {
                request = await request.populate('id_receiver').execPopulate();
            }
        }
        else {
            request = await Request.findOne({_id: id, id_receiver: req.user.id}).exec();

            if(request.status !== 'aceptada') {
                request = await request.populate('id_donor', 'first_name last_name blood_type').execPopulate();
            }
            else {
                request = await request.populate('id_donor').execPopulate();
            }
        }

        return res.status(200).json({
            success: true,
            data: request.publicData()
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            msg: 'No se encontro a una Solicitud con el ID proporcionado.'
        });
    }
}

async function readAllRequests(req, res, next) {
    try {
        let requests = {};

        if(req.user.type === 'donor-user') {
            requests = await Request.find({id_donor: req.user.id}).populate('id_receiver', 'first_name last_name');
        }
        else {
            requests = await Request.find({id_receiver: req.user.id}).populate('id_donor', 'first_name last_name blood_type');
        }

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
            data: {'status': 'El campo Estatus es requerido.'}
        });
    }

    const donor_updates = [
        'aceptada',
        'rechazada'
    ];

    if(!donor_updates.includes(status)) {
        return res.status(400).json({
            success: false,
            msg: 'Solo puedes aceptar o rechazar la solicitud.'
        });
    }

    try {
        const request = await Request.findById(id);

        if(req.user.type === 'donor-user' && req.user.id == request.id_donor) {
            if(status === 'aceptada') {
                const donor = await Donor.findById(req.user.id);
                donor.status = 'inactivo';
                await donor.save();
                const requests = await Request.find({id_donor: req.user.id});

                requests.forEach(async request => {
                    if(request.id != id && request.status === 'enviada') {
                        request.status = 'rechazada';
                        await request.save();
                    }
                });
            }

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
        const request = await Request.findOne({_id: id, id_receiver});

        if(request.status === 'enviada') {
            request.status = 'eliminada';
            
            await request.save();
        }

        return res.status(200).json({
            success: true,
            msg: 'La Solicitud ha a sido eliminada.'
        });
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
        "required_blood_type",
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

        let requests = {};

        if(req.user.type === 'donor-user') {
            requests = await Request.find(search).populate('id_receiver', 'first_name last_name');
        }
        else {
            requests = await Request.find(search).populate('id_donor', 'first_name last_name blood_type');
        }

        if(requests.length > 0) {
            return res.status(200).json({
                success: true,
                data: requests.map(request => request.publicData())
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