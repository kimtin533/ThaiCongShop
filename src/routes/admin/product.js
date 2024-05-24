const express = require('express')
const router = express.Router()

const productController = require ('../../app/controller/admin/ProductController')
const upload = require('../../app/middleware/upload')
router.get('/create', productController.create )
router.post('/store',upload.single('image') ,productController.store )
router.get('/:id/edit', productController.edit )
router.put('/:id', upload.single('image'), productController.update )
router.delete('/:id', productController.delete )
router.get('/trash', productController.trash )
router.patch('/:id/restore', productController.restore )
router.get('/:slug', productController.show )


module.exports = router
