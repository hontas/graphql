module.exports = {
  createUser: `
    mutation ($email: String!, $username: String!, $password: String!, $fullName: String) {
      createUser(email: $email, username: $username, password: $password, fullName: $fullName) {
        id
        token
      }
    }
  `,
  user: `
    query ($id: ID!) {
      user(id: $id) {
        id
      }
    }
  `,
  users: `
    query {
      users {
        id
      }
    }
  `,
  signIn: `
    mutation ($email: String!, $password: String!) {
      signIn(email: $email, password: $password) {
        token
      }
    }
  `,
  deleteUser: `
    mutation ($id: ID!) {
      deleteUser(id: $id)
    }
  `,

  createMessage: `
    mutation ($text: String!, $userId: ID!, $inResponseTo: ID) {
      createMessage(text: $text, userId: $userId, inResponseTo: $inResponseTo) {
        id
        text
      }
    }
  `,
  updateMessage: `
    mutation ($id: ID!, $text: String!) {
      updateMessage(id: $id, text: $text) {
        text
      }
    }
  `,
  message: `
    query ($id: ID!) {
      message(id: $id) {
        id
      }
    }
  `,
  messages: `
    query {
      messages {
        id
        responses {
          id
        }
      }
    }
  `,
  deleteMessage: `
    mutation ($id: ID!) {
      deleteMessage(id: $id)
    }
  `
};
