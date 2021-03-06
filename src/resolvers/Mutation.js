/* eslint-disable new-cap */
import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from './../utils/generateToken'
import hashPassword from './../utils/hashPassword'

const checkPost = async(id, userId, prisma, errorMessage) => {
  const postExist = await prisma.exists.Post({
    id,
    author: {
      id: userId
    }
  })
  if (!postExist) {
    throw new Error(errorMessage)
  }
  return postExist
}


const checkComment = async(id, userId, prisma, errorMessage) => {
  const commentExist = await prisma.exists.Comment({
    id,
    author: {
      id: userId
    }
  })
  if (!commentExist) {
    throw new Error(errorMessage)
  }
  return commentExist
}

const checkFunctions = {
  'comment': checkComment,
  'post': checkPost
}

const  checkElementForUserId = async(request, prisma, id, errorMessage, typeDef) => {
  const userId = getUserId(request)
  return await checkFunctions[typeDef](id, userId, prisma, errorMessage)
}

const Mutation = {
  login: async(parent, { data }, { prisma }, info) => {
    const user = await prisma.query.user({
      where: {
        email: data.email
      }
    })
    if (!user) {
      throw new Error('Authentication failed')
    }
    const isMatch = await bcrypt.compare(data.password, user.password)
    if (!isMatch) {
      throw new Error('Authentication failed')
    }

    return {
      user,
      token: generateToken(user.id)
    }
  },
  createUser: async(parent, { data }, { prisma }, info) => {
    const password = await hashPassword(data.password)
    const emailTaken = await prisma.exists.User({ email: data.email })
    if (emailTaken) {
      throw new Error('Email taken')
    }
    const user =  await prisma.mutation.createUser(
      {
        data: {
          ...data,
          password
        }
      })
    return {
      user,
      token: generateToken(user.id)
    }

  },
  deleteUser: async(parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)
    const existUser = await prisma.exists.User({ id: userId })
    if (!existUser) {
      throw new Error('User does not exist')
    }

    return prisma.mutation.deleteUser({where: { id: userId }}, info)
  },
  updateUser: async(parent, { data }, { prisma, request }, info) => {
    const userId = getUserId(request)

    if (typeof data.password === 'string') {
      data.password = await hashPassword(data.password)
    }

    return prisma.mutation.updateUser({
      data,
      where: { id: userId }
    }, info)
  },
  createPost: (parent, { post }, { prisma, request }, info) => {
    const userId = getUserId(request)
    return prisma.mutation.createPost({
      data: {
        ...post,
        author: {
          connect: {
            id: userId
          }
        }
      }
    }, info)
  },
  deletePost: async(parent, { id }, { prisma, request }, info) => {
    await checkElementForUserId(request, prisma, id, 'Unable to delete the post', 'post')

    return prisma.mutation.deletePost({
      where: {
        id
      }
    }, info)
  },
  updatePost: async(parent, { id, data }, { prisma, request }, info) => {
    await checkElementForUserId(request, prisma, id, 'Unable to update the post', 'post')
    const previousPostPublished = await prisma.exists.Post({ id, published: true})
    if (previousPostPublished && data.published === false) {
      const numberOfDeleteComments = await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id
          }
        }
      })
      console.log(JSON.stringify(numberOfDeleteComments, null, 2))
      console.log(`Deleting ${numberOfDeleteComments.count} comments`)
    }
    return prisma.mutation.updatePost({
      data,
      where: {
        id
      }
    }, info)
  },
  createComment: async(parent, { comment }, { prisma, request }, info) => {
    const userId = getUserId(request)
    const postExist = await prisma.exists.Post({ id: comment.post, published: true })
    if (!postExist) {
      throw new Error('Post not published')
    }
    return prisma.mutation.createComment({
      data: {
        ...comment,
        author: {
          connect: {
            id: userId
          }
        },
        post: {
          connect: {
            id: comment.post
          }
        }
      }
    }, info)
  },
  deleteComment: async(parent, { id }, { prisma, request }, info) => {
    await checkElementForUserId(request, prisma, id, 'Unable to delete the comment', 'comment')
    return prisma.mutation.deleteComment({
      where: {id}
    }, info)
  },
  updateComment: async(parent, { id, data }, { prisma, request }, info) => {
    await checkElementForUserId(request, prisma, id, 'Unable to update the comment', 'comment')
    return prisma.mutation.updateComment({
      where: {id},
      ...data
    }, info)
  }
}

export { Mutation as default }