import users from './users/controller';
import messages from './messages/controller';

const userData = [
  {
    username: "hontas",
    fullName: "Pontus Lundin",
    email: "lundin.pontus@gmail.com",
    password: 'hontas'
  },
  {
    username: "TobLu",
    fullName: "Tobias Lundin",
    email: "lundin.tobias@gmail.com",
    password: 'toblu'
  }
];

export default async function init() {
  const [pontus, tobbe] = await Promise.all(userData.map(users.createUser));

  const firstMsg = messages.createMessage({ text: 'Hej Tobbe!', userId: pontus.id });
  users.createdMessage({ userId: pontus.id, messageId: firstMsg.id });

  const secondMsg = messages.createMessage({ text: 'Tjiena pontus', userId: tobbe.id, inResponseTo: firstMsg.id });
  users.createdMessage({ userId: tobbe.id, messageId: secondMsg.id });

  console.log('generated initial data');
}
