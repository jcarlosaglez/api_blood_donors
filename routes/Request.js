const router = require('express').Router();
const {
    r_create,
    r_readOne,
    r_readAll,
    r_update,
    r_delete,
    r_search
} = require('../controllers/Request.js');

router.post('/', r_create);
router.get('/:id', r_readOne);
router.get('/', r_readAll);
router.put('/:id', r_update);
router.delete('/:id', r_delete);
router.get('/search', r_search);

module.exports = router;