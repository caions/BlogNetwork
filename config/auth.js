const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

//model de usuario
const Model = require('../db/index')

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email',passwordField:'senha'},(email,senha,done) => {

        Model.Usuario.findOne({
            where:{
                email:email
            }
        }).then((usuario) => {
            if(!usuario){
                return done(null,false,{message: "Esta conta não existe"})
            }

            bcrypt.compare(senha,usuario.senha,(erro,batem)=>{

                if(batem){
                    return done(null,usuario)
                }else{
                    return done(null,false,{message: "Senha incorreta"})
                }

            })

        }).catch()

    }))

    passport.serializeUser(function(usuario, done) { 
        done(null, usuario);
      });
      
      passport.deserializeUser(function(usuario, done) {
        if(usuario!=null)
          done(null,usuario);
      });
}