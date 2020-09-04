const express = require('express')
const app = express.Router()

const init = connection =>{
  //middleware para autenticar usuario, se nao existir nao pode criar grupo
  app.use((req, res, next)=> {
    if(!req.session.user){
      res.redirect('/')
    } else {
      next()
    }
  })
  app.get('/', async(req, res) => {
    const [groups, fields] = await connection.execute('select * from grupos')
    res.render('groups',{
      groups: groups
    })
  })
  return app
}

module.exports = init