import { gql } from "apollo-server-express";

import userSchema from "./resources/users/schema";
import messageSchema from "./resources/messages/schema";

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export default [linkSchema, userSchema, messageSchema];
