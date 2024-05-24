const User = require('../../models/User')

const { mutipleMongooseObToject, mongooseToObject } = require('../../../util/mongoose')
class SiteController {
    index(req, res, next) {
        Promise.all([User.find({}), User.countDocumentsWithDeleted({ deleted: true })])
            .then(([users, detetedCount]) => res.render('admin/user', {
                detetedCount,
                users: mutipleMongooseObToject(users),
                layout: 'AdminMain'
            }
            ))
            .catch(next)

    }
    create(req, res, next) {
        res.render('admin/user/create', {
            layout: 'AdminMain'
        })
    }


    store(req, res, next) {
        const { username } = req.body;
        User.findOne({ username: username })
            .then(existingUser => {
                if (existingUser) {
                    res.status(400).send('Tên đăng nhập đã tồn tại');
                } else {
                    const user = new User(req.body);
                    user.save();
                    res.redirect('/admin/users');
                }
            })
            .catch(err => {
                // Xử lý bất kỳ lỗi nào khác có thể xảy ra trong quá trình tạo tài khoản
                console.error(err);
                res.status(500).send('Đã xảy ra lỗi khi tạo tài khoản.');
            });
    }

    edit(req, res, next) {
        User.findById(req.params.id)
            .then(user => res.render('admin/user/edit', {
                user: mongooseToObject(user),
                layout: 'AdminMain'
            }))
            .catch(next)

    }
    update(req, res, next) {
        User.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/admin/users'))
            .catch(next)
    }

    delete(req, res, next) {
        User.findOne({ _id: req.params.id })
            .then(user => {
                if (user && user.admin === true) {
                    res.redirect('/admin/users')
                } else {
                    // Nếu người dùng không phải là admin, tiến hành xóa
                    User.deleteOne({ _id: req.params.id });
                    res.redirect('/admin/users')
                }
            })
            .catch(next);
    }




}

module.exports = new SiteController