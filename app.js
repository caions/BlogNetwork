// modulos
const express = require('express')
const app = require('./server/server')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const user = require('./routes/user')
const admin = require('./routes/admin')

//config
//session
app.use(session({
    secret: "blogSession",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//midlewares
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
}
)

//rotas
app.use('/',user)
app.use('/admin',admin)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');