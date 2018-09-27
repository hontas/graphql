import { generatePasswordHash, createToken } from "../../lib/auth";
import users from "./controller";
import messages from "../messages/controller";

export default {
  Query: {
    me: () => users.getUser("1"),
    user: (parent, { id }) => users.getUser(id),
    users: () => users.getUsers()
  },

  Mutation: {
    async signUp(parent, { username, email, password }) {
      const passwordHash = await generatePasswordHash(password, saltRounds);
      const user = users.createUser({ username, email, password: passwordHash });
      const token = await createToken(user);
      return { token };
    }
  },

  User: {
    messages: ({ messageIds = [] }) => messageIds.map(messages.getMessage)
  }
};
