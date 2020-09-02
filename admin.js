const express = require('express')
const app = express.Router()

const init = connection =>{
  app.use((req, res, next)=> {
    if(!req.session.user || req.session.user.role === 'user'){
      res.redirect('/')
    } else {
      next()
    }
  })
app.get('/',(req,res)=>{
  res.send('Olá adminnn')
})

app.get('/games',(req,res)=>{
  res.send('Olá games')
})

return app
}

module.exports = init