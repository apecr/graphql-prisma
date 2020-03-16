import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
})

prisma.query.users(null, '{ id name email posts { id title } }').then(data => {
  console.log(JSON.stringify(data, null, 4))
})

const getComments = async() => {
  const comments =  await prisma.query.comments(null, '{ id text author { name } post { title } }')
  console.log(JSON.stringify(comments, null, 4))
  return comments
}

getComments().then(data => console.log('End comments function'))
