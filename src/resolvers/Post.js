import {getAuthor, getCommentsFromPost} from './../utils'

const Post = {
  author: getAuthor,
  comments: getCommentsFromPost
}

export {Post as default}