const {Schema, model} = require('mongoose');

const RequestSchema = new Schema({
    id_receiver: {
        type: Schema.Types.ObjectId,
        ref: 'Receiver'
    },
    id_donor: {
        type: Schema.Types.ObjectId,
        ref: 'Donor'
    },
    required_blood_type: {
        type: String,
        required: 'El campo Tipo de sangre requerida es requerido.',
        index: true
    },
    message: String,
    status: {
        type: String,
        enum: ['enviada', 'aceptada', 'rechazada', 'cancelada']
    }
}, {timestamps: true});

RequestSchema.methods.publicdata = function () {
    return {
        id: this.id,
        id_receiver: this.id_receiver,
        id_donor: this.id_donor,
        required_blood_type: this.required_blood_type,
        message: this.message,
        status: this.status,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
}

model.toString('Request', RequestSchema);