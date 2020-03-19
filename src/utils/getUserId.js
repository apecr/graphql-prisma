import jwt from 'jsonwebtoken'
import { SECRET } from './utils'

const getUserId = (request) => {
  const headerAuth = request.request.headers.authorization
  if (!headerAuth) {
    throw new Error('Authentication required')
  }
  const token = headerAuth.replace('Bearer ', '')
  const decoded = jwt.verify(token, SECRET)
  return decoded.userId
}
export { getUserId as default }