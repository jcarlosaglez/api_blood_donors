const router = require('express').Router();
const {
    d_create,
    d_readOne,
    d_readAll,
    d_update,
    d_delete,
    d_login,
    d_search
} = require('../controllers/Donor.js');

router.post('/', d_create);
router.get('/:id', d_readOne);
router.get('/', d_readAll);
router.put('/:id', d_update);
router.delete('/:id', d_delete);
router.post('/login', d_login);
router.get('/search', d_search);

module.exports = router;