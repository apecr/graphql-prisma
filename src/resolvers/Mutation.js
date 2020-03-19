/* eslint-disable new-cap */
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const Mutation = {
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
      token: jwt.sign({userId: user.id}, 'thisisasecret')
    }

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
