const {Schema, model} = require('mongoose');

const RequestSchema = new Schema({
    id_receiver: {
        type: Schema.Types.ObjectId,
        ref: 'Receiver',
        required: 'El campo Receptor es requerido.'
    },
    id_donor: {
        type: Schema.Types.ObjectId,
        ref: 'Donor',
        required: 'El campo Donador es requerido.'
    },
    required_blood_type: {
        type: String,
        trim: true,
        uppercase: true,
		match: [/^(?:A|B|AB|O)[+-]$/, "El tipo de sangre no es valido."],
        required: 'El campo Tipo de sangre requerida es requerido.'
    },
    message: String,
    status: {
        type: String,
        trim: true,
        required: 'El campo status no esta establecido.',
        enum: ['enviada', 'aceptada', 'rechazada', 'eliminada']
    }
}, {timestamps: true});

RequestSchema.methods.publicData = function () {
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

model('Request', RequestSchema);