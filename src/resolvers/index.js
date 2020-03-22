import { extractFragmentReplacements } from 'prisma-binding'
import Query from './Query'
import Comment from './Comment'
import User from './User'
import Post from './Post'
import Mutation from './Mutation'
import Subscription from './Subscription'

const resolvers = {
  Query,
  Comment,
  User,
  Post,
  Mutation,
  Subscription
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements}