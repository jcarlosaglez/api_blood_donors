const {Schema, model} = require('mongoose');
const unique_validator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');

const ReceiverSchema = new Schema({
    curp: {
        type: String,
        unique: true,
        uppercase: true,
        required: 'El campo {PATH} es requerido.'
    },
    first_name: {
        type: String,
        required: 'El campo Nombre(s) es requerido.'
    },
    last_name: {
        type: String,
        required: 'El campo Apellidos es requerido.'
    },
    date_of_birth: {
        type: String,
        required: 'El campo Fecha de nacimiento es requerido.'
    },
    gender: String,
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: 'El campo Correo es requerido',
        index: true
    },
    phone_number: {
        type: String
    },
    place_of_residence: String,
    status: {
        type: String,
        enum: ['activo', 'inactivo']
    },
    hash: String,
    salt: String
}, {timestamps: true});

ReceiverSchema.methods.createPassword = function (password) {
    this.salt = crypto
		.randomBytes(16)
		.toString('hex');
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
		.toString('hex');
}

ReceiverSchema.methods.validatePassword = function (password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
        .toString('hex');

    return this.hash === hash;
}

ReceiverSchema.methods.generateJWT = function () {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this.id,
        email: this.email,
        type: 'receiver-user',
        exp: parseInt(exp.getTime() / 1000)
    }, secret);
}

ReceiverSchema.methods.toAuthJson = function () {
    return {
        email: this.email,
        token: this.generateJWT()
    }
}

ReceiverSchema.methods.publicData = function () {
    return {
        id: this.id,
        curp: this.curp,
        first_name: this.first_name,
        last_name: this.last_name,
        date_of_birth: this.date_of_birth,
        gender: this.gender,
        email: this.email,
        phone_number: this.phone_number,
        place_of_residence: this.place_of_residence,
        status: this.status,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
}

model('Receiver', ReceiverSchema);