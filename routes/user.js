const express = require('express')
const router = express.Router()
const Post = require('../db/posts')

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
        }).then((postagem)=>{
        if(postagem){
            res.render('pages/postagem',{postagem:postagem})
        }else{
            req.flash("error_msg","Esta postagem não existe")
            res.redirect('/')
        }
    }).catch((erro)=>{
        res.send('Houve um erro interno'+erro)
        res.redirect('/')
    })
    
)

module.exports = router 