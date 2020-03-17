import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
})

const createPostForUserAndRetrieveUserInfo = async({ authorId, data }) => {
  const userExist = await prisma.exists.User({ id: authorId })

  if (!userExist) {
    throw new Error('User not found')
  }

  const post = await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: authorId
        }
      }
    }
  }, '{ author { id name email posts { id title published } } }')
  return post.author
}

const updatePostForUserAndRetrieveUserInfo = async({ postId, data }) => {
  const user = await prisma.mutation.updatePost({
    where: {
      id: postId
    },
    data
  }, '{ author { id } }')
  return await prisma.query.user({
    where: {
      id: user.author.id
    }
  }, '{ id name email posts { id title published } }')
}

createPostForUserAndRetrieveUserInfo({
  authorId: 'ck7ul9gwd00cx0879qnf872yo',
  data: {
    title: '',
    body: '',
    published: false
  }
}).then(user => JSON.stringify(user, null, 2))
  .then(console.log)
  .catch(console.error)

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