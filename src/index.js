import '@babel/polyfill/noConflict'
import server from './server'

server.start({ port: process.env.PORT || 4000 },  _ => console.log('server is running'))