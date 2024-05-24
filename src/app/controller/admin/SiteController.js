const Product = require('../../models/Product')

const {mutipleMongooseObToject} = require('../../../util/mongoose')
class SiteController {
    index(req, res, next) {
        Promise.all([Product.find({}), Product.countDocumentsWithDeleted({deleted: true})])
            .then(([products, detetedCount])=>res.render('admin/home', {
                detetedCount,
                products : mutipleMongooseObToject(products),
                layout: 'AdminMain' 
                }
                ))
            .catch(next)
        
    }


}

module.exports = new SiteController