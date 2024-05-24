const express = require('express');
const router = express.Router();
const OrderController = require('../../app/controller/admin/OrderController');



// router.get('/create', OrderController.create);
// router.post('/store', OrderController.store )
// router.get('/:id/edit', OrderController.edit);
// router.delete('/:id', OrderController.delete )
router.get('/:id', OrderController.show )
router.delete('/:id', OrderController.delete )
router.get('/', OrderController.index);
router.get('/:id/comfirm', OrderController.comfirm);

module.exports = router;
