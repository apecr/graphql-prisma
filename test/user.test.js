/* eslint-disable new-cap */
/* eslint-env jest */

import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import prisma from '../src/prisma'
import seedDatabase from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seedDatabase)

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

test('Should not login with bad credentials', async() => {
  const login = gql`
    mutation{
      login(data: {
        email: "jes@example.com",
        password: "Red12345678"
      }){
        token
      }
    }
  `

  await expect(
    client.mutate({mutation: login})
  ).rejects.toThrow()
})

test('Should not create a user with short password', async() => {
  const createUser = gql`
    mutation{
      createUser(data: {
        email: "test@test.com",
        password: "test",
        name: "Test"
      }){
        token
      }
    }
  `

  await expect(client.mutate({mutation: createUser})).rejects.toThrow()
})