const express = require('express')
const cors = require('cors')
const router = require('./router')

const port = 8000
const app = express()

app.use(cors)
app.use(express.json())

app.use('', router)

app.listen(port, () => {
  console.log('Server was start on the port: ' + port)
})
