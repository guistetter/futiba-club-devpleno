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

  //rota para listar os grupo
  app.get('/', async(req, res) => {
    const [groups, fields] = await connection.execute('SELECT grupos.*, groups_users.role FROM grupos left join groups_users on grupos.id = groups_users.group_id and groups_users.user_id = ?',[
      req.session.user.id
    ])
    res.render('groups',{
      groups: groups
    })
  })

  //Rota para qdo clicar no grupo, ir pra pagina detalhada do grupo
  app.get('/:id', async(req, res) => {
    //query para listar usuarios pendenntes em determinado grupo
    const [pendings] = await connection.execute("SELECT * FROM groups_users inner join users on groups_users.user_id = users.id and groups_users.group_id = ? and groups_users.role like 'pending'",[
      req.params.id
    ])
    res.render('group',{
      pendings
    })
  })

  //rota para pedir solicitação para entrar em um grupo
  app.get('/:id/join', async(req, res) => {
    const [rows, fields] = await connection.execute('select * from groups_users where user_id = ? and group_id = ?',[
      req.session.user.id, //id do usuario logado
      req.params.id //id do grupo no qual to pedindo pra entrar 
    ])
    if(rows.length > 0){
      res.redirect('/groups') //se for maior ele já está lá
    } else {
      await connection.execute('insert into groups_users(group_id, user_id, role) values(?,?,?)',[
        req.params.id,
        req.session.user.id,
        'pending'
      ])
      res.redirect('/groups')
    }
  })

  //rota para criar um grupo
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