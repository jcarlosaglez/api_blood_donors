// Importar las bibliotecas necesarias
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {mongoDebug} = require("./config");
require('dotenv').config();

// Se crea una instancia de express como servidor
const server = express();

// Se establece el puerto donde correra la aplicación
const PORT = process.env.PORT || 3000;

// Configuración de middlewares globales
server.use(cors());
server.use(express.urlencoded({extended: true}));
server.use(express.json());

// Configuración de mongoose
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => {
    console.log("Conexión con la base de datos establecida!");
})
.catch(err => {
    console.log(`db error ${err.message}`);
	process.exit(-1)
});

mongoose.set("debug", mongoDebug);

require('./models/Donor.js');
require('./models/Receiver.js');
require('./models/Request.js');

// Rutas de la API
server.use(require('./routes'));

// Control de errores 404
server.use((req, res, next) => {
    res.status(404).json({msg: 'Not found!'});
});

// Control de errores
server.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).json({msg: 'Something broke!'})
});

// Se inicia el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});