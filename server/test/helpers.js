const request = require('request-promise');
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
  const query = `
    mutation ($email: String!, $username: String!, $password: String!, $fullName: String) {
      createUser(email: $email, username: $username, password: $password, fullName: $fullName) {
        id
        token
      }
    }`;

  return makeReq(query, user);
}

function signIn(user = baseUser) {
  const query = `
    mutation ($email: String!, $password: String!) {
      signIn(email: $email, password: $password) {
        token
      }
    }`;

  return makeReq(query, user);
}

function deleteUser(id, token) {
  const query = `
    mutation ($id: ID!) {
      deleteUser(id: $id)
    }`;
  const headers = getAuthHeader(token);
  return makeReq(query, { id }, headers);
}

function getAuthHeader(token) {
  return { authorization: `Bearer ${token}` };
}

module.exports = {
  createUser,
  deleteUser,
  signIn,
  getAuthHeader,
  request: makeReq
};
