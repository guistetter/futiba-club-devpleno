require('dotenv/config')
const express = require('express')
const app = express()
const mysql = require('mysql2/promise')
const port = process.env.PORT || 3000

const account = require('./account')

app.use(express.static('public'))
app.set('view engine', 'ejs')

const init = async() => {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWD,
    database: 'futiba'
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
  




