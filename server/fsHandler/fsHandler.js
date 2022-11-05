const fs = require('fs')

const fsHandler = {
  getPosts: () => {
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
            fs.readFile('./server/profiles' + files[i], (fileErr, data) => {
              if (fileErr) {
                err.error = true
                err.message = fileErr.message
              } else {
                posts.push(JSON.parse(data.toString()))
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
  getProfile: (name, surname, mail) => {
    let profileExist = false
    fs.readdir('./server/profiles', (err1, files) => {
      if (files) {
        for (let i = 0; i < files.length; i++) {
          fs.readFile('./server/profiles/' + files[i], (err2, data) => {
            const parsedData = JSON.parse(data.toString())
            if (parsedData.name === name && surname === parsedData.surname && parsedData.mail === mail) {
              profileExist = true
            }
          })
        }
      } else {
        fsHandler.createProfile(name, surname, mail)
        profileExist = true
      }
    })
    if (profileExist) {
      return profileExist
    } else {
      fsHandler.createProfile(name, surname, mail)
      return true
    }
  },
  createProfile: (name, surname, mail) => {
    fs.writeFile(`./server/profiles/${name}${surname}.json`, JSON.stringify({name: name, surname: surname, mail: mail}), err => {
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
      JSON.stringify({name: newProfile.name, surname: newProfile.surname}), err => {
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
  }
}

module.exports = fsHandler