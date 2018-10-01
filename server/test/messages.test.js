const { expect } = require('chai');
const { request, createUser, deleteUser, getAuthHeader } = require('./helpers');

const messageOne = {
  text: 'Hur fan skarom stoppa oss nuuuu?'
};

describe('messages', () => {
  let token;
  let user;

  before(async () => {
    const { data } = await createUser();
    token = data.createUser.token;
    user = { id: data.createUser.id };
  });

  after(() => deleteUser(user.id, token));

  describe('createMessage', () => {
    it('should create a new message and tie it to a user', async () => {
      const query = `
        mutation ($text: String!, $userId: ID!, $inResponseTo: ID) {
          createMessage(text: $text, userId: $userId, inResponseTo: $inResponseTo) {
            id
            text
          }
        }`;
      const variables = { ...messageOne, userId: user.id };
      const headers = getAuthHeader(token);

      const resp = await request(query, variables, headers);
      expect(resp.errors).to.be.undefined;
      expect(resp.data.createMessage).to.have.property('id').that.is.a('string');
      expect(resp.data.createMessage).to.have.property('text', messageOne.text);
      messageOne.id = resp.data.createMessage.id;
    });
  });

  describe.skip('getMessage', () => {
    it('should return one message', async () => {
      const query = `
        query ($id: ID!) {
          message(id: $id) {
            id
          }
        }`;
      const resp = await request(query, { id: messageOne.id });
      expect(resp.errors).to.be.undefined;
      expect(resp.data.user).to.be.an('object');
      expect(resp.data.user).to.have.property('id', userOne.id);
    });
  });

  describe.skip('getUsers', () => {
    it('should return list of users', async () => {
      const query = `{ users { id } }`;
      const resp = await request(query);
      expect(resp.errors).to.be.undefined;
      expect(resp.data.users).to.be.an('array');
      const match = resp.data.users.find(({ id }) => id === userOne.id);
      expect(match).to.eql({ id: userOne.id });
    });
  });

  describe.skip('deleteUser', () => {
    it('should delete user and return true', async () => {
      const query = `
      mutation ($id: ID!) {
        deleteUser(id: $id)
      }`;
      const headers = { authorization: `Bearer ${token}` };
      const resp = await request(query, { id: userOne.id }, headers);
      expect(resp.errors).to.be.undefined;
      expect(resp.data.deleteUser).to.be.true
    });
  });
});
