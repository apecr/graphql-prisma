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
  updateUser: (parent, { id, data }, { prisma }, info) => {

    return prisma.mutation.updateUser({
      data,
      where: { id }
    }, info)
  },
  createPost: (parent, { post }, { prisma }, info) => {
    return prisma.mutation.createPost({
      data: {
        ...post,
        author: {
          connect: {
            id: post.author
          }
        }
      }
    }, info)
  },
  deletePost: (parent, { id }, { prisma }, info) => {
    return prisma.mutation.deletePost({
      where: {
        id
      }
    }, info)
  },
  updatePost: (parent, { id, data }, { prisma }, info) => {
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
