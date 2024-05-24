const express = require('express')
const router = express.Router()

const siteController = require ('../app/controller/user/SiteController')


router.get('/', siteController.index )
router.post('/signup', siteController.signup )
router.post('/login', siteController.login )
router.get('/logout', siteController.logout )

module.exports = router
