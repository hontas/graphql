import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function generatePasswordHash(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export function createToken(user) {
  const { id, email, username } = user;
  return jwt.sign({ id, email, username });
}
