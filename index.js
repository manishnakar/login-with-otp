import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { router } from './routes'

const app = express()

app.disable('etag')
app.use(morgan('tiny'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}))
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

app.use('/', router)

const port = process.env.PORT

const DEVMODE = (process.env.NODE_ENV === 'development');

if (DEVMODE) {
  console.log('application started in development mode')
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
