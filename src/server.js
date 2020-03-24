import { GraphQLServer, PubSub } from 'graphql-yoga'
import * as database from './db'
import prisma from './prisma'
import { resolvers, fragmentReplacements } from './resolvers/index'

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  fragmentReplacements,
  context: (request) => ({
    request,
    'db': database.db,
    pubsub,
    prisma
  })
})

export { server as default }