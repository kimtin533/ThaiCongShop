const Product = require('../../models/Product')
const Cart = require('../../models/Cart');
const { mutipleMongooseObToject, mongooseToObject } = require('../../../util/mongoose')
class ProductController {

    show(req, res, next) {
        Product.findOne({ slug: req.params.slug }).then((product) => {
            res.render('product/show', {
                product: mongooseToObject(product)
            })
        }).catch(next)

    }




    
}

module.exports = new ProductController