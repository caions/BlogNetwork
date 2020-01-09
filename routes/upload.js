const router = require('express').Router()
const express = require('express')
const multer = require('multer')
const multerConfig = require('../config/multer')
const Upload = require('../db/upload')


//estatic
router.use('/', express.static('node_modules'));
router.use('/', express.static('tmp'));

// cadastrar imagens
router.get('/posts', async (req, res) => {
    res.render('pages/formUpload')
    
})

router.post('/upload', multer(multerConfig).single('file'), (req, res) => {
    const { originalname: name, size, key, location: url = "" } = req.file; //desestruturação 
    Upload.create({
        name,
        size,
        key,
        url
    }).then(()=>{
        res.redirect('/exibir')
    })

})

//deletar posts
router.get('/image/delete/:id', (req, res) => {
    let id = req.params.id;
    Upload.findByPk(id).then(post => {
        post.destroy().then(() => {
            res.redirect('/exibir')
        })
    }).catch(err => {

    })
})

//exibir imagens
router.get('/exibir',(req,res)=>{
    Upload.findAll().then((posts)=>{
        console.log(posts)
        res.render('pages/exibir',{posts:posts})    
    })
})



module.exports = router