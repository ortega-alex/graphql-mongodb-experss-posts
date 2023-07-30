const { GraphQLString, GraphQLID, GraphQLNonNull } = require('graphql');
const { User, Post, Comment } = require('../models');
const createJWTToken = require('../utilities/auth');
const { PostType, CommentType } = require('./types');
const { bcrypt } = require('../utilities');

const register = {
    type: GraphQLString,
    description: 'Register a new user',
    args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        displayName: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_, args) {
        const { username, email, password, displayName } = args;
        // const newUser = await User.create({ username, email, password, displayName }); // una forma de crearlo
        const user = new User({ username, email, password, displayName });
        user.password = await bcrypt.encryptPassword(user.password);
        await user.save();
        const token = createJWTToken({ _id: user._id, email, displayName });
        return token;
    }
};

const login = {
    type: GraphQLString,
    description: 'Login a user and returns a token',
    args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_, { email, password }) {
        const user = await User.findOne({ email }).select('+password');

        if (!user) throw new Error('Invalid Username');
        const validPassword = await bcrypt.comparePassword(password, user.password);
        if (!validPassword) throw new Error('Invalid Password');

        const token = createJWTToken({
            _id: user._id,
            email: user.email,
            displayName: user.displayName
        });

        return token;
    }
};

const createPost = {
    type: PostType,
    description: 'Create a new post',
    args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_, { title, body }, { verifiedUser }) {
        const post = new Post({
            title,
            body,
            authorId: verifiedUser?._id
        });
        await post.save();
        return post;
    }
};

const updatePost = {
    type: PostType,
    description: 'Update a post',
    args: {
        id: { type:  new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull( GraphQLString) },
        body: { type:  new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_, { id, title, body }, { verifiedUser }) {
        if (!verifiedUser) throw new Error('Unauthorized');
        const updatedPost = await Post.findOneAndUpdate(
            { _id: id, authorId: verifiedUser._id },
            { title, body },
            { new: true, runValidator: true }
        );
        return updatedPost;
    }
};

const deletePost = {
    type: GraphQLString,
    description: 'Deleted a post',
    args: {
        postId: { type:  new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_, { postId }, { verifiedUser }) {
        if (!verifiedUser) throw new Error('Unauthorized');
        const postDelete = await Post.findOneAndDelete({ _id: postId, authorId: verifiedUser._id });
        if (!postDelete) throw new Error('Post not found');
        return 'Post deleted';
    }
};

const addComment = {
    type: CommentType,
    description: 'Create a new comment',
    args: {
        comment: { type:  new GraphQLNonNull(GraphQLString) },
        postId: { type:  new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_, { comment, postId }, { verifiedUser }) {
        const newComment = new Comment({
            comment,
            postId,
            userId: verifiedUser?._id
        });
        await newComment.save();
        return newComment;
    }
};

const updateComment = {
    type: CommentType,
    description: 'Comment a post',
    args: {
        id: { type: new GraphQLNonNull( GraphQLID) },
        comment: { type:  new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_, { id, comment }, { verifiedUser }) {
        if (!verifiedUser) throw new Error('Unauthorized');
        const updatedComment = await Comment.findOneAndUpdate(
            { _id: id, userId: verifiedUser._id },
            { comment },
            { new: true, runValidator: true }
        );
        if (!updatedComment) throw new Error('Comment not fount');
        return updatedComment;
    }
};

const deleteComment = {
    type: GraphQLString,
    description: 'Deleted a comment',
    args: {
        commentId: { type:  new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_, { commentId }, { verifiedUser }) {
        if (!verifiedUser) throw new Error('Unauthorized');
        const commentDelete = await Comment.findOneAndDelete({ _id: commentId, userId: verifiedUser._id });
        if (!commentDelete) throw new Error('Post not found');
        return 'Comment deleted';
    }
};

module.exports = { register, login, createPost, updatePost, deletePost, addComment, updateComment, deleteComment };
