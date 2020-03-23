import '@babel/polyfill'
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

server.start({ port: process.env.PORT || 4000 },  _ => console.log('server is running'))