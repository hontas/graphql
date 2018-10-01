const request = require('request-promise');
const queries = require('../../common/queries');
const baseUrl = process.env.BASE_URL || 'http://localhost:8000';

const baseUser = {
  email: 'hontas@gmail.com',
  username: 'poca',
  password: 'pocaPass',
  fullName: 'Poca Hontas'
};

const makeReq = (query, variables = {}, headers = {}) =>
  request.post({
    baseUrl,
    uri: '/graphql',
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    body: {
      query,
      variables
    },
    json: true
  });

function createUser(user = baseUser) {
  return makeReq(queries.createUser, user);
}

function createMessage(variables, token) {
  return makeReq(queries.createMessage, variables, getAuthHeader(token));
}

function deleteMessage(id, token) {
  return makeReq(queries.deleteMessage, { id }, getAuthHeader(token));
}

function signIn(user = baseUser) {
  return makeReq(queries.signIn, user);
}

function deleteUser(id, token) {
  return makeReq(queries.deleteUser, { id }, getAuthHeader(token));
}

function getAuthHeader(token) {
  return { authorization: `Bearer ${token}` };
}

module.exports = {
  createUser,
  deleteUser,
  signIn,
  createMessage,
  deleteMessage,
  getAuthHeader,
  request: makeReq
};
