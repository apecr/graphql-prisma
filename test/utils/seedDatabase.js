import prisma from './../../src/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

let posts = [
  {
    title: 'First test post',
    body: 'Dummy body for the first test from Jen',
    published: true
  }, {
    title: 'Second test post',
    body: 'Dummy body for the first test from Jen (the draft)',
    published: false
  }]

let testPosts = []
let testComments = []

const userOne = {
  input: {
    name: 'Jen',
    email: 'jes@example.com',
    password: bcrypt.hashSync('Red12345')
  },
  user: undefined,
  jwt: undefined
}

const userTwo = {
  input: {
    name: 'San',
    email: 'san@example.com',
    password: bcrypt.hashSync('Red12345')
  },
  user: undefined,
  jwt: undefined
}

const comments = [{
  text: 'First test comment'
}, {
  text: 'Second test comment'
}]

const createUser = async(user) => {
  user.user = await prisma.mutation.createUser({
    data: user.input
  })
  user.jwt = jwt.sign({ userId: user.user.id }, process.env.JWT_SECRET)
  return user
}

const seedDatabase = async() => {
  // delete test data
  await prisma.mutation.deleteManyComments()
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  // Create the Jen User

  await createUser(userOne)
  await createUser(userTwo)

  testPosts = await Promise.all(posts.map(post => {
    post.author = {
      connect: {id: userOne.user.id}
    }
    return prisma.mutation.createPost({
      data: { ...post}
    }, '{id title published}')
  }))

  comments[0].post = testPosts.filter(testPost => testPost.published)[0].id
  comments[0].author = userTwo.user.id

  comments[1].post = testPosts.filter(testPost => testPost.published)[0].id
  comments[1].author = userOne.user.id

  testComments = await Promise.all(comments.map(comment => {
    return prisma.mutation.createComment({
      data: {
        ...comment,
        author: {
          connect: {
            id: comment.author
          }
        },
        post: {
          connect: {
            id: comment.post
          }
        }
      }
    }, '{id text author { id } post { id } }')
  }))
}

export { seedDatabase as default, userOne, userTwo, testPosts, testComments }