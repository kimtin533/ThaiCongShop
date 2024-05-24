const express = require('express')
const router = express.Router()
const roleMiddleware = require('../app/middleware/role')
const cartController = require ('../app/controller/user/CartController')


router.get('/', cartController.index )
router.post('/order', cartController.order )
router.post('/:id/addToCart', roleMiddleware(1), cartController.addToCart )
router.get('/:id/removeFromCart', roleMiddleware(1), cartController.removeFromCart )
router.get('/outofstock', cartController.outofstock )
router.get('/done', cartController.done )
module.exports = router
