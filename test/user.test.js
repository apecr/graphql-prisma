/* eslint-disable new-cap */
/* eslint-env jest */

import 'cross-fetch/polyfill'
import ApolloBoost, { gql } from 'apollo-boost'
import prisma from '../src/prisma'
import bcrypt from 'bcryptjs'

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
})

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

beforeEach(async() => {
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

})

test('Should create a new user', async() => {
  const createUser = gql`
      mutation{
          createUser(data: {
              name: "Alberto Eyo",
              email: "albertoeyo@gmail.com",
              password: "red12345"
          }){
              token
              user{
                id
              }
          }
      }
  `

  const response = await client.mutate({
    mutation: createUser
  })

  const existUser = await prisma.exists.User({
    id: response.data.createUser.user.id
  })
  expect(existUser).toBe(true)
})

test('Should expose public author profiles', async() => {
  const getUsers = gql`
    query{
      users{
        id
        name
        email
      }
    }
  `

  const response = await client.query({query: getUsers})
  expect(response.data.users.length).toBe(1)
  expect(response.data.users[0].email).toBe(null)
  expect(response.data.users[0].name).toBe('Jen')
})

test('Should return all the public posts', async() => {
  const getPosts = gql`
    query{
      posts{
        id
        title
        body
        published
      }
    }
  `

  const postsResponse = await client.query({ query: getPosts })
  expect(postsResponse.data.posts.length).toBe(1)
  expect(postsResponse.data.posts[0].published).toBe(true)
})