const express = require('express')
const app = express.Router()

const init = connection => {

  app.get('/', async (req, res) =>{
     const [rows, fields] = await connection.execute('select * from users')
     console.log(rows)
    res.render('home')
  })

  app.get('/new-account',(req,res) =>{
    res.render('new-account',{error:false})
  })

  app.post('/new-account', async(req, res) => {
    console.log(req.body)
    //faz select do email dos users e guarda em rows
    const [rows, fields] = await connection.execute('select * from users where email = ?', [req.body.email])
    if(rows.length === 0){ //verifica se email já existe
      //inserir
      console.log('inserir')
      const { name, email, passwd } = req.body
      await connection.execute('insert into users(name, email, passwd, role) values(?,?,?,?)',[
        name, 
        email, 
        passwd,
        'user'
      ])
      res.redirect('/')
    }else{
      console.log('deu xabu')
      res.render('new-account', {
        error: 'Usuário já existente'
      })
    }
  })

  return app 
}

module.exports = init