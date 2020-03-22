import jwt from 'jsonwebtoken'
import { SECRET } from './utils'

const TIME_EXPIRATION = '7 days'

const generateToken = userId => jwt.sign({userId}, SECRET, { expiresIn: TIME_EXPIRATION})

export { generateToken as default }