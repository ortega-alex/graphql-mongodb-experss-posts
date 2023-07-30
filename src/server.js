const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const { connectDB } = require('./db');
const { authenticate } = require('./middlewares/auth');
const { PORT } = require('./config');

connectDB();
const app = express();

app.use(authenticate);

app.get('/', (_, res) => {
    res.send('wecome to my graphql api');
});

app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true
    })
);

app.listen(PORT);
console.log(`server on port ${PORT}`);
