module.exports = function setUserName(req, res, next) {
    if (req.session.user) {
        // Nếu đã đăng nhập, lấy tên người dùng từ session
        const userName = req.session.user.display_name;
        const islogin = req.session.islogin
        // Truyền tên người dùng vào biến locals để có thể sử dụng trong các views
        res.locals.userName = userName;
        res.locals.islogin = userName;
    }
    else{
        res.locals.userName='Khách'
    }
    // Tiếp tục thực hiện các middleware hoặc điều khiển tiếp theo
    next();
}