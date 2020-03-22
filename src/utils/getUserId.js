import jwt from 'jsonwebtoken'
import { SECRET } from './utils'

const getUserId = (request, requireAuth = true) => {
  const headerAuth = request.request ?
    request.request.headers.authorization :
    request.connection.context.Authorization

  if (headerAuth) {
    const token = headerAuth.replace('Bearer ', '')
    const decoded = jwt.verify(token, SECRET)
    return decoded.userId
  }
  if (requireAuth) {
    throw new Error('Authentication required')
  }
  return null
}
export { getUserId as default }