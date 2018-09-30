import uuidv4 from "uuid/v4";

const messages = {};

function createMessage({ text, userId, inResponseTo }) {
  const id = uuidv4();
  const inResponseToMsg = inResponseTo && getMessage(inResponseTo);
  const responseId = inResponseToMsg && inResponseToMsg.inResponseTo || inResponseTo;
  messages[id] = {
    text,
    userId,
    inResponseTo: responseId,
    createdAt: Date.now()
  };
  return getMessage(id);
}

function updateMessage(id, text) {
  messages[id] = {
    ...messages[id],
    text,
    updatedAt: Date.now()
  };
  return getMessage(id);
}

function deleteMessage(id) {
  const { [id]: message, ...otherMessages } = messages;
  if (!message) return false;
  messages = otherMessages;
  return true;
}

function getMessage(id) {
  if (!messages[id]) return null;
  return {
    id,
    ...messages[id]
  };
}

function getMessages() {
  return Object.entries(messages).map(([id, message]) => ({
    id,
    ...message
  }));
}

export default {
  createMessage,
  updateMessage,
  deleteMessage,
  getMessage,
  getMessages
};
