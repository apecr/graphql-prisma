/* eslint-disable new-cap */
/* eslint-env jest */

import 'cross-fetch/polyfill'
import { getUsers, createUser, login, getProfile } from './utils/operations'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async() => {
  const variables = {
    data: {
      name: 'Alberto Eyo',
      email: 'albertoeyo@gmail.com',
      password: 'red12345'
    }
  }

  const response = await client.mutate({
    mutation: createUser,
    variables
  })
  const existUser = await prisma.exists.User({
    id: response.data.createUser.user.id
  })
  expect(existUser).toBe(true)
})

test('Should expose public author profiles', async() => {
  const response = await client.query({query: getUsers})
  expect(response.data.users.length).toBe(2)
  expect(response.data.users[0].email).toBe(null)
  expect(response.data.users[0].name).toBe('Jen')
})

test('Should not login with bad credentials', async() => {
  const variables = {
    data: {
      email: 'jes@example.com',
      password: 'Red12345678'
    }
  }

  await expect(
    client.mutate({
      mutation: login,
      variables
    })
  ).rejects.toThrow()
})

test('Should not create a user with short password', async() => {
  const variables = {
    data: {
      email: 'test@test.com',
      password: 'test',
      name: 'Test'
    }
  }

  await expect(client.mutate({
    mutation: createUser,
    variables
  })).rejects.toThrow()
})

test('Should fetch user profile', async() => {
  const authClient = getClient(userOne.jwt)

  const { data } = await authClient.query({ query: getProfile })
  expect(data.me.id).toBe(userOne.user.id)
  expect(data.me.name).toBe(userOne.user.name)
  expect(data.me.email).toBe(userOne.user.email)
})