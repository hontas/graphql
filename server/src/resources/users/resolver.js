import { createToken } from "../../lib/auth";
import users from "./controller";
import messages from "../messages/controller";

export default {
  Query: {
    me: async () => await users.getUser("1"),
    user: async (parent, { id }) => await users.getUser(id),
    users: async () => await users.getUsers()
  },

  Mutation: {
    async signUp(parent, { username, email, fullName, password }) {
      const user = await users.createUser({ username, email, password, fullName });
      const token = await createToken(user);
      return { token };
    }
  },

  User: {
    messages: async ({ messageIds = [] }) => await Promise.all(messageIds.map(messages.getMessage))
  }
};
