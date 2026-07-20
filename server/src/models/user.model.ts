import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt';

export interface IUser {
    username: string;
    email: string;
    password: string;
    // Have to implement watchlist, ledgers (saved pages), positions, cash, 
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    }
}, {
    methods: {
        async comparePassword(candidatePassword: string) {
            return compare(candidatePassword, this.password);
        }
    }
})

export interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Set plain password to hashed password (bcrypt)
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    try {
        const salt = await genSalt(10);
        const hashedPassword = await hash(this.password, salt);
        this.password = hashedPassword;
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            throw Error(`Password hashing failed: ${error.message}`)
        }
        throw Error(`Password hashing failed due to unknown error`)
    }

});

const User = model<IUser>('User', userSchema);

export default User;