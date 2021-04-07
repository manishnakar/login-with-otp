import express from 'express'
import { smsRouter } from './sms'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Wecome to Login with OTP')
})

router.get('/home', (req, res) => {
  res.send('secured route')
})

// Health Check API
router.get('/health-check', (req, res, next) => {
  res.status(200).json('ok')
})

router.use('/api/v1/sms', smsRouter)

// error handeling
router.use('*', (req, res, next) => {
  const error = {
    statusCode: 404,
    message: ['Cannot', req.method, req.originalUrl].join(' '),
  }
  next(error)
})

router.use((error, req, res, next) => {
  if (!error) {
    return
  }

  const isParseError = error instanceof SyntaxError && error.status === 400
  if (isParseError) {
    return res.status(400).json('Invalid JSON body')
  }

  if (error.statusCode) {
    if (error.statusCode === 404) {
      return res.status(404).send('File not found')
    }
    return res.status(error.statusCode).json(error)
  }

  return res.status(500).json(error)
})

export { router }
