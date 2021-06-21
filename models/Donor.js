const {Schema, model} = require('mongoose');
const unique_validator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');

const DonorSchema = new Schema({
    curp: {
        type: String,
        unique: true,
        uppercase: true,
        required: 'El campo Curp es requerido.'
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
        required: 'El campo Correo es requerido.',
        index: true
    },
    phone_number: {
        type: String
    },
    place_of_residence: String,
    blood_type: {
        type: String,
        uppercase: true,
		match: [/^(?:A|B|AB|O)[+-]$/, "El tipo de sangre no es valido."],
        required: 'El campo Tipo de sangre es requerido.',
        index: true
    },
    certified_file: String,
    form_answers: {
        type: Object,
        default: undefined,
        required: 'El Formulario es requerido.'
    },
    status: {
        type: String,
        required: 'El campo status no esta establecido.',
        enum: ['activo', 'inactivo']
    },
    hash: String,
    salt: String
}, {timestamps: true});

DonorSchema.plugin(unique_validator, {message: 'El campo {PATH} ya esta en uso.'});

DonorSchema.methods.createPassword = function (password) {
    this.salt = crypto
		.randomBytes(16)
		.toString('hex');
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
		.toString('hex');
}

DonorSchema.methods.validatePassword = function (password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
        .toString('hex');

    return this.hash === hash;
}

DonorSchema.methods.generateJWT = function () {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this.id,
        email: this.email,
        type: 'donor-user',
        exp: parseInt(exp.getTime() / 1000)
    }, secret);
}

DonorSchema.methods.toAuthJson = function () {
    return {
        email: this.email,
        token: this.generateJWT()
    }
}

DonorSchema.methods.publicData = function () {
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
        blood_type: this.blood_type,
        certified_file: this.certified_file,
        form_answers: this.form_answers,
        status: this.status,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
}

model('Donor', DonorSchema);