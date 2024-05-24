const siteRouter = require('./site')
const adminRouter = require('./admin/site')
const productRouter = require('./products')
const cartRouter = require('./cart')
const roleMiddleware = require('../app/middleware/role')
const setname = require('../app/middleware/setname')


function route(app){

    app.use('/admin',roleMiddleware(0),setname, adminRouter)
    // app.use('/admin', adminRouter)
    app.use('/',setname ,siteRouter)
    app.use('/product',setname, productRouter)
    app.use('/cart',setname, roleMiddleware(1), cartRouter)

}

module.exports = route
