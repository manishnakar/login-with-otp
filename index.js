import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()

app.disable('etag')
app.use(morgan('tiny'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet({ hsts: false }))
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}))

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ['\'self\'']
  }
}))

app.get('/', (req, res) => {
  res.send('Wecome to Login with OTP')
})

app.use('*', (req, res, next) => {
  const error = {
    statusCode: 404,
    message: ['Cannot', req.method, req.originalUrl].join(' '),
  }
  next(error)
})

app.use((error, req, res, next) => {
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

  // console.log('[Error]', error)
  return res.status(500).json(error)
})

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
