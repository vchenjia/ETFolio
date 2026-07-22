import jwt from 'jsonwebtoken';

interface JWTPayload {
    id: string;
}

export function generateToken(userID: string) {
    const token = jwt.sign({ id: userID }, process.env.JWT_SECRET!, { expiresIn: '24h' });
    return token;
}

export function verifyToken(token: string) {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
        if (typeof decodedToken === 'string' || !('id' in decodedToken)) {
            return null;
        }
        return decodedToken as JWTPayload;
    } catch (err) {
        return null;
    }
}