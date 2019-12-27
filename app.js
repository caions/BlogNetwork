// modulos
const express = require('express')
const app = express();
const handlebars = require('express-handlebars')

//config
//estatic
app.use('/node_modules', express.static(__dirname + '/node_modules'));

//handlebars
app.engine('handlebars', handlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//rotas

app.get('/',(req,res)=>res.render('pages/teste'))

//rotando o servidor
const PORT = 8080;
app.listen(PORT,() => console.log(`Servidor rodando na porta ${PORT}`))