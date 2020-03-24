/* global test, expect */

import {getFirstName, isValidPassword} from './../src/utils/user.js'

test('Should return first name when gives a full name', () => {
  const firstName = getFirstName('Alberto Eyo')
  expect(firstName).toBe('Alberto')
})

test('Should return first name when gives only the name', () => {
  const name = getFirstName('Sandra')
  expect(name).toBe('Sandra')
})

test('Should reject password shorter than 8 characters', () => {
  expect(isValidPassword('1234567')).toBe(false)
})

test('Should reject password that contains the word password', () => {
  expect(isValidPassword('PassWord123456')).toBe(false)
})

test('Should correctly validate a correct password', () => {
  expect(isValidPassword('red12345')).toBe(true)
  expect(isValidPassword('red12345')).toBe(true)
})