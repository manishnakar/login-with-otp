import express from 'express'

const smsRouter = express.Router()

smsRouter.post('/sendOTP', (req, res) => {
  const phone = req.body.phone

  res.status(200).send({ phone })
})

smsRouter.post('/verifyOTP', (req, res) => {
  const phone = req.body.phone
  const otp = req.body.otp
  res.json({ phone, otp })
})

smsRouter.post('logout', (req, res) => {
  res.json('logged out')
})

export { smsRouter }
