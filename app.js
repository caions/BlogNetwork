// modulos
const express = require('express')
const app = require('./server/server')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const Post = require('./db/posts')
const session = require('express-session')
const flash = require('connect-flash')

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

//estatic
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/public', express.static(__dirname + '/public'));
//bodyparser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// ROTAS
//rotas get
// home
app.get('/', (req, res) =>
    Post.findAll().then((posts) => res.render('pages/home', { posts: posts }))
)
//formulario posts
app.get('/post', (req, res) => res.render('pages/formPost'))


//rotas post

//create post
app.post('/add', (req, res) => {
    var erros = []

    if (!req.body.titulo || req.body.titulo == undefined || req.body.titulo == null) {
        erros.push({ texto: "Titulo Invalido" })
    }

    if (!req.body.texto || req.body.texto == undefined || req.body.texto == null) {
        erros.push({ texto: "Texto Invalido" })
    }

    if (req.body.titulo.length < 2) {
        erros.push({ texto: "Titulo muito curto" })
    }

    if (req.body.texto.length < 10) {
        erros.push({ texto: "Texto muito curto" })
    }

    if (erros.length > 0) {
        res.render('pages/formPost', { erros: erros })
    } else {
        Post.create({
            titulo: req.body.titulo,
            texto: req.body.texto,
            imagem: req.body.imagem        
        }).then(() => {
            req.flash("success_msg", "Post criado com sucesso")
            res.redirect('/')
            console.log('Post criado com sucesso'
            )
        }).catch((erro) => {
            req.flash("error_msg", "Falha ao criar o Post")
            res.redirect('home/posts')
            console.log('Falha ao criar o post' + erro)
        }
        )
    }
}

)

// delete post
app.get('/delete/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        req.flash('success_msg', 'Post deletado com sucesso!')
        res.redirect('/'),
            console.log("Done");
    }).catch((erro) => {
        req.flash('error_msg', 'Falha ao excluir o post, tente novamente!')
        res.send('Erro' + erro);
    })

})

