const { expect } = require('chai');
const { request, createUser, signIn, deleteUser } = require('./helpers');

const userOne = {
  email: 'hontas@gmail.com',
  username: 'poca',
  password: 'pocaPass',
  fullName: 'Poca Hontas'
};

describe('users', () => {
  let token;

  describe('createUser', () => {
    it('should create a new user and return token', async () => {
      const resp = await createUser(userOne);
      expect(resp.errors).to.be.undefined;
      expect(resp.data.createUser).to.have.property('token').that.is.a('string');
      expect(resp.data.createUser).to.have.property('id').that.is.a('string');
      token = resp.data.createUser.token;
      userOne.id = resp.data.createUser.id;
    });
  });

  describe('signIn', () => {
    it('should return token', async () => {
      const resp = await signIn(userOne);
      expect(resp.errors).to.be.undefined;
      expect(resp.data.signIn).to.have.property('token').that.is.a('string');
      token = resp.data.signIn.token;
    });
  });

  describe('getUser', () => {
    it('should return one user', async () => {
      const query = `
        query ($id: ID!) {
          user(id: $id) {
            id
          }
        }`;
      const resp = await request(query, { id: userOne.id });
      expect(resp.errors).to.be.undefined;
      expect(resp.data.user).to.be.an('object');
      expect(resp.data.user).to.have.property('id', userOne.id);
    });
  });

  describe('getUsers', () => {
    it('should return list of users', async () => {
      const query = `{ users { id } }`;
      const resp = await request(query);
      expect(resp.errors).to.be.undefined;
      expect(resp.data.users).to.be.an('array');
      const match = resp.data.users.find(({ id }) => id === userOne.id);
      expect(match).to.eql({ id: userOne.id });
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return true', async () => {
      const resp = await deleteUser(userOne.id, token);
      expect(resp.errors).to.be.undefined;
      expect(resp.data.deleteUser).to.be.true
    });
  });
});
