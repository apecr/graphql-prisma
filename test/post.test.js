/* eslint-env jest */

import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seedDatabase)

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

  const authClient = getClient(userOne.jwt)
  const { data } = await authClient.query({ query: getMyPosts })

  console.log(data)


})