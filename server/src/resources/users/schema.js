import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }

  extend type Mutation {
    createUser(username: String!, email: String!, password: String!, fullName: String): Token!
    signIn(email: String!, password: String!): Token!
    deleteUser(id: ID!): Boolean!
  }

  type Token {
    token: String!
    id: String
  }

  type User {
    id: ID!
    username: String!
    fullName: String
    email: String!
    messages: [Message!]!
    createdAt: String!
    updatedAt: String
  }
`;
