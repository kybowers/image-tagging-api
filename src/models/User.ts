import Bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';
import { RoleDocument } from './Role';

export type UserDocument = mongoose.Document & {
    username: string;
    password: string;
    role: RoleDocument;
};

type comparePasswordFunction = (
    candidatePassword: string,
    cb: (err: any, isMatch: any) => {}
) => void;

export interface AuthToken {
    accessToken: string;
    kind: string;
}

const userSchema = new mongoose.Schema(
    {
        username: { type: String, unique: true },
        password: String,
        role: { type: Schema.Types.ObjectId, ref: 'Role' },
    },
    { timestamps: true }
);

/**
 * Password hash middleware.
 */
userSchema.pre('save', async function () {
    const user = this as UserDocument;
    if (user.isModified('password')) {
        const salt = await Bcrypt.genSalt(10);
        const hash = await Bcrypt.hash(user.password, salt);
        user.password = hash;
    }
});

const comparePassword: comparePasswordFunction = function (
    candidatePassword,
    cb
) {
    Bcrypt.compare(candidatePassword, this.password, (error, isMatch) =>
        cb(error, isMatch)
    );
};

userSchema.methods.comparePassword = comparePassword;

export const User = mongoose.model<UserDocument>('User', userSchema);
