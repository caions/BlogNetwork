const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Post = require('../db/posts')
const Usuario = require('../db/usuario')
const bcrypt = require('bcryptjs')

//config bodyparser
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//static
router.use(express.static('public'));
router.use(express.static('node_modules'))
router.use('/postagem', express.static('node_modules'));
router.use('/postagem', express.static('public'));


// home
router.get('/', (req, res) =>
    Post.findAll().then((posts) => res.render('pages/home', { posts: posts }))
)

router.get('/postagem/:id', (req, res) =>
    Post.findOne({
        where: {
            id: req.params.id
        }
    }).then((postagem) => {
        if (postagem) {
            res.render('pages/postagem', { postagem: postagem })
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

        Usuario.findOne({
            where: {
                email: req.body.email
            }
        }).then((usuario) => {
            if (usuario) {
                req.flash('error_msg', 'Já existe uma conta com esse email em nosso sistema')
                res.redirect('/registro')
            } else {

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash('error_msg', 'Houve um erro durante o salvamento do usuario')
                            res.redirect('/registro')
                        }

                        novoUsuario.senha = hash
                        Usuario.create({
                            nome: novoUsuario.nome,
                            email: novoUsuario.email,
                            senha: novoUsuario.senha
                        }).then(() => {
                            req.flash('success_msg', 'Usuario criado com sucesso!')
                            res.redirect('/')
                        }).catch((erro) => {
                            console.log(erro)
                            req.flash('error_msg', 'Houve um erro ao criar o usuario, tente novamente')
                            res.redirect('/registro')
                        })
                    })
                })

            }
        }).catch((erro) => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/registro')
        })

    }
})

module.exports = router 