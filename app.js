require('dotenv').config()

// modulos
const express = require('express')
const app = require('./server/server')
const hbs = require('express-hbs')
const session = require('express-session')
const flash = require('connect-flash')
const user = require('./routes/user')
const admin = require('./routes/admin')
const passport = require('passport')
const path = require('path')
require('./config/auth')(passport)

//config
//session
app.use(session({
    secret: "blogSession",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(express.json())
app.use(require('./routes/admin'))
app.use(express.urlencoded({ extended: true }))
app.use('/files', express.static(path.resolve(__dirname, '../tmp/uploads')))

//midllewares
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
}
)

//rotas
app.use('/', user)
app.use('/admin', admin)
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/css/error404.html'));
})
//hbs
//app.engine('hbs', hbs({ defaultLayout: 'main' }));
app.set('view engine', 'hbs');

// configure the view engine 
app.set('views', path.join(__dirname,'/views'));

app.engine('hbs', hbs.express4({  
    defaultLayout: __dirname + '/views/layouts/main.hbs',
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
  }));