require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan')
const app = express();
const hbs= require('express-handlebars');
const port = 8088;
const route = require('./routes')
const db = require('./config/db')
const mongoose = require('mongoose');
var methodOverride = require('method-override')
const session = require('express-session');

db.connect()


// app.use(morgan('combined'))
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname , 'public')))
console.log(path.join(__dirname , 'public'))
// app.engine('hbs', hbs.engine({
//     extname:'hbs',
//     helpers:{
//         sum: (a,b)=> a + b
//     }
// }))
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main', 
    layoutsDir: path.join(__dirname, '/resources/views/layouts'), 
    partialsDir: path.join(__dirname, '/resources/views/partials'), 
    helpers: {
        sum: (a, b) => a + b,
        role: (role)=> {
            if(role===0)
                return 'Quản trị viên'
            else return 'Thành viên'
        },
        status:(status)=> {
            if(status===0)
                return 'Chưa xác nhận'
            else return 'Đã xác nhận'
            
        }
    }
}));

//session
app.use(session({
    secret: 'secret_key', // Chuỗi bí mật để ký và mã hóa session ID
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/resources/views'));

// route
route(app)

app.listen(port, () => {
    console.log(`Server is running at: http://localhost:${port}`);
});


