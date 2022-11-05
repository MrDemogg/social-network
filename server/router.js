const express = require('express')
const router = express.Router()
const fsHandler = require('./fsHandler/fsHandler')

router.get('/profile', (req, res) => {
  const answer = fsHandler.getProfile(req.body.name, req.body.surname)
  console.log(answer)
  if (answer) {
    res.status(200).send({login: 'success'})
  } else {
    res.status(500).send({login: 'fail'})
  }
})

router.post('/profile', (req) => {
  fsHandler.changeProfile(req.body.oldProfile, req.body.newProfile)
})

router.get('/posts', (_, res) => {
  const fsResponse = fsHandler.getPosts()
  if (fsResponse.responseType === 'error') {
    res.status(500).send(fsResponse.content.message)
  } else {
    res.status(200).send(fsResponse.content)
  }
})

router.get('/posts/:datetime', (req, res) => {
  const filterByDate = (arr, start) => {
    start = start ? new Date(start) : null;

    return arr.filter(({ date }) => {
      date = new Date(date);
      return !((start && start > date));
    });
  };
  const fsResponse = fsHandler.getPosts()
  if (fsResponse.responseType === 'error') {
    res.status(500).send(fsResponse.content.message)
  } else {
    res.status(200).send(filterByDate(fsResponse.content, req.params.datetime))
  }
})

module.exports = router