require('dotenv/config')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')
const port = process.env.PORT || 3000

const account = require('./account')

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
    console.log(req.session,'----------')
    next()
  })

  app.use(account(connection))

  app.listen(port, err => {
    if(err){
      console.log('Somethin is wrong with server')
    } else {
      console.log('Server Is Running...')
    }
  })
}
init()
  




