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
   const [inserted, insertedFields] = await connection.execute('insert into grupos(name) values(?)',[
      req.body.name
    ])
    //criando relacionamento entre usuario e grupo
    await connection.execute('insert into groups_users(group_id, user_id, role) values(?,?,?)',[
      inserted.insertId,
      req.session.user.id,
      'owner'
    ])
    res.redirect('/groups')
  })

  return app

}

module.exports = init