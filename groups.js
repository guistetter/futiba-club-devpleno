const express = require('express')
const app = express.Router()

const init = connection =>{
  app.get('/', async(req, res) => {
    const [groups, fields] = await connection.execute('select * from grupos')
    res.render('groups',{
      groups: groups
    })
  })
  return app
}

module.exports = init