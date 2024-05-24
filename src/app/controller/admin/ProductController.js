const Product = require('../../models/Product')
const Category = require('../../models/Category')
const { mutipleMongooseObToject, mongooseToObject } = require('../../../util/mongoose')
const path = require('path')
class ProductController {

    show(req, res, next) {
        Product.findOne({ slug: req.params.slug }).then((product) => {
            res.render('admin/home', {
                product: mongooseToObject(product),
                layout: 'AdminMain'
            })
        }).catch(next)

    }

    create(req, res, next) {
        Category.find().exec()
            .then(categories => {
                res.render('admin/product/create', {
                    layout: 'AdminMain',
                    categories: mutipleMongooseObToject(categories)
                });
            })
            .catch(err => {
                console.error(err);
                next(err);
            });
    }


    store(req, res, next) {
        if (req.file) {
            req.body.image = path.basename(req.file.path)

        }
        let price = req.body.price; // Lấy giá trị của trường "price" từ req.body

        // Kiểm tra xem giá trị của trường "price" có chứa dấu phẩy không, nếu có thì loại bỏ
        if (price.includes(',')) {
            price = parseFloat(price.replace(/,/g, ''));
        } else {
            price = parseFloat(price);
        }
    
        // Tạo đối tượng sản phẩm mới với giá trị "price" đã được chuyển đổi thành số
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: price,
            amount: req.body.amount,
            image: req.body.image
            // Thêm các trường khác nếu cần
        });
        product.save()
            .then(() => res.redirect('/admin'))


    }




    edit(req, res, next) {
        Promise.all([Product.findById(req.params.id),Category.find().exec()])
            .then(([product, categories]) => res.render('admin/product/edit', {
                categories: mutipleMongooseObToject(categories),
                product: mongooseToObject(product),
                layout: 'AdminMain'
            }))
            .catch(next)
        

    }

    update(req, res, next) {
        const updateData = {};
        if (req.file) {
            req.body.image = path.basename(req.file.path);
            
        }
        // Thêm các trường khác cần cập nhật
        updateData.name = req.body.name;
        updateData.image = req.body.image;
        updateData.description = req.body.description;
        updateData.category = req.body.category;
        let price = req.body.price;
        if (price.includes(',')) {
            price = parseFloat(price.replace(/,/g, ''));
        } else {
            price = parseFloat(price);
        }
        updateData.price = price;
        updateData.amount = req.body.amount;
        Product.updateOne({ _id: req.params.id }, updateData)
            .then(() => res.redirect('/admin'))
            .catch(next);
    }
    
    delete(req, res, next) {
        // Product.deleteOne({_id: req.params.id}, req.body)
        //     .then(() => res.redirect('/admin'))
        //     .catch(next)
        Product.delete({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/admin'))
            .catch(next)
    }

    trash(req, res, next) {
        Product.findWithDeleted({ deleted: true })
            .then(products => {
                res.render('admin/product/trash', {
                    products: mutipleMongooseObToject(products),
                    layout: 'AdminMain'

                }
                )
            })
            .catch(next)
    }
    restore(req, res, next) {
        Product.restore({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/admin'))
            .catch(next)
    }
}

module.exports = new ProductController