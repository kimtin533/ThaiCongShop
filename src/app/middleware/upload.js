const path = require('path')
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads'))
        a = path.join(__dirname, '../../public/uploads')
        console.log(a)
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        const name= Date.now() + ext
        cb(null, name)
    }
})
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"

        ) {
            callback(null, true)
        } else {
            console.log('only jpg & png file supported!')
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 20

    }
})
module.exports = upload