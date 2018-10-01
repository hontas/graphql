import uuidv4 from "uuid/v4";
import { generatePasswordHash } from "../../lib/auth";

const users = {};

async function createUser({ username, email, fullName, password }) {
  const id = uuidv4();
  const passwordHash = await generatePasswordHash(password);
  users[id] = {
    username,
    email,
    password: passwordHash,
    fullName,
    createdAt: Date.now(),
    messageIds: []
  };
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
  return users[id] ? {
    id,
    ...users[id]
  } : null;
}

function getUserBy(props) {
  const entries = Object.entries(props);

  const match = Object.entries(users).find(([_, user]) => {
    return entries.every(([key, val]) => user[key] === val);
  });

  return match ? getUser(match[0]) : null;
}

function getUsers() {
  return Object.entries(users).map(([id, user]) => ({
    id,
    ...user
  }));
}

function deleteUser(id) {
  delete users[id];
  return true;
}

export default {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  getUserBy,
  createdMessage,
  deletedMessage
};
