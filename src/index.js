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
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: GraphQLList(BookType),
      resolve: (parent) => {
        return books.filter(b => b.authorId === parent.id)
      }
    }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    books: {
      type: GraphQLList(BookType),
      description: 'All Books',
      resolve: () => books
    },
    book: {
      type: BookType,
      description: 'A single book',
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (_, { id }) => {
        return books.find(b => b.id === id)
      }
    },
    authors: {
      type: GraphQLList(AuthorType),
      description: 'All authors',
      resolve: () => authors
    },
    author: {
      type: AuthorType,
      description: 'A single author',
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (_, { id }) => {
        return authors.find(a => a.id === id)
      }
    }
  })
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mudation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Create a new book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (_, { name, authorId }) => {
        const book = {
          id: books.length + 1,
          name,
          authorId
        }
        books.push(book)
        return book
      }
    }
  })
})
const RootSchema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

server.use('/graphql', graphqlHTTP({
  schema: RootSchema,
  graphiql: true
}))

server.listen(4000, () => console.log('Server is Running'))
