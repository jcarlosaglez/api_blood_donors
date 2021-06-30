const router = require('express').Router();
const auth = require('./auth.js');
const is_receiver = require('../middlewares/is_receiver.js');
const {
    createReceiver,
    readOneReceiver,
    readAllReceivers,
    updateReceiver,
    deleteReceiver,
    login,
    search,
    me
} = require('../controllers/Receiver.js');

router.post('/login', login);
router.post('/', createReceiver);
router.get('/me', [auth.required, is_receiver], me, (error, req, res, next) => {
    if(error.name === 'UnauthorizedError') {
        return res.status(400).json({
            success: false,
            msg: 'Error de autorización.',
            data: {'code': error.code, 'message': error.message}
        });
    }
});
router.get('/search', search);
router.get('/:id', readOneReceiver);
router.get('/', readAllReceivers);
router.patch('/', [auth.required, is_receiver], updateReceiver, (error, req, res, next) => {
    if(error.name === 'UnauthorizedError') {
        return res.status(400).json({
            success: false,
            msg: 'Error de autorización.',
            data: {'code': error.code, 'message': error.message}
        });
    }
});
router.delete('/', [auth.required, is_receiver], deleteReceiver, (error, req, res, next) => {
    if(error.name === 'UnauthorizedError') {
        return res.status(400).json({
            success: false,
            msg: 'Error de autorización.',
            data: {'code': error.code, 'message': error.message}
        });
    }
});

module.exports = router;