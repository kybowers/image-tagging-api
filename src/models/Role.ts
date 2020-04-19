import mongoose from 'mongoose';

export type RoleDocument = mongoose.Document & {
    name: string;
    description: string;
    permissions: string[];
};

const roleSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    description: String,
    permissions: [String],
});

export const Role = mongoose.model<RoleDocument>('Role', roleSchema);
