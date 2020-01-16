const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Model = require('../db/index')
const bcrypt = require('bcryptjs')
const passport = require('passport')

//config bodyparser
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//static
router.use(express.static('public'));
router.use(express.static('tmp'));
router.use(express.static('node_modules'))
router.use('/postagem', express.static('node_modules'));
router.use('/postagem', express.static('public'));

router.get('/', (req, res) => {
    Model.Upload.findAll({
        attributes: ['url'],
        include: [{
            model: Model.Post,
            required: true
            , attributes: ['id', 'titulo', 'descricao'],
        }]
    }).then(posts => {
        res.render('pages/home', { posts: posts })
    });
})


router.get('/postagem/:id', (req, res) =>
    Model.Upload.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'url'],
        include: [{
            model: Model.Post,
            required: true
            , attributes: ['id', 'titulo', 'descricao'],
        }]
    }).then((posts) => {
        if (posts) {
            res.render('pages/postagem', { posts: posts })
        } else {
            req.flash("error_msg", "Esta postagem não existe")
            res.redirect('/')
        }
    }).catch((erro) => {
        res.send('Houve um erro interno' + erro)
        res.redirect('/')
    })
)

//Registro
router.get('/registro', (req, res) => {
    res.render('pages/formRegistro')
})

router.post('/registro', (req, res) => {
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: 'Nome invalido' })
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: 'Email invalido' })
    }
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: 'Senha invalida' })
    }

    if (req.body.senha.length < 4) {
        erros.push({ texto: 'A senha deve ter pelo menos 4 caracteres' })
    }

    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: 'As senhas são diferentes' })
    }

    if (erros.length > 0) {
        res.render('pages/formRegistro', { erros: erros })
    } else {

        Model.Usuario.findOne({
            where: {
                email: req.body.email
            }
        }).then((usuario) => {
            if (usuario) {
                req.flash('error_msg', 'Já existe uma conta com esse email em nosso sistema')
                res.redirect('/registro')
            } else {
                var nome = req.body.nome;
                var email = req.body.email;
                var senha = req.body.senha

                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(senha, salt);

                Model.Usuario.create({
                    nome: nome,
                    email: email,
                    senha: hash,
                }).then(() => {
                    req.flash('success_msg', 'Usuario criado com sucesso!')
                    res.redirect('/')
                }).catch((erro) => {
                    console.log(erro)
                    req.flash('error_msg', 'Houve um erro ao criar o usuario, tente novamente')
                    res.redirect('/registro')
                })

            }
        }).catch((erro) => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/registro')
        })

    }
})

//login
router.get('/login', (req, res) => {
    res.render('pages/formLogin')
})

router.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success_msg', 'Deslogado com sucesso')
    res.redirect('/')
})

module.exports = router 