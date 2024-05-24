const Product = require('../../models/Product')
const Category = require('../../models/Category')
const User = require('../../models/User')
const { mutipleMongooseObToject } = require('../../../util/mongoose')
class SiteController {


    // index(req, res, next) {
    //     const { search } = req.query; // Lấy từ khóa tìm kiếm từ query string

    //     // Tạo điều kiện tìm kiếm sản phẩm: tìm kiếm theo tên sản phẩm chứa từ khóa search
    //     const productSearchCondition = search ? { name: { $regex: search, $options: 'i' } } : {};

    //     // Promise.all để đợi cả 2 truy vấn hoàn thành
    //     Promise.all([
    //         Product.find(productSearchCondition), // Truy vấn sản phẩm với điều kiện tìm kiếm nếu có
    //         Category.find({}) // Truy vấn tất cả danh mục
    //     ])
    //         .then(([products, categories]) => {
    //             // Trả về danh sách sản phẩm và danh mục vào template
    //             res.render('home', {
    //                 products: mutipleMongooseObToject(products),
    //                 categories: mutipleMongooseObToject(categories),
    //                 searchKeyword: search // Truyền từ khóa tìm kiếm vào template để hiển thị lại trong ô tìm kiếm
    //             });
    //         })
    //         .catch(err => {
    //             // Xử lý lỗi nếu có
    //             console.error(err);
    //             next(err);
    //         });
    // }


    index(req, res, next) {
        const ITEMS_PER_PAGE = 10; // Số lượng sản phẩm hiển thị trên mỗi trang
        const { search, page } = req.query; // Lấy từ khóa tìm kiếm và trang từ query string

        // Tạo điều kiện tìm kiếm sản phẩm: tìm kiếm theo tên sản phẩm chứa từ khóa search
        const productSearchCondition = search ? { name: { $regex: search, $options: 'i' } } : {};

        // Tính toán chỉ số bắt đầu của sản phẩm trên trang hiện tại
        const currentPage = +page || 1; // Chuyển đổi page thành số, mặc định là 1 nếu không có page
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

        // Promise.all để đợi cả 2 truy vấn hoàn thành
        Promise.all([
            Product.find(productSearchCondition) // Truy vấn sản phẩm với điều kiện tìm kiếm nếu có
                .skip(startIndex) // Bỏ qua số lượng sản phẩm không cần thiết (trang trước đó)
                .limit(ITEMS_PER_PAGE), // Giới hạn số lượng sản phẩm trên trang
            Product.countDocuments(productSearchCondition), // Đếm tổng số sản phẩm (cho phân trang)
            Category.find({}) // Truy vấn tất cả danh mục
        ])
            .then(([products, totalProducts, categories]) => {
                // Tính toán tổng số trang dựa trên tổng số sản phẩm và số lượng sản phẩm trên mỗi trang
                const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

                // Trả về danh sách sản phẩm, danh mục, số trang và từ khóa tìm kiếm vào template
                res.render('home', {
                    products: mutipleMongooseObToject(products),
                    categories: mutipleMongooseObToject(categories),
                    currentPage,
                    totalPages,
                    searchKeyword: search, // Truyền từ khóa tìm kiếm vào template để hiển thị lại trong ô tìm kiếm
                    pages: Array.from({ length: totalPages }, (_, index) => index + 1)
                });
            })
            .catch(err => {
                // Xử lý lỗi nếu có
                console.error(err);
                next(err);
            });
    }




    signup(req, res, next) {
        const { username } = req.body;
        User.findOne({ username: username })
            .then(existingUser => {
                if (existingUser) {
                    res.status(400).send('Tên đăng nhập đã tồn tại');
                } else {
                    const user = new User(req.body);
                    user.save();
                    res.redirect('/');
                }
            })
            .catch(err => {
                // Xử lý bất kỳ lỗi nào khác có thể xảy ra trong quá trình tạo tài khoản
                console.error(err);
                res.status(500).send('Đã xảy ra lỗi khi tạo tài khoản.');
            });
    }
    login(req, res, next) {
        const { username, password } = req.body;
        User.findOne({ username: username, password: password })
            .then(user => {
                if (!user) {
                    res.status(401).send('Tên đăng nhập hoặc mật khẩu không đúng');
                } else {
                    // Lưu thông tin người dùng vào session
                    req.session.user = user;
                    req.session.login = true
                    res.redirect('/'); // Hoặc chuyển hướng đến trang khác tùy ý
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Đã xảy ra lỗi khi đăng nhập.');
            });
    }

    logout(req, res, next) {
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).send('Đã xảy ra lỗi khi đăng xuất.');
            } else {
                res.redirect('/'); // Hoặc chuyển hướng đến trang khác tùy ý sau khi đăng xuất thành công
            }
        });
    }

}

module.exports = new SiteController