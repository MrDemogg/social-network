const fs = require('fs')

const fsHandler = {
  getPosts: (subscribes) => {
    const posts = []
    const err = {
      message: null,
      error: false
    }
    fs.readdir('./server/posts', (dirErr, files) => {
      if (dirErr) {
        err.error = true
        err.message = dirErr.message
      } else {
        if (files) {
          for (let i = 0; i < files.length; i++) {
            fs.readFile('./server/posts' + files[i], (fileErr, data) => {
              if (fileErr) {
                err.error = true
                err.message = fileErr.message
              } else {
                if (subscribes.includes(JSON.parse(data.toString()).mail)) {
                  posts.push(JSON.parse(data.toString()))
                }
              }
            })
          }
        }
      }
    })
    if (err.error) {
      return {responseType: 'error', content: err}
    }
    return {responseType: 'posts', content: posts}

  },
  login: (profile) => {
    let profileExist = false
    fs.readdir('./server/profiles', (err1, files) => {
      if (files) {
        for (let i = 0; i < files.length; i++) {
          fs.readFile('./server/profiles/' + files[i], (err2, data) => {
            const parsedData = JSON.parse(data.toString())
            if (parsedData.name === profile.name && profile.surname === parsedData.surname) {
              profileExist = true
            }
          })
        }
      } else {
        fsHandler.createProfile(profile)
        profileExist = true
      }
    })
    if (profileExist) {
      return profileExist
    } else {
      fsHandler.createProfile(profile)
      return true
    }
  },
  subscribe: (subscribeMail, name, surname) => {
    const err = {
      error: false,
      message: null,
      errorGuilt: 'server'
    }
    const valid = {
      mailValid: true
    }
    const validateMail = (mail) => {
      const mailTypes = ['@mail.ru', '@yandex.ru', '@gmail.com']
      let valid = false
      for (let type in mailTypes) {
        if (mail.includes(type)) {
          valid = true
        }
      }
      return valid
    }
    fs.readdir('./server/profiles', (error, files) => {
      if (error) {
        err.error = true
        err.message = error.message
      } else {
        if (files) {
          for (let i = 0; i < files.length; i++) {
            fs.readFile('./server/profiles/' + files[i], (error, data) => {
              if (error) {
                err.error = true
                err.message = error.message
              } else {
                if (data.mail === subscribeMail) {
                  valid.mailValid = validateMail(subscribeMail)
                  i = files.length
                }
              }
            })
          }
        }
      }
    })
    if (!valid.mailValid) {
      err.error = true
      err.message = 'Невалидная почта'
      err.errorGuilt = 'user'
    } else {
      let oldData = {}
      fs.readFile(`./server/profiles/${name}${surname}.json`, (error, data) => {
        if (error && !data) {
          err.error = true
          err.message = error.message
        } else {
          oldData = JSON.parse(data.toString())
          oldData.subscribes = [...oldData.subscribes, subscribeMail]
        }
      })
      fs.unlink(`./server/profiles/${name}${surname}.json`, error => {
        err.error = true
        err.message = error.message
      })
      fs.writeFile(`./server/profiles/${name}${surname}.json`, JSON.stringify(oldData), error => {
        err.error = true
        err.message = error.message
      })
    }
    if (err.error) {
      return err
    }
  },
  createProfile: (profile) => {
    fs.writeFile(`./server/profiles/${profile.name}${profile.surname}.json`, JSON.stringify(profile), err => {
      if (err) {
        console.log(err)
      }
    })
  },
  changeProfile: (oldProfile, newProfile) => {
    fs.unlink(`./server/profiles/${oldProfile.name}${oldProfile.surname}.json`, (err) => {
      if (err) {
        console.log(err)
      }
    })
    fs.writeFile(`./server/profiles/${newProfile.name}${newProfile.surname}.json`,
      JSON.stringify(newProfile), err => {
        if (err) {
          console.log(err)
        }
      }
    )
  },
  createPost: (post) => {
    const date = new Date()
    const err = {
      message: null,
      error: false,
      errorGuilt: 'server'
    }
    if (post.message && post.message.length > 0) {
      fs.writeFile(`./server/posts/${date}${post.name}${post.surname}.json`, JSON.stringify({
        datetime: date,
        ...post
      }), error => {
        if (error) {
          err.error = true
          err.message = error.message
        }
      })
    } else {
      err.error = true
      err.message = 'В посте пустое сообщение!'
      err.errorGuilt = 'user'
    }
    return err
  },
}

module.exports = fsHandler