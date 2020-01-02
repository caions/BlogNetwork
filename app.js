// modulos
const app = require('./server/server')
const handlebars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const user = require('./routes/user')
const admin = require('./routes/admin')
const multer = require('multer')
const path = require('path')

//config
//session
app.use(session({
    secret: "blogSession",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//midllewares
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
}
)

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

app.get('/upload',(req,res)=> {
    res.render('pages/formUpload')
})
/*
app.post('/upload',(req,res) =>{
    upload((req,res)=>{
        console.log(req.file)
        res.send('teste')
    }).catch((erro)=>{
        console.log('Deu ruim'+erro)
    })
})*/

app.post('/upload',(req,res) =>{
    upload(req,res,(erro)=>{
        if(erro){
            req.flash('error_msg',erro.message)
            console.log(erro)
            res.redirect('/upload')
        }else{
            if(req.file == undefined){
                req.flash('error_msg','Nenhum arquivo selecionado!')
                res.redirect('/upload')
            }else{
                req.flash('success_msg','Arquivo enviado!')
                res.redirect('/upload')
            }
            
        }
    })
})

//rotas
app.use('/',user)
app.use('/admin',admin)

//handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');