const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const Upload = require('../db/upload')
const {eAdmin} = require('../helpers/eAdmin')

//estatic
router.use(express.static('public'));
router.use(express.static('node_modules'))


//set storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' +Date.now() + path.extname(file.originalname))
    }
});

//init Upload
const upload = multer({
    storage:storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('myImage');

//Check file type
function checkFileType(file,cb){
    // Allowwed extenssions
    const filetypes = /jpeg|jpg|png/;
    // Check extenssion
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    // Check mime
    const mimetype = filetypes.test(file.mimetype)

    if(mimetype && extname){
        return cb(null,true)
    }else{
        cb('Erro: Somente imagens!')
    }
}

// rota upload
router.get('/',eAdmin,(req,res)=> {
    Upload.findAll().then((posts)=>{
        res.render('pages/formUpload',{posts:posts})
    }).catch()
})

router.post('/',eAdmin,(req,res) =>{
    upload(req,res,(erro)=>{
        if(erro){
            req.flash('error_msg',erro.message)
            res.redirect('/upload')
        }else{
            if(req.file == undefined){
                req.flash('error_msg','Nenhum arquivo selecionado!')
                res.redirect('/upload')
            }else{
                const url = req.file.path
                const newUrl = url.replace('public',"")
                Upload.create({
                    imagem: newUrl
                }).then(()=>{
                    req.flash('success_msg','Arquivo enviado!')
                    res.redirect('/upload')
                }).catch((erro)=>{
                    console.log('Erro ao fazer o upload no db'+erro)
                })  
            }
        }
    })
})

module.exports = router