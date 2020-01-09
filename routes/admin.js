const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const Post = require('../db/posts')
const { eAdmin } = require('../helpers/eAdmin')
const multer = require('multer')
const multerConfig = require('../config/multer')
const Upload = require('../db/upload')

//config bodyparser
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//estatic
router.use(express.static('public'));
router.use(express.static('node_modules'))
router.use('/edit', express.static('node_modules'));
router.use('/edit', express.static('public'));


//formulario cad posts
router.get('/post',  (req, res) => res.render('pages/formCadPost'))

router.post('/add',  (req, res) => {
    var erros = []

    if (!req.body.titulo || req.body.titulo == undefined || req.body.titulo == null) {
        erros.push({ texto: "Titulo Invalido" })
    }

    if (!req.body.texto || req.body.texto == undefined || req.body.texto == null) {
        erros.push({ texto: "Texto Invalido" })
    }

    if (!req.body.descricao || req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({ texto: "Descricao Invalida" })
    }

    if (req.body.titulo.length < 2) {
        erros.push({ texto: "Titulo muito curto" })
    }

    if (req.body.descricao.length < 10 || req.body.descricao.length > 200) {
        erros.push({ texto: "Descrição deve ter entre 10 a 180 caracteres" })
    }

    if (req.body.texto.length < 10) {
        erros.push({ texto: "Texto muito curto" })
    }

    if (erros.length > 0) {
        res.render('pages/formCadPost', { erros: erros })
    } else {
        Post.create({
            titulo: req.body.titulo,
            descricao: req.body.descricao,
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
router.get('/delete/:id', eAdmin, (req, res) => {
    let id = req.params.id;
    Post.findByPk(id).then(post => {
        post.destroy().then(() => {
            req.flash('success_msg', 'Post deletado com sucesso!')
            res.redirect('/'),
                console.log("Done");
        }).catch((erro) => {
            req.flash('error_msg', 'Falha ao excluir o post, tente novamente!')
            res.send('Erro' + erro);
        })
    })})

// edit post
router.get('/edit/:id',eAdmin,(req,res)=>{
    var id = req.params.id
    if(isNaN(id)){
        req.flash('error_msg','O post não existe')
        res.redirect("/");
    }else{
        Post.findByPk(id).then(post=>{
            if(post != undefined){
    
                res.render('pages/formEditPost',{post:post})
    
            }else{
                req.flash('error_msg','O post não existe')
                res.redirect('/')
            }
            }).catch((erro)=>{
                req.flash("error_msg", "Falha ao editar o Post")
                res.redirect('/')
        })
    }
})

router.post('/edit',eAdmin,(req,res)=>{
    var id = req.body.id;
    Post.update({
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        texto: req.body.texto,
        imagem: req.body.imagem
    },{
        where:{
            id: id
        }
    }).then(()=>{
        req.flash('success_msg','Post editado com sucesso')
        res.redirect('/')
    }).catch((erro)=>{
        req.flash('error_msg','Falha ao editar o post')
        res.redirect('/')
    })
})

// cadastrar imagens
router.post('/upload', multer(multerConfig).single('file'), (req, res) => {
    var erros = []

    if (!req.file || req.file == undefined || req.file == null) {
        erros.push({ texto: "Selecione uma imagem" })
    }

    if (erros.length > 0) {
        res.render('pages/formCadPost', { erros: erros })
    } else{
    const { originalname: name, size, key, location: url = "" } = req.file; //desestruturação
    Upload.create({
        name,
        size,
        key,
        url
    }).then((imagem)=>{
        console.log(imagem)
        req.flash('success_msg','Imagem cadastrada com sucesso')
        res.redirect('/admin/post')
    }).catch((erro)=>{
        res.redirect('/post')
    })}
    
})
// exibir
router.get('/exibir',(req,res)=>{
    Upload.findAll().then((posts)=>{
        console.log(posts)
        res.render('pages/exibir',{posts:posts})    
    })
})

module.exports = router