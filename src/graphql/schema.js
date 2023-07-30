const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const { users, user, posts, post, comments, comment } = require('./queys');
const { register, login, createPost, updatePost, deletePost, addComment, updateComment, deleteComment } = require('./mutation');

const RootType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'The root query type',
    fields: {
        users,
        user,
        posts,
        post,
        comments,
        comment
    }
});

const MutationType = new GraphQLObjectType({
    name: 'MutationType',
    description: 'The root mutation type',
    fields: {
        register,
        login,
        createPost,
        updatePost,
        deletePost,
        addComment,
        updateComment,
        deleteComment
    }
});

module.exports = new GraphQLSchema({
    query: RootType,
    mutation: MutationType
});
