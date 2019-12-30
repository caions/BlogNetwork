const express = require('express')
const app = express();
const PORT = 8070;

//rotando o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))

module.exports = app