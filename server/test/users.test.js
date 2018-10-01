const { expect } = require('chai');
const { request, createUser, signIn, deleteUser } = require('./helpers');
const queries = require('../../common/queries');

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
      const { data, errors } = await createUser(userOne);

      expect(errors).to.be.undefined;
      expect(data.createUser).to.have.property('token').that.is.a('string');
      expect(data.createUser).to.have.property('id').that.is.a('string');
      token = data.createUser.token;
      userOne.id = data.createUser.id;
    });
  });

  describe('signIn', () => {
    it('should return token', async () => {
      const { data, errors } = await signIn(userOne);

      expect(errors).to.be.undefined;
      expect(data.signIn).to.have.property('token').that.is.a('string');
      token = data.signIn.token;
    });
  });

  describe('user', () => {
    it('should return one user', async () => {
      const { data, errors } = await request(queries.user, { id: userOne.id });
      expect(errors).to.be.undefined;
      expect(data.user).to.be.an('object');
      expect(data.user).to.have.property('id', userOne.id);
    });
  });

  describe('users', () => {
    it('should return list of users', async () => {
      const { data, errors } = await request(queries.users);

      expect(errors).to.be.undefined;
      expect(data.users).to.be.an('array');
      const match = data.users.find(({ id }) => id === userOne.id);
      expect(match).to.eql({ id: userOne.id });
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return true', async () => {
      const { data, errors } = await deleteUser(userOne.id, token);

      expect(errors).to.be.undefined;
      expect(data.deleteUser).to.be.true
    });
  });
});
