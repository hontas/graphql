import { UserInputError } from "apollo-server-express";

import messages from "./controller";
import users from "../users/controller";

export default {
  Query: {
    message: (parent, { id }) => messages.getMessage(id),
    messages: () => messages.getMessages().filter(({ inResponseTo }) => !inResponseTo)
  },

  Mutation: {
    createMessage(parent, { text, userId, inResponseTo }) {
      const newMessage = messages.createMessage({ text, userId, inResponseTo });
      users.createdMessage({ userId, messageId: newMessage.id });
      return newMessage;
    },
    updateMessage(parent, { id, text }) {
      if (!messages.getMessage(id)) {
        throw new UserInputError("404 not found", { invalidArgs: "id" });
      } else {
        return messages.updateMessage(id, text);
      }
    },
    deleteMessage(parent, { id }) {
      const { userId } = messages.getMessage(id);
      return messages.deleteMessage(id) && users.deletedMessage({ userId, messageId: id });
    }
  },

  Message: {
    user: ({ userId }) => users.getUser(userId),
    responses: ({ id }) =>
      messages.getMessages().filter(({ inResponseTo }) => inResponseTo && inResponseTo === id)
  }
};
