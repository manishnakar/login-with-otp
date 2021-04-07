import express from 'express'
import crypto from 'crypto'

const smsRouter = express.Router()

const smsKey = process.env.SMS_SECRET_KEY

smsRouter.post('/sendOTP', (req, res) => {
  const phone = req.body.phone
  const otp = Math.floor(100000 + Math.random() * 900000)
  const ttl = 2 * 60 * 1000
  const expires = Date.now() + ttl
  const data = `${phone}.${otp}.${expires}`
  const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex')
  const fullHash = `${hash}.${expires}`
  // #TODO send OTP on email or SMS
  // res.status(200).send({ phone, otp, ttl, expires, data, hash, fullHash })
  res.status(200).send({ phone, hash: fullHash, otp })
})

smsRouter.post('/verifyOTP', (req, res) => {
  const phone = req.body.phone
  const hash = req.body.hash
  const otp = req.body.otp
  const [hashValue, expires] = hash.split('.')
  const now = Date.now()
  if (now > parseInt(expires)) {
    return res.status(504).json({ msg: 'Timeout. Please try again' })
  }
  const data = `${phone}.${otp}.${expires}`
  const newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex')

  if (newCalculatedHash === hashValue) {
    // #TODO login user to the system
    // #TODO use redis to maintain session
    res.status(202).json({ msg: 'Verified' })
  } else {
    return res.status(400).json({ verification: false, msg: 'Invalid OTP' })
  }
})

smsRouter.post('logout', (req, res) => {
  res.json('logged out')
})

export { smsRouter }
