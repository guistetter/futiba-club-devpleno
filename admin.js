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

app.get('/games' ,async (req,res)=>{
  const [rows, fields] = await connection.execute('select * from games')
  res.render('admin/games',{
    games: rows
  })
})

app.post('/games', async (req, res) =>{
  const {team_a, team_b } = req.body
  await connection.execute('insert into games (team_a, team_b) values(?,?)',[
    team_a,
    team_b
  ])
  res.redirect('/admin/games')
})
return app
}

module.exports = init