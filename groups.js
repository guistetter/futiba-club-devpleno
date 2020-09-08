const express = require('express')
const { connect } = require('mysql2')
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
      groups
    })
  })

  //Rota para qdo clicar no grupo, ir pra pagina detalhada do grupo
  app.get('/:id', async(req, res) => {
    //query para listar usuarios pendenntes em determinado grupo
    const [group] = await connection.execute('SELECT grupos.*, groups_users.role from grupos left join groups_users on groups_users.group_id = grupos.id and groups_users.user_id = ? where grupos.id = ? ',[
      req.session.user.id,
      req.params.id
    ])
    const [pendings] = await connection.execute("SELECT groups_users.*, users.name FROM groups_users inner join users on groups_users.user_id = users.id and groups_users.group_id = ? and groups_users.role like 'pending'",[
      req.params.id
    ])
    const [games] = await connection.execute('select * from games')
    res.render('group',{
      pendings,
      group:group[0],
      games
    })
  })

  //url para aceitar um usuario "primeiro id é do grupo e o segundo é do user."
  app.get('/:id/pending/:idGU/:op', async(req,res) => {

    const [group] = await connection.execute('SELECT groups_users.*, groups_users.role from grupos left join groups_users on groups_users.group_id = grupos.id and groups_users.user_id = ? where grupos.id = ? ',[
      req.session.user.id,
      req.params.id
    ])

    if(group.length === 0 || group[0].role !== 'owner'){
      res.redirect('/groups/'+req.params.id)
    }else{
      //pegando id do usuario e aprovando/naoaprovando
      if(req.params.op === 'yes'){
        await connection.execute('update groups_users set role = "user" where id = ? limit 1',[
          req.params.idGU
        ])
        res.redirect('/groups/'+req.params.id)
      } else {
        // se nao aceitar apaga o pedido
        await connection.execute('delete from groups_users where id = ? limit 1',[
          req.params.idGU
        ])
        res.redirect('/groups/'+req.params.id)
      }
    }
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

  //Rotas para apostas dos jogos
  app.post('/:id', async(req, res) =>{
    //logica para pegar o jogo em si e as apostas feitas no times deste jogo
    const guessings = []
    Object
    .keys(req.body)
    .forEach(team =>{
      const parts = team.split('_')
      const game ={
        game_id: parts[1],
        result_a: req.body[team].a,
        result_b: req.body[team].b
      }
      guessings.push(game)
    })

    //Logica para tratar N insercoes simultaneas
    const batch = guessings.map(guess => {
      return connection.execute('insert into guessings (result_a, result_b, game_id, group_id, user_id) values (?,?,?,?,?)',[  
      guess.result_a,
      guess.result_b,
      guess.game_id,
      req.params.id, 
      req.session.user.id
      ])
    })
    //passando conjunto de promises, map nao aceita await dentro dele
    await Promise.all(batch)
    res.redirect('/groups/'+req.params.id)
  })

  return app

}

module.exports = init