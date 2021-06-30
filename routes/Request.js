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

router.post('/', [auth.required, is_receiver], createRequest);
router.get('/search', auth.required, search);
router.get('/:id', auth.required, readOneRequest);
router.get('/', auth.required, readAllRequests);
router.patch('/:id', [auth.required, is_donor], updateRequest);
router.delete('/:id', [auth.required, is_receiver], deleteRequest);

module.exports = router;