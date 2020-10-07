const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')

const server = express()

const books = [
  { id: 1, name: 'Book 1', authorId: 1 },
  { id: 2, name: 'Book 2', authorId: 1 },
  { id: 3, name: 'Book 3', authorId: 2 },
  { id: 4, name: 'Book 4', authorId: 2 },
]

const authors = [
  { id: 1, name: 'Author 1' },
  { id: 2, name: 'Author 2' },
]

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'A Book',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLInt },
    author: {
      type: AuthorType,
      resolve: (parent) => {
        return authors.find(a => a.id === parent.authorId)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'An Author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) }
  })
})

const RootSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Root',
    fields: () => ({
      books: {
        type: GraphQLList(BookType),
        description: 'All Books',
        resolve: () => books
      },
      authors: {
        type: GraphQLList(AuthorType),
        description: 'All authors',
        resolve: () => authors
      }
    })
  })
})

server.use('/graphql', graphqlHTTP({
  schema: RootSchema,
  graphiql: true
}))

server.listen(4000, () => console.log('Server is Running'))
