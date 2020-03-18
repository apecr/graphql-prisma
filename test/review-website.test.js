/* eslint-disable new-cap */
import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma-review-website.graphql',
  endpoint: 'http://localhost:4466/reviews/default'
})

const bookToCreate = {
  title: 'El amor en los tiempos del colera',
  author: 'Gabriel Garcia Marquez',
  isbn: 'ISBN 13: 9788497592451'
}

const reviews = [{ text: 'amazing', rating: 5 }, { rating: 4 }]
const users = [{ username: 'apecr' }, { username: 'onlyyo' }]

const createBook = async(book) => {
  const bookCreated = await prisma.mutation.createBook({
    data: { ...book }
  }, '{ id title author isbn }')
  return bookCreated
}

// const deleteBook = async (bookId) => await prisma.mutation.deleteBook({ where: { id: bookId } }, '{ id title }')
const createUsers = () => {
  return Promise.all(users.map(user => {
    return prisma.mutation.createUser({ data: { ...user } }, '{id username}')
  }))
}

const deleteUser = async(user) => {
  const existUser = await prisma.exists.User({ ...user })
  if (existUser) {
    return prisma.mutation.deleteUser({ where: { ...user } }, '{ id username reviews { id text rating } }')
  }
  console.log(`User does not exist, not deleting ${user.username}`)
  return existUser
}

const deleteBook = async(book) => {
  const existBook = await prisma.exists.Book({ id: book.id })
  if (existBook) {
    return prisma.mutation.deleteBook({ where: { id: book.id } }, '{ id title }')
  }
  console.log(`Book does not exist, not deleting ${book.id}`)
  return existBook
}

const deleteElements = async() => {
  const userToDelete = await Promise.all(users.map(user => deleteUser(user)))
  console.log('Deleting:', userToDelete)
  const booksToDelete = await prisma.query.books({ where: { title: bookToCreate.title } }, '{id}')
  console.log('Deleting:', booksToDelete)
  const books = await Promise.all(booksToDelete.map(book => deleteBook(book)))
  console.log(JSON.stringify(books, null, 2))
}

const mainFunction = (async() => {
  await deleteElements()
  let book = await createBook(bookToCreate)
  console.log('Book created')
  console.log(JSON.stringify(book, null, 2))
  let usersCreated = await createUsers()
  console.log('Users created:')
  console.log(JSON.stringify(usersCreated, null, 2))
  const review1 = await prisma.mutation.createReview({
    data: {
      ...reviews[0],
      author: {
        connect: {
          username: users[0].username
        }
      },
      book: {
        connect: {
          id: book.id
        }
      }
    }
  }, '{ id text rating author { username } book { title } }')
  const review2 = await prisma.mutation.createReview({
    data: {
      ...reviews[1],
      author: {
        connect: {
          username: users[1].username
        }
      },
      book: {
        connect: {
          id: book.id
        }
      }
    },
  }, '{ id text rating author { username } book { title } }')

  console.log('Reviews:')
  console.log(JSON.stringify(review1, null, 2))
  console.log(JSON.stringify(review2, null, 2))

  const user1Deleted = await deleteUser(users[0])
  console.log('user deleted')
  console.log(JSON.stringify(user1Deleted, null, 2))
  const bookDeleted = await deleteBook(book)
  console.log('Book deleted')
  console.log(JSON.stringify(bookDeleted, null, 2))

  // End (delete all elements)
  await deleteElements()
})()


