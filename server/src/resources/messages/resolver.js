import { UserInputError, ForbiddenError } from "apollo-server-express";
import { combineResolvers } from 'graphql-resolvers';

import { isAuthenticated } from '../../lib/auth';
import messages from "./controller";
import users from "../users/controller";

async function isOwner(parent, { id }, { user }) {
  const { userId } = await messages.getMessage(id);
  if (userId !== user.id) {
    throw new ForbiddenError('Not authenticated as owner');
  }
}

export default {
  Query: {
    message: (parent, { id }) => messages.getMessage(id),
    messages: () => messages.getMessages().filter(({ inResponseTo }) => !inResponseTo)
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      (parent, { text, userId, inResponseTo }) => {
        if (!userId || !users.getUser(userId)) {
          throw new UserInputError("No user specified", { invalidArgs: "userId" });
        }
        const newMessage = messages.createMessage({ text, userId, inResponseTo });
        users.createdMessage({ userId, messageId: newMessage.id });
        return newMessage;
      }
    ),

    updateMessage: combineResolvers(
      isAuthenticated,
      isOwner,
      (parent, { id, text }) => {
        if (!messages.getMessage(id)) {
          throw new UserInputError("404 not found", { invalidArgs: "id" });
        } else {
          return messages.updateMessage(id, text);
        }
      }
    ),

    deleteMessage: combineResolvers(
      isAuthenticated,
      isOwner,
      (parent, { id }) => {
        const msgToDelete = messages.getMessage(id);
        if (!msgToDelete) return true;
        const { userId } = msgToDelete;
        return messages.deleteMessage(id) && users.deletedMessage({ userId, messageId: id });
      }
    )
  },

  Message: {
    user: ({ userId }) => users.getUser(userId),
    responses: ({ id }) =>
      messages.getMessages().filter(({ inResponseTo }) => inResponseTo && inResponseTo === id)
  }
};
