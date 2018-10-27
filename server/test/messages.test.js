const { expect } = require('chai');
const {
  request,
  createMessage,
  deleteMessage,
  createUser,
  deleteUser,
  getAuthHeader
} = require('./helpers');
const queries = require('../../common/queries');

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

  after(async () => {
    await deleteUser(user.id, token);
    await deleteMessage(messageOne.id, token);
  });

  describe('createMessage', () => {
    it('should create a new message and tie it to a user', async () => {
      const { data, errors } = await createMessage({ ...messageOne, userId: user.id }, token);

      expect(errors).to.be.undefined;
      expect(data.createMessage).to.have.property('id').that.is.a('string');
      expect(data.createMessage).to.have.property('text', messageOne.text);
      messageOne.id = data.createMessage.id;

      const res = await request(queries.user, { id: user.id });
      expect(res.data.user).to.have.property('messages').that.has.length(1);
      expect(res.data.user.messages[0]).to.have.property('id', messageOne.id);
    });
  });

  describe('getMessage', () => {
    it('should return one message', async () => {
      const { data, errors } = await request(queries.message, { id: messageOne.id });

      expect(errors).to.be.undefined;
      expect(data.message).to.be.an('object');
      expect(data.message).to.have.property('id', messageOne.id);
    });
  });

  describe('getMessages', () => {
    const responseMsg = { text: 'ett svar' };

    before(async () => {
      const { data } = await createMessage({
        ...responseMsg,
        userId: user.id,
        inResponseTo: messageOne.id
      }, token);
      responseMsg.id = data.createMessage.id;
    });

    after(() => deleteMessage(responseMsg.id, token));

    it('should return all messages (with responses)', async () => {
      const { data, errors } = await request(queries.messages);

      expect(errors).to.be.undefined;
      expect(data.messages).to.be.an('array');
      const msg = data.messages.find(({ id }) => id === messageOne.id);
      expect(msg).to.have.property('responses').that.is.an('array');
      expect(msg.responses[0]).to.have.property('id', responseMsg.id);
    });
  });

  describe('updateMessage', () => {
    it('should return list of users', async () => {
      const text = 'some updated text';
      const variables = { id: messageOne.id, text };
      const headers = getAuthHeader(token);
      const { data, errors } = await request(queries.updateMessage, variables, headers);

      expect(errors).to.be.undefined;
      expect(data.updateMessage).to.be.an('object');
      expect(data.updateMessage).to.have.property('text', text);
    });
  });

  describe('deleteMessage', () => {
    it('should delete message and references', async () => {
      const { data, errors } = await deleteMessage(messageOne.id, token);

      if (errors) console.log(errors);
      expect(errors).to.be.undefined;
      expect(data.deleteMessage).to.be.true;

      const res = await request(queries.user, { id: user.id });
      expect(res.data.user).to.have.property('messages').that.is.empty;
    });
  });
});
