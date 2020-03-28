/* eslint-disable new-cap */
/* eslint-env jest */

import 'cross-fetch/polyfill'
import { getPosts, getMyPosts, updatePost, deletePost, createPost, subscribeToPosts } from './utils/operations'
import seedDatabase, { userOne, testPosts } from './utils/seedDatabase'
import getClient from './utils/getClient'
import prisma from '../src/prisma'

const client = getClient()
let posts = []
let authClient = undefined

beforeEach(async() => {
  await seedDatabase()
  posts = testPosts
  authClient = getClient(userOne.jwt)
})

test('Should return all the public posts', async() => {
  const postsResponse = await client.query({ query: getPosts })
  expect(postsResponse.data.posts.length).toBe(1)
  expect(postsResponse.data.posts[0].published).toBe(true)
})

test('Should get all the posts from the userOne', async() => {
  const { data } = await authClient.query({ query: getMyPosts })
  expect(data.myPosts.length).toBe(2)
})

test('Should be able to update own post', async() =>{
  const postNotPublished = posts.filter(post => !post.published)[0]
  const variables = {
    id: postNotPublished.id,
    data: {
      published: true
    }
  }

  const { data } = await authClient.mutate({ mutation: updatePost, variables })
  const exists = await prisma.exists.Post({ id: postNotPublished.id, published: true })
  expect(exists).toBe(true)
  expect(data.updatePost.published).toBe(true)
})

test('Should create a new post', async() => {
  const variables = {
    post: {
      title: 'Test title for create Post',
      body: 'Test body for create Post',
      published: false
    }
  }

  const { data } = await authClient.mutate({ mutation: createPost, variables })
  const exists = await prisma.exists.Post({ id: data.createPost.id })
  expect(exists).toBe(true)
})

test('Should delete the second post', async() => {
  const variables = {
    id: posts[1].id
  }

  const { data } = await authClient.mutate({ mutation: deletePost, variables})
  expect(data.deletePost.id).toBe(posts[1].id)
  const notExists = await prisma.exists.Post({ id: posts[1].id })
  expect(notExists).toBe(false)
})

test('Should listen to post subscription', async(done) => {
  authClient.subscribe({ query: subscribeToPosts }).subscribe({
    next(response) {
      expect(response.data.post.mutation).toBe('UPDATED')
      done()
    }
  })

  await prisma.mutation.updatePost({
    where: {
      id: testPosts.filter(post => post.published)[0].id
    },
    data: {
      title: 'Updated title for test post'
    }
  })
})