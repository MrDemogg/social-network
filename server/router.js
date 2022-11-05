const express = require('express')
const router = express.Router()
const fsHandler = require('./fsHandler/fsHandler')

router.get('/profile', (req, res) => {
  const answer = fsHandler.getProfile({name: req.body.name, surname: req.body.surname})
  console.log(answer)
  if (answer) {
    res.send({login: 'success'})
  } else {
    res.send({login: 'fail'})
  }
})

module.exports = router