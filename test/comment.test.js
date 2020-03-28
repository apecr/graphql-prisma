/* eslint-disable new-cap */
/* eslint-env jest */

import 'cross-fetch/polyfill'
import { deleteComment } from './utils/operations'
import seedDatabase, { userTwo, testComments } from './utils/seedDatabase'
import getClient from './utils/getClient'
import prisma from '../src/prisma'

beforeEach(seedDatabase)

test('Should delete own comment', async() => {
  const variables = {
    id: testComments[0].id
  }

  const authClient = getClient(userTwo.jwt)
  const { data } = await authClient.mutate({ mutation: deleteComment, variables})
  expect(data.deleteComment.id).toBe(testComments[0].id)
  const notExists = await prisma.exists.Comment({ id: testComments[0].id })
  expect(notExists).toBe(false)
})

test('Should not delete comment from other user', async() => {
  const authClient = getClient(userTwo.jwt)
  const variables = {
    id: testComments[1].id
  }
  await expect(authClient.mutate({ mutation: deleteComment, variables}))
    .rejects.toThrow()
})