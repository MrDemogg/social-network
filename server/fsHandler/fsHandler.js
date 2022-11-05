const fs = require('fs')

const fsHandler = {
  getProfile: (profile) => {
    let profileExist = false
    fs.readdir('./server/data', (err1, files) => {
      if (files) {
        for (let i = 0; i < files.length; i++) {
          fs.readFile('./server/data/' + files[i], (err2, data) => {
            if (JSON.parse(data.toString()).name === profile.name && profile.surname === JSON.parse(data.toString()).surname) {
              profileExist = true
            }
          })
        }
      } else {
        fsHandler.createProfile(profile.name, profile.surname)
        profileExist = true
      }
    })
    if (profileExist) {
      return profileExist
    } else {
      fsHandler.createProfile(profile.name, profile.surname)
      return true
    }
  },
  createProfile: (name, surname) => {
    fs.writeFile(`./server/data/${name}${surname}.json`, JSON.stringify({name: name, surname: surname}), err => {
      console.log(err)
    })
  }
}

module.exports = fsHandler