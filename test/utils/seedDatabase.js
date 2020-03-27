import prisma from './../../src/prisma'
import bcrypt from 'bcryptjs'

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

const seedDatabase = async() => {
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyComments()
  await prisma.mutation.deleteManyUsers()

  const jenUser = await prisma.mutation.createUser({
    data: {
      name: 'Jen',
      email: 'jes@example.com',
      password: bcrypt.hashSync('Red12345')
    }
  })

  const postsCreated = await Promise.all(posts.map(post => {
    post.author = {
      connect: {id: jenUser.id}
    }
    return prisma.mutation.createPost({
      data: { ...post}
    }, '{id title}')
  }))

}

export { seedDatabase as default }