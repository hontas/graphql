import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uuidv4 from "uuid/v4";
import { ForbiddenError } from "apollo-server-express";

const secret = process.env.AUTH_SECRET || uuidv4();

export async function generatePasswordHash(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export function createToken(user) {
  const { id, email, username } = user;
  return jwt.sign({ id, email, username }, secret, { expiresIn: '30m' });
}

export async function validatePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export async function getUserFromToken(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  try {
    return await jwt.verify(token, secret);
  } catch (e) {
    return null;
  }
}

export const isAuthenticated = (parent, args, { user }) =>
  user ? undefined : new ForbiddenError('Not authenticated as user');
