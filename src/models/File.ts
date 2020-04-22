import mongoose, { Schema } from 'mongoose';
import { UserDocument } from './User';

export type FileDocument = mongoose.Document & {
    name: string;
    md5: string;
    tags: string[];
    location: string;
    reviewer: UserDocument;
    status: string;
};

const fileSchema = new mongoose.Schema(
    {
        name: String,
        md5: { type: String, unique: true },
        tags: [String],
        location: String,
        reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
        status: String,
    },
    { timestamps: true }
);

export const File = mongoose.model<FileDocument>('File', fileSchema);
