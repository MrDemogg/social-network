const express = require('express')
const router = express.Router()
const fsHandler = require('./fsHandler/fsHandler')

router.get('/profile', (req, res) => {
  fsHandler.login(req.body, res)
})

router.post('/profile', (req, res) => {
  fsHandler.changeProfile(req.body.profile, req.body.changes, res)
})

router.get('/posts', (req, res) => {
  fsHandler.getPosts(req.body.name, req.body.surname, res)
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
  fsHandler.getSubscribes(req.body.name, req.body.surname, res)
})

module.exports = router