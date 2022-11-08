const express = require('express')
const router = express.Router()
const fsHandler = require('./fsHandler/fsHandler')

router.get('/profile', (req, res) => {
  console.log(req.query.mail)
  if (req.query.mail !== null) {
    fsHandler.login(req.query.name, req.query.surname, res, req.query.mail)
  } else {
    fsHandler.login(req.query.name, req.query.surname, res)
  }
})

router.post('/profile', (req, res) => {
  fsHandler.changeProfile(req.body.profile, req.body.changes, res)
})

router.get('/posts', (req, res) => {
  fsHandler.getPosts(req.query.name, req.query.surname, res)
})

router.post('/posts', (req, res) => {
  fsHandler.createPost(req.body, res)
})

router.post('/subscribe', (req, res) => {
  fsHandler.subscribe(req.body.subMail, req.body.name, req.body.surname, res)
})

router.post('/subscribe/delete', (req, res) => {
  fsHandler.subscribesDelete(req.body.name, req.body.surname, res)
})

router.get(`/subscribe`, (req, res) => {
  fsHandler.getSubscribes(req.query.name, req.query.surname, res)
})

module.exports = router