const matchAgainstSeveralElements = (arrElements, query) =>
  arrElements
    .reduce((acc, element) =>
      element.toLowerCase().includes(query.toLowerCase()) || acc, false)

const checkElementsFromArrayAndThrowError = (arrayOfElements, comparation, errorMessage, any = false) => {
  const checkElements = arrayOfElements.some(comparation) // check the elements some aplies the function
  if ((any && checkElements) || (!any && !checkElements)) {
    throw new Error(errorMessage)
  }
}

const getAuthor = (parent, args, {db}) => db.users.find(user => user.id === parent.author)
const getPost = (parent, args, {db}) => db.posts.find(post => post.id === parent.post)
const getComments = (parent, args, {db}) => db.comments.filter(comment => comment.author === parent.id)
const getCommentsFromPost = (parent, args, {db}) => db.comments.filter(comment => comment.post === parent.id)
const checkUserId = author => user => user.id === author

export {
  matchAgainstSeveralElements,
  checkElementsFromArrayAndThrowError,
  getAuthor,
  getPost,
  getComments,
  getCommentsFromPost,
  checkUserId
}