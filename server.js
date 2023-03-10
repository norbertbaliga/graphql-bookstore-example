const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} = require('graphql')

const app = express()

/* ============ Test Database with sample data ============ */
const authors = require('./data/authors.json')
const books = require('./data/books.json')
/* ============ End: Test Database with sample data ============ */

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'Get a Single Book',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of All Books',
            resolve: () => books
        },
        author: {
            type: AuthorType,
            description: 'Get a Single Author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of All Authors',
            resolve: () => authors
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a Book',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) }, 
                authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const book = { 
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId
                }
                books.push(book)
                return book
            }
        },
        updateBook: {
            type: BookType,
            description: 'Update a Book by id',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }, 
                name: { type: GraphQLNonNull(GraphQLString) }, 
                authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                var bookIndex = books.findIndex(book => book.id === args.id)
                if(bookIndex > 0) {
                    books[bookIndex].name = args.name
                    books[bookIndex].authorId = args.authorId
                    return books[bookIndex]
                }
                return null
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add an Author',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                const author = { 
                    id: authors.length + 1,
                    name: args.name
                }
                authors.push(author)
                return author
            }
        },
        updateAuthor: {
            type: AuthorType,
            description: 'Update an Author by id',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }, 
                name: { type: GraphQLNonNull(GraphQLString) }, 
            },
            resolve: (parent, args) => {
                var authorIndex = authors.findIndex(author => author.id === args.id)
                if(authorIndex > 0) {
                    authors[authorIndex].name = args.name
                    return authors[authorIndex]
                }
                return null
            }
        },
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema, 
    graphiql: false
}))

app.listen(5000, () => console.log('Server is running and listening on port 5000...'))