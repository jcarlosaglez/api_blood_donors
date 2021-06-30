const router = require('express').Router();
const auth = require('./auth.js');
const is_receiver = require('../middlewares/is_receiver.js');
const is_donor = require('../middlewares/is_donor.js');
const {
    createRequest,
    readOneRequest,
    readAllRequests,
    updateRequest,
    deleteRequest,
    search
} = require('../controllers/Request.js');

router.post('/', [auth.required, is_receiver], createRequest, (error, req, res, next) => {
    if(error.name === 'UnauthorizedError') {
        return res.status(400).json({
            success: false,
            msg: 'Error de autorización.',
            data: {'code': error.code, 'message': error.message}
        });
    }
});
router.get('/search', auth.required, search, (error, req, res, next) => {
    if(error.name === 'UnauthorizedError') {
        return res.status(400).json({
            success: false,
            msg: 'Error de autorización.',
            data: {'code': error.code, 'message': error.message}
        });
    }
});
router.get('/:id', auth.required, readOneRequest, (error, req, res, next) => {
    if(error.name === 'UnauthorizedError') {
        return res.status(400).json({
            success: false,
            msg: 'Error de autorización.',
            data: {'code': error.code, 'message': error.message}
        });
    }
});
router.get('/', auth.required, readAllRequests, (error, req, res, next) => {
    if(error.name === 'UnauthorizedError') {
        return res.status(400).json({
            success: false,
            msg: 'Error de autorización.',
            data: {'code': error.code, 'message': error.message}
        });
    }
});
router.patch('/:id', [auth.required, is_donor], updateRequest, (error, req, res, next) => {
    if(error.name === 'UnauthorizedError') {
        return res.status(400).json({
            success: false,
            msg: 'Error de autorización.',
            data: {'code': error.code, 'message': error.message}
        });
    }
});
router.delete('/:id', [auth.required, is_receiver], deleteRequest, (error, req, res, next) => {
    if(error.name === 'UnauthorizedError') {
        return res.status(400).json({
            success: false,
            msg: 'Error de autorización.',
            data: {'code': error.code, 'message': error.message}
        });
    }
});

module.exports = router;