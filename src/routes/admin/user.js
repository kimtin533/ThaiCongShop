const express = require('express');
const router = express.Router();


const UserController = require('../../app/controller/admin/UserController');

router.get('/create', UserController.create);
router.post('/store', UserController.store )
router.get('/:id/edit', UserController.edit);
router.delete('/:id', UserController.delete )
router.put('/:id', UserController.update )
router.get('/', UserController.index);

module.exports = router;
