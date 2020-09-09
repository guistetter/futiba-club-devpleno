require('dotenv/config')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')
const port = process.env.PORT || 3000

const account = require('./account')
const admin = require('./admin')
const groups = require('./groups')
const { NULL } = require('mysql2/lib/constants/types')

const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

const init = async() => {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWD,
    database: 'futiba'
  })

  //middleware para verificar usuario logado
  app.use((req,res, next) =>{
    if(req.session.user){
      res.locals.user = req.session.user
    }else{
      res.locals.user = false
    }
    // console.log(req.session,'----------')
    next()
  })

  app.use(account(connection))
  app.use('/admin', admin(connection))
  app.use('/groups', groups(connection))
  
  let classification = null
  setInterval(() =>{
    classification = null
    console.log('limpou a cache')
  },10000)
  app.get('/classification', async(req,res) => {
    if(classification){
      res.send(classification)
    }else{
    const query =
    `
      select users.id, users.name, 
      sum(guessings.score) as score 
      from users 
      left join guessings on guessings.user_id = users.id 
      group by guessings.user_id 
      order by score desc
    `
    const [rows] = await connection.execute(query)
    res.send(rows)
  }
  }) 

  app.listen(port, err => {
    if(err){
      console.log('Somethin is wrong with server')
    } else {
      console.log('Server Is Running...')
    }
  })
}
init()
  




