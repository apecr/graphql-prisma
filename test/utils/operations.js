import { gql } from 'apollo-boost'

const createUser = gql`
  mutation($data: CreateUserInput!){
          createUser(data: $data){
              token
              user{
                id
              }
          }
      }
`

const getUsers = gql`
    query{
      users{
        id
        name
        email
      }
    }
  `

const login = gql`
    mutation($data: LoginUserInput!){
      login(data: $data){
        token
      }
    }
  `

const getProfile = gql`
    query{
      me{
        id
        name
        email
      }
    }
  `
const getPosts = gql`
    query{
        posts{
            id
            title
            body
            published
        }
    }
`

const getMyPosts = gql`
    query{
      myPosts{
        id
        title
        body
        published
      }
    }
  `

const updatePost = gql`
    mutation($id: ID!, $data: UpdatePostInput){
      updatePost(
        id: $id,
        data: $data
      ){
        id
        title
        body
        published
      }
    }
  `

const createPost = gql`
    mutation($post: CreatePostInput!){
      createPost(
        post: $post
      ){
        id
        title
        body
        published
      }
    }
  `

const deletePost = gql`
    mutation($id: ID!){
      deletePost(id: $id){
        id
        title
      }
    }
  `

const deleteComment = gql`
    mutation($id: ID!){
        deleteComment(id: $id){
            id
            text
        }
    }
`

const subscribeToComments = gql`
    subscription($postId: ID!){
        comment(postId: $postId){
            mutation
            node{
                id
                text
            }
        }
    }
`

const subscribeToPosts = gql`
    subscription{
        post{
            mutation
            node{
                id
                title
            }
        }
    }
`

export { createUser, login, getUsers, getProfile, deletePost, createPost, updatePost, getMyPosts, getPosts, deleteComment, subscribeToComments, subscribeToPosts}