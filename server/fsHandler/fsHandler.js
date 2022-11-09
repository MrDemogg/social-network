const fs = require('fs')

const fsHandler = {
  err: {
    message: null,
    errorGuilt: 'server'
  },
  getPosts: (name, surname, response) => {
    const posts = []
    let profileInfo
    fs.readFile(`./server/profiles/${name}${surname}.json`, (err, getData) => {
      profileInfo = JSON.parse(getData.toString())
    })
    fs.readdir('./server/posts', (error, files) => {
      if (error) {
        fsHandler.err.message = error.message
        response.status(500).send(fsHandler.err)
      } else {
        if (files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            fs.readFile('./server/posts/' + files[i], (error, data) => {
              if (error) {
                fsHandler.err.message = error.message
                response.status(500).send(fsHandler.err)
              } else {
                if (profileInfo.subscribes.includes(JSON.parse(data.toString()).mail) || profileInfo.mail === JSON.parse(data.toString()).mail)
                  posts.push(JSON.parse(data.toString()))
                if (i === files.length - 1) {
                  const sortedArr = posts
                    .map((n) => [n, new Date(n.date.split(".").reverse().join("-"))])
                    .sort((a, b) => a[1] - b[1])
                    .map((n) => n[0])
                  if (sortedArr.length > 20) {
                    sortedArr.slice(0, 20)
                  }
                  response.status(200).send(sortedArr)
                }
              }
            })
          }
        } else {
          response.status(200).send([])
        }
      }
    })
  },
  profileReq: (name, surname, response, mail) => {
    if (mail !== 'null') {
      if (!fs.existsSync(`./server/profiles/${name}${surname}.json`) && fsHandler.validateMail(mail)) {
        fsHandler.createProfile({name: name, surname: surname, mail: mail})
        response.status(200).send('success')
      } else {
        if (fsHandler.validateMail(mail)) {
          fsHandler.err.message = 'The profile is already in the database'
        } else {
          fsHandler.err.message = 'Mail is not valid'
        }
        fsHandler.err.errorGuilt = 'user'
        response.status(400).send(fsHandler.err)
      }
    } else {
      if (fs.existsSync(`./server/profiles/${name}${surname}.json`)) {
        response.status(200).send('success')
      } else {
        fsHandler.err.message = 'Profile is not exist'
        fsHandler.err.errorGuilt = 'user'
        response.status(400).send(fsHandler.err)
      }
    }
  },
  validateMail: (mail) => {
    const mailTypes = ['@mail.ru', '@yandex.ru', '@gmail.com']
    let valid = false
    for (let type in mailTypes) {
      if (mail.includes(mailTypes[type])) {
        valid = true
      }
    }
    return valid
  },
  subscribe: (subMail, name, surname, response) => {
    fs.readdir('./server/profiles', (error, files) => {
      if (error) {
        fsHandler.err.message = error.message
        response.status(500).send(fsHandler.err)
      } else {
        if (files) {
          for (let i = 0; i < files.length; i++) {
            fs.readFile('./server/profiles/' + files[i], (error, data) => {
              if (error) {
                fsHandler.err.message = error.message
                response.status(500).send(fsHandler.err)
              } else {
                if (fsHandler.validateMail(subMail)) {
                  if (JSON.parse(data.toString()).mail === subMail) {
                    i = files.length
                    fs.readFile(`./server/profiles/${name}${surname}.json`, (err, fileData) => {
                      if (err) {
                        fsHandler.err.message = err.message
                        response.status(500).send(fsHandler.err)
                      } else {
                        const data = JSON.parse(fileData.toString())
                        if (data.subscribes.includes(subMail)) {
                          data.subscribes = data.subscribes.filter(sub => sub !== subMail)
                        } else {
                          data.subscribes = [...data.subscribes, subMail]
                        }
                        fs.writeFile(`./server/profiles/${name}${surname}.json`,
                          JSON.stringify(data), err => {
                            if (err) {
                              fsHandler.err.message = err.message
                              response.status(500).send(fsHandler.err)
                            } else {
                              response.status(200).send('success')
                            }
                        })
                      }
                    })
                  } else {
                    if (files.length > 1 && i === files.length - 1) {
                      fsHandler.err.message = "Email'а Нет в базе данных"
                      fsHandler.err.errorGuilt = 'user'
                      response.status(400).send(fsHandler.err)
                    }
                  }
                } else {
                  i = files.length
                  fsHandler.err.message = 'Невалидный email'
                  fsHandler.err.errorGuilt = 'user'
                  response.status(400).send(fsHandler.err)
                }
              }
            })
          }
        }
      }
    })
  },
  createProfile: (profile) => {
    console.log(profile)
    fs.writeFile(`./server/profiles/${profile.name}${profile.surname}.json`, JSON.stringify({...profile, subscribes: []}), err => {
      if (err) {
        console.log(err)
      }
    })
  },
  changeProfile: (profile, changes, response) => {
    let profileOldData = {}
    fs.readFile(`./server/profiles/${profile.name}${profile.surname}.json`, (err, data) => {
      if (err) {
        fsHandler.err.message = err.message
        response.status(400).send(fsHandler.err)
      } else {
        profileOldData = JSON.parse(data.toString())
        fs.unlink(`./server/profiles/${profile.name}${profile.surname}.json`, (err) => {
          if (err) {
            fsHandler.err.message = err.message
            response.status(500).send(fsHandler.err)
          } else {
            const newData = {
              name: changes.name ? changes.name : profileOldData.name,
              surname: changes.surname ? changes.surname : profileOldData.surname,
              mail: changes.mail ? changes.mail : profileOldData.mail,
              subscribes: profileOldData.subscribes.filter(anyMail => anyMail !== profileOldData.mail)
            }
            fs.writeFile(`./server/profiles/${newData.name}${newData.surname}.json`,
              JSON.stringify(newData), err => {
                if (err) {
                  fsHandler.err.message = err.message
                  response.status(500).send(fsHandler.err)
                } else {
                  let withoutChanges1 = false
                  let withoutChanges2 = false
                  if (changes.mail) {
                    fs.readdir(`./server/profiles`, (err, files) => {
                      if (err) {
                        fsHandler.err.message = err.message
                        response.status(500).send(fsHandler.err)
                      } else {
                        for (let i = 0; i < files.length; i++) {
                          fs.readFile(`./server/profiles/` + files[i], (err, data) => {
                            if (err) {
                              fsHandler.err.message = err.message
                              response.status(500).send(fsHandler.err)
                            } else {
                              const oldData = JSON.parse(data.toString())
                              const newSubscribes = [...oldData.subscribes.filter(sub => sub !== profileOldData.mail), changes.mail]
                              if (oldData.subscribes.includes(profileOldData.mail)) {
                                fs.writeFile(`./server/profiles/${oldData.name}${oldData.surname}.json`,
                                  JSON.stringify({...oldData, subscribes: newSubscribes}),
                                  err => {
                                    if (err) {
                                      fsHandler.err.message = err.message
                                      response.status(500).send(fsHandler.err)
                                    } else if (files.length - 1 === i) {
                                      response.status(200).send('success')
                                    }
                                  }
                                )
                              }
                            }
                          })
                        }
                      }
                    })
                  } else {
                    withoutChanges1 = true
                  }
                  if (changes.name && changes.name !== profileOldData.name || changes.surname && changes.surname !== profileOldData.surname || changes.mail !== profileOldData.mail) {
                    fs.readdir(`./server/posts`, (err, files) => {
                      if (err) {
                        fsHandler.err.message = err.message
                        response.status(500).send(fsHandler.err)
                      } else {
                        for (let i = 0; i < files.length; i++) {
                          fs.readFile(`./server/posts/` + files[i], (err, data) => {
                            if (err) {
                              fsHandler.err.message = err.message
                              response.status(500).send(fsHandler.err)
                            } else {
                              const oldData = JSON.parse(data.toString())
                              const newFileData = {...oldData}
                              if (changes.name !== profileOldData.name) {
                                newFileData.name = changes.name
                              }
                              if (changes.surname !== profileOldData.surname) {
                                newFileData.surname = changes.surname
                              }
                              if (changes.mail !== profileOldData.mail) {
                                newFileData.mail = changes.mail
                              }
                              fs.writeFile(`./server/posts/` + files[i], JSON.stringify(newFileData), err => {
                                if (err) {
                                  fsHandler.err.message = err.message
                                  response.status(500).send(fsHandler.err)
                                } else {
                                  response.status(200).send('success')
                                }
                              })
                            }
                          })
                        }
                      }
                    })
                  } else {
                    withoutChanges2 = true
                  }
                  if (withoutChanges1 && withoutChanges2) {
                    response.status(200).send('success')
                  }
                }
              }
            )
          }
        })
      }
    })
  },
  createPost: (post, response) => {
    const addZero = (datetime, variant = 0) => {
      const strDatetime = `${datetime}`
      if (variant === 1) {
        if (strDatetime.length === 1) {
          return `00${datetime}`
        } else if (strDatetime.length === 2) {
          return `0${datetime}`
        }
        return datetime
      }
      if (strDatetime.length === 1) {
        return `0${datetime}`
      }
      return datetime
    }
    const date = new Date
    const dataDate = `${addZero(date.getDate())}.${addZero(date.getMonth())}.${date.getFullYear()}`
    const fileDate = `${dataDate}T${addZero(date.getHours())}-${addZero(date.getMinutes())}-${addZero(date.getSeconds())}.${addZero(date.getMilliseconds())}`
    if (post.message) {
      fs.readFile(`./server/profiles/${post.name}${post.surname}.json`, (err, data) => {
        if (err) {
          fsHandler.err.message = err.message
          response.status(500).send(fsHandler.err)
        } else {
          if (data) {
            fs.writeFile(`./server/posts/${fileDate}${post.name}${post.surname}.json`, JSON.stringify({
              date: dataDate,
              mail: JSON.parse(data.toString()).mail,
              ...post
            }), error => {
              if (error) {
                fsHandler.err.message = error.message
                response.status(500).send(fsHandler.err)
              } else {
                response.status(200).send('success')
              }
            })
          }
        }
      })
    } else {
      fsHandler.err.message = 'В посте пустое сообщение!'
      fsHandler.err.errorGuilt = 'user'
      response.status(400).send(fsHandler.err)
    }
  },
  subscribesDelete: (name, surname, response) => {
    fs.readFile(`./server/profiles/${name}${surname}.json`, (error, data) => {
      if (error) {
        fsHandler.err.message = error.message
        fsHandler.err.errorGuilt = 'user'
        response.status(400).send(fsHandler.err)
      } else {
        if (data) {
          const newData = {...JSON.parse(data.toString()), subscribes: []}
          fs.writeFile(`./server/profiles/${name}${surname}.json`, JSON.stringify(newData), error => {
            if (error) {
              fsHandler.err.message = error.message
              response.status(500).send(fsHandler.err)
            } else {
              response.status(200).send('success')
            }
          })
        }
      }
    })
  },
  getSubscribes: (name, surname, response) => {
    fs.readFile(`./server/profiles/${name}${surname}.json`, (error, data) => {
      if (error) {
        fsHandler.err.message = error.message
        fsHandler.err.errorGuilt = 'user'
        response.status(400).send(fsHandler.err)
      } else {
        if (data) {
          response.status(200).send(JSON.parse(data.toString()).subscribes)
        }
      }
    })
  }
}

module.exports = fsHandler