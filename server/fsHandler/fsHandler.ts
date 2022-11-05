import {IGetProfileData} from "./IGetProfileData";

const fs = require('fs')

const fsHandler = {
  getProfile: (profile: IGetProfileData) => {
    return fs.readdir('./data', (err, files) => {
      let profileExist = false
      for (let i = 0; i < files.length; i++) {
        fs.readFile('./data/' + files[i], (err, data) => {
          if (JSON.parse(data.toString()).name === profile.name && profile.surname === JSON.parse(data.toString()).surname) {
            profileExist = true
          }
        })
      }
      if (profileExist) {
        return profileExist
      } else {
        fsHandler.createProfile(profile.name, profile.surname)
        return false
      }
    })
  },
  createProfile: (name: string, surname: string): void => {
    fs.writeFile(`./data/${name}${surname}.json`, JSON.stringify({name: name, surname: surname}), err => {
      console.log(err)
    })
  }
}

module.exports = fsHandler