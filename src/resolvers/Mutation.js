/* eslint-disable new-cap */
import uuidv4 from 'uuid/v4'
import { checkElementsFromArrayAndThrowError, checkUserId } from './../utils'

const Mutation = {
  createUser: async(parent, { data }, { prisma }, info) => {
    const emailTaken = await prisma.exists.User({ email: data.email })
    if (emailTaken) {
      throw new Error('Email taken')
    }
    return await prisma.mutation.createUser(
      {
        data
      },
      info
    )
  },
  deleteUser: async(parent, { id }, { prisma }, info) => {
    const existUser = await prisma.exists.User({ id })
    if (!existUser) {
      throw new Error('User does not exist')
    }

    return prisma.mutation.deleteUser({where: { id }}, info)
  },
  updateUser: (parent, { id, data }, { db }, info) => {
    const userToUpdate = db.users.find(user => user.id === id)

    if (!userToUpdate) {
      throw new Error('User not found')
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email)
      if (emailTaken) {
        throw new Error('Email in use')
      }
      userToUpdate.email = data.email
    }

    if (typeof data.name === 'string') {
      userToUpdate.name = data.name
    }

    if (typeof data.age !== undefined) {
      userToUpdate.age = data.age
    }

    return userToUpdate
  },
  deletePost: (parent, { id }, { db, pubsub }) => {
    const postIndex = db.posts.findIndex(post => post.id === id)
    if (postIndex === -1) {
      throw new Error('Post not found')
    }
    const [ deletedPost ] = db.posts.splice(postIndex, 1)

    db.comments = db.comments.filter(comment => comment.post !== id)

    if (deletedPost.published === true) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: deletedPost
        }
      })
    }

    return deletedPost
  },
  createPost: (parent, { post }, { db, pubsub }) => {
    checkElementsFromArrayAndThrowError(
      db.users,
      checkUserId(post.author),
      'User does not exist'
    )
    const newPost = { ...post, id: uuidv4() }
    db.posts.push(newPost)
    if (newPost.published === true) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: newPost
        }
      })
    }
    return newPost
  },
  updatePost: (parent, { id, data }, { db, pubsub }, info) => {
    const postToUpdate = db.posts.find(post => post.id === id)
    const originalPost = { ...postToUpdate }

    if (!postToUpdate) {
      throw new Error('Post not found')
    }

    if (typeof data.title === 'string') {
      postToUpdate.title = data.title
    }

    if (typeof data.body === 'string') {
      postToUpdate.body = data.body
    }

    if (typeof data.published === 'boolean') {
      postToUpdate.published = data.published
      if (originalPost.published && !postToUpdate.published) {
        // deleted
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      } else if (!originalPost.published && postToUpdate.published) {
        // created
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: postToUpdate
          }
        })
      }
    } else if (postToUpdate.published) {
      // updated
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: postToUpdate
        }
      })
    }

    return postToUpdate
  },
  createComment: (parent, { comment }, { db, pubsub }) => {
    const { text, author, post } = comment
    checkElementsFromArrayAndThrowError(
      db.users,
      checkUserId(author),
      'User does not exist'
    )
    checkElementsFromArrayAndThrowError(
      db.posts,
      postA => postA.id === post && postA.published === true,
      'Post does not exist or is not published'
    )
    const newComment = {
      id: uuidv4(),
      text,
      author,
      post
    }
    db.comments.push(newComment)
    pubsub.publish(`comment ${post}`, {
      comment: {
        mutation: 'CREATED',
        data: newComment
      }
    })
    return newComment
  },
  updateComment: (parent, { id, data }, { db, pubsub }, info) => {
    const commentToUpdate = db.comments.find(comment => comment.id === id)

    if (!commentToUpdate) {
      throw new Error('Comment not found')
    }

    if (typeof data.text === 'string') {
      commentToUpdate.text = data.text
    }
    pubsub.publish(`comment ${commentToUpdate.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: commentToUpdate
      }
    })

    return commentToUpdate
  },
  deleteComment: (parent, { id }, { db, pubsub }) => {
    const commentIndex = db.comments.findIndex(comment => comment.id === id)

    if (commentIndex === -1) {
      throw new Error('Comment not found')
    }
    pubsub.publish(`comment ${db.comments[commentIndex].post}`, {
      comment: {
        mutation: 'DELETED',
        data: db.comments[commentIndex]
      }
    })
    return db.comments.splice(commentIndex, 1)[0]
  }
}

export { Mutation as default }
