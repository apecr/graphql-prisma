/* eslint-env jest */

import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import seedDatabase from './utils/seedDatabase'
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