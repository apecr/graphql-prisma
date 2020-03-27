import ApolloBoost from 'apollo-boost'

const getClient = (jwt = null) => {
  return new ApolloBoost({
    uri: 'http://localhost:4000',
    request: operation => {
      if (jwt !== null) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        })
      }
    }
  })
}

export { getClient as default }