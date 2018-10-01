import express from "express";
import helmet from "helmet";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";

import schema from "./schema";
import resolvers from "./resolvers";
import generateData from "./resources/generateData";
import { getUserFromToken } from './lib/auth';

generateData();

const app = express();
app.use(helmet());
app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req }) => {
    const user = await getUserFromToken(req);
    return { user };
  }
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
