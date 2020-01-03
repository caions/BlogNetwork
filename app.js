// modulos
const app = require('./server/server')
const handlebars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const user = require('./routes/user')
const admin = require('./routes/admin')
const upload = require('./routes/upload')
const multer = require('multer')
const path = require('path')
const Post = require('./db/posts')

//config
//session
app.use(session({
    secret: "blogSession",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//midllewares
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
}
)

//rotas
app.use('/',user)
app.use('/admin',admin)
app.use('/upload',upload)

//handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');