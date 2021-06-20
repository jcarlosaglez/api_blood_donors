const router = require('express').Router();

// Comportamiento de la ruta raiz de la API
router.get('/', (req, res) => {
    res.json({
        success: true,
        msg: 'Welcome to Blood Donors API'
    });
});

router.use('/donor', require('./Donor.js'));
router.use('/receiver', require('./Receiver.js'));
router.use('/request', require('./Request.js'));

module.exports = router;