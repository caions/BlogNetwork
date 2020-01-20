const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const Model = require('../db/index')
const { eAdmin } = require('../helpers/eAdmin')
const multer = require('multer')
const multerConfig = require('../config/multer')


//config bodyparser
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//estatic
router.use(express.static('public'));
//router.use(express.static('node_modules'))
//router.use('/edit', express.static('node_modules'));
router.use('/edit', express.static('public'));

//home
router.get('/admin', (req, res) => {
    Model.Upload.findAll({
        attributes: ['url'],
        include: [{
            model: Model.Post,
            required: true
            , attributes: ['id', 'titulo', 'descricao'],
        }]
    }).then(posts => {
        res.render('pages/adminHome', { posts: posts })
    });
})

router.get('/List', (req, res) => {
    Model.Post.findAll({
        attributes: ['id','titulo','fk_imagem']   
    }).then(posts => {
        res.render('pages/exibir', { posts: posts })
    });
})

//formulario cad posts
router.get('/post', (req, res) => res.render('pages/formCadPost'))

router.post('/add',(req, res) => {
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
        Model.Post.create({
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            texto: req.body.texto,
            imagem: req.body.imagem,
            fk_imagem: req.body.fk_imagem
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
router.get('/delete/:id',(req, res) => {
    let id = req.params.id;
    Model.Post.findByPk(id).then(post => {
        Model.Post.destroy({ where: { id: id } }).then(() => {
            req.flash('success_msg', 'Post deletado com sucesso!')
            res.redirect('back');
        }).catch((erro) => {
            req.flash('error_msg', 'Falha ao excluir o post, tente novamente!')
            res.send('Erro' + erro);
        })
    })
})


// edit post
router.get('/edit/:id',(req, res) => {
    var id = req.params.id
    if (isNaN(id)) {
        req.flash('error_msg', 'O post não existe')
        res.redirect("/");
    } else {
        Model.Post.findByPk(id).then(post => {
            if (post != undefined) {

                res.render('pages/formEditPost', { post: post })

            } else {
                req.flash('error_msg', 'O post não existe')
                res.redirect('/')
            }
        }).catch((erro) => {
            req.flash("error_msg", "Falha ao editar o Post")
            res.redirect('/')
        })
    }
})

router.post('/edit',(req, res) => {
    var id = req.body.id;
    Model.Post.update({
        titulo: req.body.titulo,
        id: req.body.id,
        descricao: req.body.descricao,
        texto: req.body.texto,
        imagem: req.body.imagem,
        fk_imagem: req.body.fk_imagem
    }, {
        where: {
            id: id
        }
    }).then(() => {
        req.flash('success_msg', 'Post editado com sucesso')
        res.redirect('/')
    }).catch((erro) => {
        req.flash('error_msg', 'Falha ao editar o post')
        res.redirect('/')
    })
})



//IMAGENS


// cadastrar imagens
router.get('/imagem', (req, res) => {
    Model.Upload.findAll({ raw: true }).then((imagem) => {
        res.render('pages/formImagem', { imagem: imagem })
    })
})



router.post('/upload', multer(multerConfig).single('file'), (req, res) => {
    var erros = []

    if (!req.file || req.file == undefined || req.file == null) {
        erros.push({ texto: "Selecione uma imagem" })
    }

    if (erros.length > 0) {
        res.render('pages/formCadPost', { erros: erros })
    } else {
        const { originalname: nome, size, key, location: url = "" } = req.file; //desestruturação
        Model.Upload.create({
            nome,
            size,
            key,
            url
        }).then((imagem) => {
            req.flash('success_msg', 'Imagem cadastrada com sucesso')
            res.redirect('/admin/imagem')
        }).catch((erro) => {
            res.redirect('/admin/imagem')
        })
    }

})

//deletar imagem
router.get('/imagem/delete/:id', (req, res) => {
    let id = req.params.id;
    Model.Upload.findByPk(id).then(post => {
        post.destroy({ where: { id: id } }).then(() => {
            res.redirect('/imagem')
        })
    }).catch(err => {
    })
})

module.exports = router