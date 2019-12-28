// modulos
const express = require('express')
const app = express();
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const Post = require('./db/posts')

//config
//estatic
app.use('/node_modules', express.static(__dirname + '/node_modules'));
//bodyparser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//rotas get
// home
app.get('/', (req, res) => 
Post.findAll().then((posts)=>res.render('pages/home',{posts:posts}))
)
//formulario posts
app.get('/post', (req, res) => res.render('pages/formPost'))


//rotas post

//create post
app.post('/add', (req, res) => Post.create({
    titulo: req.body.titulo,
    texto: req.body.texto
}).then(() =>
    res.redirect('/'),
    console.log('Post criado com sucesso'
    )).catch((erro) =>
        console.log('Falha ao criar o post' + erro))
)

// delete post
app.get('/delete/:id',(req,res)=>{
    Post.destroy({
        where: {
          id: req.params.id
        }
      }).then(() => {
        res.redirect('/'),
        console.log("Done");
      }).catch((erro) => res.send('Erro'+erro));
})


//rotando o servidor
const PORT = 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))