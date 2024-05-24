const Product = require('../../models/Product')
const Category = require('../../models/Category')
const User = require('../../models/User')
const Order = require('../../models/Order')
const GeneralOrder = require('../../models/GeneralOrder')
const { mutipleMongooseObToject, mongooseToObject } = require('../../../util/mongoose')
const path = require('path')
class OrderController {

    index(req, res, next) {
        GeneralOrder.find({})
            .populate('user', 'username') // Tham chiếu tới trường "username" của người dùng
            .exec()
            .then(generalOrders => {
                const formattedOrders = generalOrders.map(general => {
                    return {
                        generalId: general._id, // Id của general order
                        name: general.name, // Tên người nhận hàng
                        phone: general.phone, // Số điện thoại người nhận hàng
                        address: general.address, // Địa chỉ người nhận hàng
                        price: general.price, // Tổng giá đơn hàng
                        user: general.user.username, // Tên người đặt hàng
                        date: general.createdAt, // Tên người đặt hàng
                        status: general.status, // Tên người đặt hàng
                        
                    };
                });
                res.render('admin/order', {
                    orders: formattedOrders,
                    layout: 'AdminMain'
                });
            })
            .catch(next);
    }
    show(req, res, next) {
        const generalOrderId = req.params.id;
        GeneralOrder.findById(generalOrderId)
            .populate({
                path: 'order',
                populate: {
                    path: 'product',
                    select: 'image name amount'
                }
            })
            .exec()
            .then(generalOrder => {
                if (!generalOrder) {
                    return res.status(404).send('General order not found');
                }

                const orders = generalOrder.order.map(order => {
                    return {
                        image: order.product.image,
                        name: order.product.name,
                        amount: order.amount,
                        orderId: generalOrderId,
                    
                    };
                });

                res.render('admin/order/show', {
                    orders,
                    layout: 'AdminMain'
                });
            })
            .catch(next);
    }
    delete(req, res, next) {
        GeneralOrder.delete({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/admin/orders'))
            .catch(next)
    }
    comfirm (req, res, next) {
        
        // Lấy id từ URL
        const id = req.params.id;
        const status = 1
        // Cập nhật trường Status của GeneralOrder có id là 1
        GeneralOrder.updateOne({ _id: id }, {
            status: status
        })
        .then(() => {
            res.redirect('/admin/orders'); // Chuyển hướng sau khi cập nhật thành công
        })
        .catch(next);
        
    
}

}

module.exports = new OrderController