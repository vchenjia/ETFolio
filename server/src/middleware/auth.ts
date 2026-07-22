import { type Request, type Response, type NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

declare global {
    namespace Express {
        interface Request {
            user: { id: string };
        }
    }
}
export { };

export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const rawAuthToken = req.headers.authorization;
    if (!rawAuthToken || !rawAuthToken.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    const authToken = rawAuthToken!.split(' ')[1];
    if (!authToken) {
        res.status(401).json({ message: 'Malformed Authorization Header' });
        return;
    }
    try {
        const decodedToken = verifyToken(authToken!);
        if (!decodedToken) {
            res.status(401).json({ message: 'Invalid token payload' });
            return;
        }
        req.user = { id: decodedToken.id };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Something went wrong' });
        return;
    }
};