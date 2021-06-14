const {Router} = require('express');
const routes = Router();

// Comportamiento de la ruta raiz de la API
routes.get('/', (req, res) => {
    res.json({msg: 'Welcome to Blood Donors API'});
});

module.exports = routes;