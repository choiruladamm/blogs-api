import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';
const JWT_EXPIRES_IN: StringValue = (process.env.JWT_EXPIRES_IN ?? '1d') as StringValue; // prettier-ignore

type Payload = {
  userId: string;
};

const signOptions: SignOptions = {
  expiresIn: JWT_EXPIRES_IN,
};

export function signToken(payload: Payload): string {
  return jwt.sign(payload, JWT_SECRET as string, signOptions);
}

export function verifyToken(token: string): Payload {
  return jwt.verify(token, JWT_SECRET as string) as Payload;
}
