import prisma from './../../src/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const posts = [
  {
    title: 'First test post',
    body: 'Dummy body for the first test from Jen',
    published: true
  }, {
    title: 'Second test post',
    body: 'Dummy body for the first test from Jen (the draft)',
    published: false
  }]

const userOne = {
  input: {
    name: 'Jen',
    email: 'jes@example.com',
    password: bcrypt.hashSync('Red12345')
  },
  user: undefined,
  jwt: undefined
}

const seedDatabase = async() => {
  // delete test data
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyComments()
  await prisma.mutation.deleteManyUsers()

  // Create the Jen User
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  })
  userOne.token = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

  const postsCreated = await Promise.all(posts.map(post => {
    post.author = {
      connect: {id: userOne.user.id}
    }
    return prisma.mutation.createPost({
      data: { ...post}
    }, '{id title}')
  }))

}

export { seedDatabase as default, userOne }