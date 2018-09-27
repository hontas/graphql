import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    messages: [Message!]!
    message(id: ID!): Message
  }

  extend type Mutation {
    createMessage(text: String!, userId: ID!, inResponseTo: ID): Message!
    updateMessage(id: ID!, text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type Message {
    id: ID!
    user: User!
    text: String!
    responses: [Message!]!
  }
`;
