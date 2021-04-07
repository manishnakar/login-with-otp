import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Wecome to Login with OTP')
})

const port = process.env.PORT

app.listen(port , ()=> {
  console.log(`Server listening on port ${port}`)
})
