const { AuthenticationError } = require('apollo-server-express');
const { Book,User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('books');
    },
    getSingleUser: async(parent, { user = null, params }) => {
      const foundUser = await User.findOne({
        $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
      });
  
      if (!foundUser) {
        throw new AuthenticationError('Something is Wrong!');
      }
  
      return foundUser;
    },
  },
  Mutation: {
    createUser: async(parent, { body }) => {
      const user = await User.create(body);
      if (!user) {
        throw new AuthenticationError('Something is Wrong!');
      }
      const token = signToken(user);
      return { token, user };
    },

    login: async(parent, { body }) => {
      const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
      },

    saveBook: async(parent, { user, body }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      );
      if (!updatedUser){
        throw new AuthenticationError('You need to be logged in!');
      }
      return updatedUser;
    },

    deleteBook: async(parent, { user, params }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new AuthenticationError('You need to be logged in!');
      }
      return updatedUser;
    },
  }
};

module.exports = resolvers;