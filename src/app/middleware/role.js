module.exports = function requireRole(role) {
    return function(req, res, next) {
        if (req.session.user && req.session.user.role === role) {
            // Nếu người dùng đã đăng nhập và có vai trò phù hợp, tiếp tục
            next();
        } else {
            // Nếu không, chuyển hướng đến trang đăng nhập hoặc trang không có quyền truy cập
            res.redirect('/');
        }
    };
}   