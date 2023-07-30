const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = require('graphql');
const { User, Post, Comment } = require('../models');

const UserType = new GraphQLObjectType({
    name: 'UserType',
    description: 'The user type',
    fields: {
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        displayName: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        upadtedAt: { type: GraphQLString }
    }
});

const PostType = new GraphQLObjectType({
    name: 'PostType',
    description: 'The post type',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        body: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        upadtedAt: { type: GraphQLString },
        author: {
            type: UserType,
            resolve: parent => User.findById(parent.authorId)
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve: parent => Comment.find({ postId: parent.id })
        }
    })
});

const CommentType = new GraphQLObjectType({
    name: 'CommentType',
    description: 'The comment type',
    fields: {
        id: { type: GraphQLID },
        comment: { type: GraphQLString },
        user: {
            type: UserType,
            resolve: parent => User.findById(parent.userId)
        },
        post: {
            type: PostType,
            resolve: parent => Post.findById(parent.postId)
        },
        createdAt: { type: GraphQLString },
        upadtedAt: { type: GraphQLString }
    }
});

module.exports = { UserType, PostType, CommentType };
