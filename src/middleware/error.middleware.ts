import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../errors/base-error';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('💥 Error:', err);

  if (err instanceof BaseError) {
    res.status(err.statusCode).json({ message: err.message });
  } else if (err instanceof Error) {
    res.status(400).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
