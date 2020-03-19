/* eslint-disable new-cap */
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'
import { SECRET } from './../utils/utils'

const  checkPostForUserId = async(request, prisma, id, errorMessage) => {
  const userId = getUserId(request)
  const postExist = await prisma.exists.Post({
    id,
    author: {
      id: userId
    }
  })
  if (!postExist) {
    throw new Error(errorMessage)
  }
  return userId
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
      token: jwt.sign({userId: user.id}, SECRET)
    }
  },
  createUser: async(parent, { data }, { prisma }, info) => {
    if (data.password.length < 8) {
      throw new Error('Password must be 8 characters or longer')
    }
    const hashPassword = await bcrypt.hash(data.password, 10)
    const emailTaken = await prisma.exists.User({ email: data.email })
    if (emailTaken) {
      throw new Error('Email taken')
    }
    const user =  await prisma.mutation.createUser(
      {
        data: {
          ...data,
          password: hashPassword
        }
      })
    return {
      user,
      token: jwt.sign({userId: user.id}, SECRET)
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
  updateUser: (parent, { data }, { prisma, request }, info) => {
    const userId = getUserId(request)

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
    await checkPostForUserId(request, prisma, id, 'Unable to delete the post')

    return prisma.mutation.deletePost({
      where: {
        id
      }
    }, info)
  },
  updatePost: async(parent, { id, data }, { prisma, request }, info) => {
    await checkPostForUserId(request, prisma, id, 'Unable to update the post')
    return prisma.mutation.updatePost({
      data,
      where: {
        id
      }
    }, info)
  },
  createComment: (parent, { comment }, { prisma }, info) => {
    return prisma.mutation.createComment({
      data: {
        ...comment,
        author: {
          connect: {
            id: comment.author
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
  deleteComment: (parent, { id }, { prisma }, info) => {
    return prisma.mutation.deleteComment({
      where: {id}
    }, info)
  },
  updateComment: (parent, { id, data }, { prisma }, info) => {
    return prisma.mutation.updateComment({
      where: {id},
      ...data
    }, info)
  }
}

export { Mutation as default }