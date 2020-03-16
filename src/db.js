const users = [{
  id: '1',
  name: 'Andrew',
  email: 'andrew@example.com',
  age: 27
}, {
  id: '2',
  name: 'Sara',
  email: 'sara@example.com'
}, {
  id: '3',
  name: 'Mike',
  email: 'mike@example.com'
}]

// Demo post data
const posts = [{
  id: '123456',
  title: 'Apertura Española',
  body: 'Defensa española, lucha contra la defensa berlinesa',
  published: true,
  author: '1'
}, {
  id: '123457',
  title: 'Defensa Francesa',
  body: 'La francesa, el contraataque en el centro',
  published: true,
  author: '2'
}, {
  id: '123458',
  title: 'Apertura Catalana',
  body: 'Los entresijos de la catalana',
  published: false,
  author: '3'
}, {
  id: '123459',
  title: 'Defensa Siciliana',
  body: 'Variante Paulsen',
  published: true,
  author: '1'
}, {
  id: '123460',
  title: 'Defensa Siciliana',
  body: 'Variante Najdorf',
  published: false,
  author: '2'
}, {
  id: '123461',
  title: 'Defensa Siciliana',
  body: 'Ataque inglés',
  published: true,
  author: '1'
}]

// Demo comments data
const comments = [{
  id: '1',
  text: 'Comment number one',
  author: '1',
  post: '123456'
}, {
  id: '2',
  text: 'Comment number two',
  author: '2',
  post: '123456'
}, {
  id: '3',
  text: 'Comment for the number three post',
  author: '1',
  post: '123457'
}, {
  id: '4',
  text: 'This is comment number four. No more comments for the moment',
  author: '3',
  post: '123458'
}]

const db = {comments, users, posts}

export {db}