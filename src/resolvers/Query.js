import {matchAgainstSeveralElements} from './../utils'

const Query = {
  users: (parent, { query }, { db }, info) => {
    return query
      ? db.users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()))
      : db.users
  },
  posts: (parent, { query }, { db }, info) =>
    query
      ? db.posts.filter(post => matchAgainstSeveralElements([post.title, post.body], query))
      : db.posts,
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

export {Query as default}