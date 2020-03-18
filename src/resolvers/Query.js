import { matchAgainstSeveralElements } from './../utils'

const Query = {
  users: (parent, { query }, { prisma }, info) => {
    const opArgs = {}

    if (query) {
      opArgs.where = {
        OR: [{
          name_contains: query
        }, {
          email_contains: query
        }]
      }
    }

    return prisma.query.users(opArgs, info)
  },
  posts: (parent, { query }, { prisma }, info) =>
    prisma.query.posts(null, info),
  me: _ => ({
    id: '1234abdcs',
    name: 'Alberto Eyo',
    email: 'albert@example.com',
    age: 45
  }),
  post: _ => ({
    id: '123456789-asdfghj',
    title: 'Some example title post',
    body: 'loren ipsum',
    published: false
  }),
  comments: (parent, { query }, { db }, info) => db.comments
}

export { Query as default }