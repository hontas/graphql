import uuidv4 from "uuid/v4";

let users = {
  1: {
    username: "hontas",
    fullName: "Pontus Lundin",
    email: "lundin.pontus@gmail.com",
    messageIds: [1]
  },
  2: {
    username: "TobLu",
    fullName: "Tobias Lundin",
    email: "lundin.tobias@gmail.com",
    messageIds: [2]
  }
};

function createUser({ username, email, fullName }) {
  const id = uuidv4();
  users[id] = { username, email, fullName };
  return getUser(id);
}

function createdMessage({ userId, messageId }) {
  users[userId].messageIds = [...users[userId].messageIds, messageId];
}

function deletedMessage({ userId, messageId }) {
  users[userId].messageIds = users[userId].messageIds.filter((id) => id !== messageId);
  return true;
}

function getUser(id) {
  return {
    id,
    ...users[id]
  };
}

function getUsers() {
  return Object.entries(users).map(([id, user]) => ({
    id,
    ...user
  }));
}

export default {
  createUser,
  getUser,
  getUsers,
  createdMessage,
  deletedMessage
};
