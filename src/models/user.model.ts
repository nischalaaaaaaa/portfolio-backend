import { Document, Schema, Model, model, Types } from 'mongoose';

const userschema = new Schema({
    username: { type: String, trim: true, unique: true, required:true },
    password: { type: String, trim: true,  required:true },
    email: { type: String, trim: true },
    lastLogin: { type: Date },
    refreshToken: { type: Object },
    active : { type : Boolean},
});

export interface IUser extends Document {
    username: string,
    password: string,
    email: string,
    lastLogin: Date,
    refreshToken: Object,
    active : Boolean,
};

export const User: Model<IUser> = model<IUser>('User', userschema);