const Product = require('../../models/Product')
const Category = require('../../models/Category')
const User = require('../../models/User')
const Cart = require('../../models/Cart')
const Order = require('../../models/Order')
const GeneralOrder = require('../../models/GeneralOrder')
const { mutipleMongooseObToject } = require('../../../util/mongoose')
class CartController {
    addToCart(req, res, next) {
        const productId = req.params.id; // Lấy id sản phẩm từ request URL 
        const amount = parseInt(req.body.amount); // Chuyển đổi amount thành số nguyên
        const userId = req.session.user._id
        // Kiểm tra nếu amount không phải là một số hợp lệ
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).send('Số lượng không hợp lệ');
        }

        // Tìm kiếm sản phẩm trong giỏ hàng
        Cart.findOne({ product: productId })
            .then(cartItem => {
                if (cartItem) {
                    // Nếu sản phẩm đã tồn tại trong giỏ hàng
                    // if (cartItem.amount + amount > 20) {
                    //     // Kiểm tra nếu số lượng vượt quá 20
                    //     return res.redirect('/cart/outofstock');
                    // }
                    // Nếu không vượt quá 20, tăng số lượng lên
                    cartItem.amount += amount;
                    // Lưu thay đổi vào cơ sở dữ liệu
                    return cartItem.save();
                } else {
                    // Nếu sản phẩm chưa tồn tại trong giỏ hàng, tạo một đối tượng mới
                    const cartItem = new Cart({
                        product: productId,
                        amount: amount,
                        user: userId
                    });

                    // Lưu đối tượng cart vào cơ sở dữ liệu

                    return cartItem.save();
                }
            })
            .then(() => {
                // Nếu lưu thành công, chuyển hướng hoặc trả về thông báo tùy ý
                res.redirect('/cart'); // Ví dụ: chuyển hướng đến trang giỏ hàng
            })
            .catch(err => {
                // Xử lý lỗi nếu có
                console.error(err);
                next(err);
            });
    }


    outofstock(req, res, next) {
        res.render('cart/outOfStock')
    }
    done(req, res, next) {
        res.render('cart/done')
    }



    // Hàm điều khiển để lấy thông tin sản phẩm và số lượng trong giỏ hàng
    index(req, res, next) {
        // Lấy thông tin sản phẩm và số lượng trong giỏ hàng từ cơ sở dữ liệu
        Cart.find({ user: req.session.user._id })
            .populate('product', 'name image price _id') // Sử dụng populate để lấy thông tin sản phẩm
            .then(cartItems => {
                // Xử lý dữ liệu trả về để trả về thông tin cần thiết cho giao diện
                const cartInfo = cartItems.map(item => ({
                    name: item.product.name,
                    image: item.product.image,
                    price: item.product.price,
                    _id: item.product._id,
                    amount: item.amount
                }));

                // Render ra trang giỏ hàng và truyền cartInfo vào template
                // res.json(cartInfo)
                res.render('cart/index', { cartInfo });
            })
            .catch(err => {
                // Xử lý lỗi nếu có
                console.error(err);
                next(err);
            });
    }

    // order(req, res, next) {
    //     Cart.find({ user: req.session.user._id })
    //         .populate('product')
    //         .then(cartItems => {
    //             const orderItems = cartItems.map(item => ({
    //                 product: item.product,
    //                 user: req.session.user._id,
    //                 amount: item.amount,
    //             }));

    //             const outOfStockProducts = [];
    //             const promises = orderItems.map(orderItem => {
    //                 if (orderItem.product.amount < orderItem.amount) {
    //                     outOfStockProducts.push(orderItem.product.name);
    //                     return res.redirect('/cart/outOfStock');
    //                 } else {
    //                     return Product.findByIdAndUpdate(orderItem.product._id, { $inc: { amount: -orderItem.amount } });
    //                 }
    //             });

    //             return Promise.all(promises).then(() => {
    //                 return { orderItems, outOfStockProducts };
    //             });
    //         })
    //         .then(({ orderItems, outOfStockProducts }) => {
    //             if (outOfStockProducts.length > 0) {
    //                 return res.redirect('/outofstock');
    //             } else {
    //                 // Tạo các bản ghi Order và lưu thông tin đặt hàng vào cơ sở dữ liệu
    //                 return Order.create(orderItems).then(orders => {
    //                     // Lấy ra các id của các đơn hàng vừa tạo
    //                     const orderIds = orders.map(order => order._id);
    //                     // Tạo một bản ghi GeneralOrder với danh sách các đơn hàng đã tạo
    //                     return GeneralOrder.create({
    //                         order: orderIds,
    //                         user: req.session.user._id,
    //                         phone: req.body.phone,
    //                         name: req.body.name,
    //                         address: req.body.address,
    //                         price: req.body.totalprice
    //                     });
    //                 });
    //             }
    //         })
    //         .then(() => {
    //             return Cart.deleteMany({ user: req.session.user._id });
    //         })
    //         .then(() => {
    //             res.redirect('/order-success');
    //         })
    //         .catch(err => {
    //             console.error(err);
    //             next(err);
    //         });
    // }

    order(req, res, next) {
        Cart.find({ user: req.session.user._id })
            .populate('product')
            .then(cartItems => {
                const orderItems = cartItems.map(item => ({
                    product: item.product,
                    amount: item.amount,
                }));
    
                const outOfStockProducts = [];
                const promises = orderItems.map(orderItem => {
                    if (orderItem.product.amount < orderItem.amount) {
                        outOfStockProducts.push(orderItem.product.name);
                        return res.redirect('/cart/outOfStock');
                    } else {
                        return Product.findByIdAndUpdate(orderItem.product._id, { $inc: { amount: -orderItem.amount } });
                    }
                });
    
                return Promise.all(promises).then(() => {
                    return { orderItems, outOfStockProducts };
                });
            })
            .then(({ orderItems, outOfStockProducts }) => {
                if (outOfStockProducts.length > 0) {
                    return res.redirect('/outofstock');
                } else {
                    // Tạo các bản ghi Order và lưu thông tin đặt hàng vào cơ sở dữ liệu
                    return Order.create(orderItems).then(orders => {
                        // Lấy ra các id của các đơn hàng vừa tạo
                        const orderIds = orders.map(order => order._id);
                        // Tạo một bản ghi GeneralOrder với thông tin từ các bản ghi Order vừa tạo
                        return GeneralOrder.create({
                            order: orderIds,
                            user: req.session.user._id,
                            phone: req.body.phone,
                            name: req.body.name,
                            address: req.body.address,
                            price: req.body.totalprice
                        }).then(generalOrder => {
                            // Gắn trường generalOrder của mỗi Order với id của GeneralOrder tương ứng
                            const updateOrderPromises = orders.map(order =>
                                Order.findByIdAndUpdate(order._id, { generalOrder: generalOrder._id })
                            );
                            return Promise.all(updateOrderPromises);
                        });
                    });
                }
            })
            .then(() => {
                return Cart.deleteMany({ user: req.session.user._id });
            })
            .then(() => {
                res.redirect('/cart/done');
            })
            .catch(err => {
                console.error(err);
                next(err);
            });
    }
    
    

    


    removeFromCart(req, res, next) {
        const itemId = req.params.id;
        const userId = req.session.user._id; // Lấy id của người dùng từ session

        // Tìm và xóa sản phẩm khỏi giỏ hàng dựa trên itemId và userId
        Cart.findOneAndDelete({ product: itemId, user: userId })
            .then(() => {

                res.redirect('/cart'); // Chuyển hướng trở lại trang giỏ hàng sau khi xóa thành công
            })
            .catch(err => {
                console.error(err);
                next(err);
            });
    }


}

module.exports = new CartController