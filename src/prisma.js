import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
})

// prisma.query.users(null, '{ id name email posts { id title } }').then(data => {
//   console.log(JSON.stringify(data, null, 4))
// })

// const getComments = async() =>
//   await prisma.query.comments(null, '{ id text author { name } post { title } }')

// getComments().then(data => JSON.stringify(data, null, 4)).then(console.log)

// prisma.mutation.createPost({
//   data: {
//     title: '101 Graphql',
//     body: '',
//     published: false,
//     author: {
//       connect: {
//         id: 'ck7ul9gwd00cx0879qnf872yo'
//       }
//     }
//   }
// }, '{ id title body published }')
//   .then(data => JSON.stringify(data, null, 4))
//   .then(console.log)
//   .then(_ => prisma.query.users(null, '{ id name email posts { id title } }'))
//   .then(data => JSON.stringify(data, null, 4))
//   .then(console.log)

const updatePost = _ => prisma.mutation.updatePost({
  where: {
    id: 'ck7uoqcf800ig0879tkf666a0'
  },
  data: {
    published: true,
    body: 'Content for the 101 course of GraphQL'
  }
}, '{id title body published}')

updatePost()
  .then(_ => prisma.query.posts(null, '{ id title body published }'))
  .then(d => JSON.stringify(d, null, 2))
  .then(console.log)
