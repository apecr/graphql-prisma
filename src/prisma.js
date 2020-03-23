import { Prisma } from 'prisma-binding'
import {fragmentReplacements} from './resolvers/index'
import colors from 'colors'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: 'thisismysupersecrettext',
  fragmentReplacements
})

export { prisma as default }

// const createPostForUserAndRetrieveUserInfo = async({ authorId, data }) => {
//   const userExist = await prisma.exists.User({ id: authorId })

//   if (!userExist) {
//     throw new Error('User not found')
//   }

//   const post = await prisma.mutation.createPost({
//     data: {
//       ...data,
//       author: {
//         connect: {
//           id: authorId
//         }
//       }
//     }
//   }, '{ author { id name email posts { id title published } } }')
//   return post.author
// }

// const updatePostForUserAndRetrieveUserInfo = async({ postId, data }) => {
//   const postExist = await prisma.exists.Post({ id: postId })

//   if (!postExist) {
//     throw new Error('Post not found')
//   }

//   return await prisma.mutation.updatePost({
//     where: {
//       id: postId
//     },
//     data
//   }, '{ author { id name email posts { id title published } } }')
// }

// updatePostForUserAndRetrieveUserInfo({
//   postId: 'ck7uoqcf800ig0879tkf666a0',

//   // postId: '12345',
//   data: {
//     title: '102 Graphql',
//     published: true
//   }
// }).then(data => console.log(colors.green(JSON.stringify(data.author, null, 2))))
//   .catch(error => console.error(colors.red(error.message)))

// createPostForUserAndRetrieveUserInfo({
//   authorId: 'ck7ul9gwd00cx0879qnf872yo',
//   data: {
//     title: '',
//     body: '',
//     published: false
//   }
// }).then(user => JSON.stringify(user, null, 2))
//   .then(console.log)
//   .catch(console.error)

// createPostForUserAndRetrieveUserInfo({
//   authorId: '122345',
//   data: {
//     title: '',
//     body: '',
//     published: false
//   }
// }).then(user => JSON.stringify(user, null, 2))
//   .then(console.log)
//   .catch(console.error)