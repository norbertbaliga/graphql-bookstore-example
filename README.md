# GraphQL Bookstore Example

This repository contains code of the example GraphQL application presented in the [Learn GraphQL In 40 Minutes](https://www.youtube.com/watch?v=ZQL7tL2S0oQ) YouTube video.

The code can also be found on GitHub: https://github.com/WebDevSimplified/Learn-GraphQL. Some changes have been made along the way. The followings were added/modified:
- Using `require('express-graphql').graphqlHTTP` due to lib changes
- Implemented updateBook feature to modify an existing book by id
- Implemented updateAuthor feature to modify an existing author by id
- Moved sample data from server.js into individual JSON files