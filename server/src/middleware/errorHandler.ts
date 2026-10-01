import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
};