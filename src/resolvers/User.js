import {getComments} from './../utils'

const User = {
  posts: (parent, args, {db}) => db.posts.filter(post => post.author === parent.id),
  comments: getComments
}

export {User as default}