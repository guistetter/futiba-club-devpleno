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

  app.post('/', async(req, res)=>{
    await connection.execute('insert into grupos(name) values(?)',[
      req.body.name
    ])
    res.redirect('/groups')
  })

  return app
  
}

module.exports = init