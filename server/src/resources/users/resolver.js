import { AuthenticationError, UserInputError } from "apollo-server-express";
import { combineResolvers } from 'graphql-resolvers';

import { createToken, validatePassword, isAuthenticated } from "../../lib/auth";
import users from "./controller";
import messages from "../messages/controller";

export default {
  Query: {
    user: async (parent, { id }) => await users.getUser(id),
    users: async () => await users.getUsers()
  },

  Mutation: {
    async createUser(parent, { username, email, fullName, password }) {
      const emailTaken = await users.getUserBy({ email });
      if (emailTaken) throw new UserInputError("Email taken", { invalidArgs: "email" });
      const usernameTaken = await users.getUserBy({ username });
      if (usernameTaken) throw new UserInputError("Username taken", { invalidArgs: "username" });

      const user = await users.createUser({ username, email, password, fullName });
      const token = await createToken(user);
      return { token, id: user.id };
    },

    async signIn(parent, { email, password }) {
      const user = await users.getUserBy({ email });
      if (!user) throw new AuthenticationError('Authentication error');
      const isValid = await validatePassword(password, user.password);
      if (!isValid) throw new AuthenticationError('Authentication error');

      const token = await createToken(user);
      return { token };
    },

    deleteUser: combineResolvers(
      isAuthenticated,
      (parent, { id }, { user }) => {
        if (id !== user.id) throw new ForbiddenError('Not authenticated as owner');
        return users.deleteUser(id);
      }
    )
  },

  User: {
    messages: async ({ messageIds = [] }) => await Promise.all(messageIds.map(messages.getMessage))
  }
};
