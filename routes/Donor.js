const router = require('express').Router();
const storage = require('../config/multer.js');
const auth = require('./auth.js');
const is_donor = require('../middlewares/is_donor.js')
const {
    createDonor,
    readOneDonor,
    readAllDonors,
    updateDonor,
    deleteDonor,
    login,
    search,
    changeCertifiedFile,
    me
} = require('../controllers/Donor.js');

router.post('/login', login);
router.post('/', storage.single('certified_file'), createDonor, (error, req, res, next) => {
    if(error.code === 'LIMIT_FILE_SIZE') {
        error.message = 'El archivo a subir supera el limite de 1MB.';
    }

    return res.status(400).json({
        success: false,
        msg: 'Algunos campos presentan un error de validación.',
        data: {'certified_file': error.message}
    });
});
router.get('/me', [auth.required, is_donor], me, (error, req, res, next) => {
    if(error.name === 'UnauthorizedError') {
        return res.status(400).json({
            success: false,
            msg: 'Error de autorización.',
            data: {'code': error.code, 'message': error.message}
        });
    }
});
router.get('/search', search);
router.get('/:id', readOneDonor);
router.get('/',     readAllDonors);
router.patch('/:id/change_certified_file', [auth.required, is_donor, storage.single('certified_file')], changeCertifiedFile, (error, req, res, next) => {
    if(error.name === 'UnauthorizedError') {
        return res.status(400).json({
            success: false,
            msg: 'Error de autorización.',
            data: {'code': error.code, 'message': error.message}
        });
    }
    
    if(error.code === 'LIMIT_FILE_SIZE') {
        error.message = 'El archivo a subir supera el limite de 1MB.';
    }

    return res.status(400).json({
        success: false,
        msg: 'Algunos campos presentan un error de validación.',
        data: {'certified_file': error.message}
    });
});
router.patch('/', [auth.required, is_donor], updateDonor, (error, req, res, next) => {
    if(error.name === 'UnauthorizedError') {
        return res.status(400).json({
            success: false,
            msg: 'Error de autorización.',
            data: {'code': error.code, 'message': error.message}
        });
    }
});
router.delete('/', [auth.required, is_donor], deleteDonor, (error, req, res, next) => {
    if(error.name === 'UnauthorizedError') {
        return res.status(400).json({
            success: false,
            msg: 'Error de autorización.',
            data: {'code': error.code, 'message': error.message}
        });
    }
});

module.exports = router;