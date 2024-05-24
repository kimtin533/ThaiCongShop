const express = require('express')
const router = express.Router()
const productRoute = require('./product')
const userRoute = require('./user')
const orderRoute = require('./order')
const siteController = require ('../../app/controller/admin/SiteController')

// router.get('/create', siteController.create )
// router.post('/store', siteController.store )
router.use('/products', productRoute )
router.use('/users', userRoute )
router.use('/orders', orderRoute )
router.get('/', siteController.index )


module.exports = router
