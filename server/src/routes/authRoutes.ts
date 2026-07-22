import express, { type Request, type Response } from 'express';
import { HydratedDocument } from 'mongoose';
import User, { type IUser, type IUserMethods } from '../models/user.model';
import { generateToken } from '../utils/jwt';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

interface RegisterBody {
    username: string,
    email: string;
    password: string;
}

interface LoginBody {
    username: string,
    password: string;
}

router.post('/register', async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ message: "Field can not be empty" });
        return;
    }
    const isDuplicate = await User.findOne({ $or: [{ username }, { email }] }); // Either or (unique)
    if (isDuplicate) {
        res.status(409).json({ message: "Username / Email already being used" });
        return;
    }
    const newUser: HydratedDocument<IUser> = new User({ username, email, password });
    await newUser.save();
    const token = generateToken(newUser.id);
    res.status(201).json({ message: "New user created succesfully", token });
});

router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "Field can not be empty" });
        return;
    }
    const validUser: HydratedDocument<IUser, IUserMethods> | null = await User.findOne({ username });
    if (!validUser) {
        res.status(401).json({ message: "Username is incorrect. Please try again" });
        return;
    }
    const isMatch = await validUser.comparePassword(password);
    if (!isMatch) {
        res.status(401).json({ message: "Password is incorrect. Please try again" });
        return;
    }
    const token = generateToken(validUser.id);
    res.status(200).json({ message: "Access succesfully", token });
});

router.get('/me', requireAuth, (req: Request, res: Response) => {
    res.status(200).json({ message: 'Authenticated', user: req.user })
});

export default router