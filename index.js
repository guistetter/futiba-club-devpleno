const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) =>{
  res.render('home')
})

app.listen(port, err => {
  if(err){
    console.log('Somethin is wrong with server')
  } else {
    console.log('Server Is Running...')
  }
})