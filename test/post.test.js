/* eslint-disable new-cap */
/* eslint-env jest */

import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import prisma from '../src/prisma'

const client = getClient()
let posts = []
let authClient = undefined

beforeEach(async() => {
  posts = await seedDatabase()
  authClient = getClient(userOne.jwt)
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

test('Should get all the posts from the userOne', async() => {
  const getMyPosts = gql`
    query{
      myPosts{
        id
        title
        body
        published
      }
    }
  `

  const { data } = await authClient.query({ query: getMyPosts })
  expect(data.myPosts.length).toBe(2)
})

test('Should be able to update own post', async() =>{
  const postNotPublished = posts.filter(post => !post.published)[0]
  const updatePost = gql`
    mutation{
      updatePost(
        id: "${postNotPublished.id}",
        data: {
          published: true
        }
      ){
        id
        title
        body
        published
      }
    }
  `

  const { data } = await authClient.mutate({ mutation: updatePost })
  const exists = await prisma.exists.Post({ id: postNotPublished.id, published: true })
  expect(exists).toBe(true)
  expect(data.updatePost.published).toBe(true)
})

test('Should create a new post', async() => {
  const createPost = gql`
    mutation{
      createPost(
        post: {
          title: "Test title for create Post",
          body: "Test body for create Post",
          published: false
        }
      ){
        id
        title
        body
        published
      }
    }
  `

  const { data } = await authClient.mutate({ mutation: createPost })
  const exists = await prisma.exists.Post({ id: data.createPost.id })
  expect(exists).toBe(true)
})

test('Should delete the second post', async() => {
  const deletePost = gql`
    mutation{
      deletePost(id: "${posts[1].id}"){
        id
        title
      }
    }
  `

  const { data } = await authClient.mutate({ mutation: deletePost})
  expect(data.deletePost.id).toBe(posts[1].id)
  const notExists = await prisma.exists.Post({ id: posts[1].id })
  expect(notExists).toBe(false)
})