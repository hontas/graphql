import uuidv4 from "uuid/v4";

let messages = {
  1: {
    text: "Hej tobbe",
    userId: 1
  },
  2: {
    text: "tjiena hontas",
    userId: 2,
    inResponseTo: "1"
  }
};

function createMessage({ text, userId, inResponseTo }) {
  const id = uuidv4();
  messages[id] = { text, userId, inResponseTo, createdAt: Date.now() };
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
