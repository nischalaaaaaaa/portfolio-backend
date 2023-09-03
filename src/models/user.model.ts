import { Document, Schema, Model, model, Types } from 'mongoose';

const userschema = new Schema({
    username: { type: String, trim: true, unique: true, required:true },
    password: { type: String, trim: true,  required:true },
    firstName: { type: String, trim: true, required:true },
    lastName: { type: String, trim: true, required:true },
    fullName: { type: String, trim: true, required:true },
    phoneNumber: { type: String, trim: true , required:true , unique:true},
    email: { type: String, trim: true },
    lastLogin: { type: Date },
    refreshToken: { type: Object },
    active : { type : Boolean},
});

export interface IUser extends Document {
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    fullName:string,
    phoneNumber: string,
    email: string,
    lastLogin: Date,
    refreshToken: Object,
    active : Boolean,
};

export const User: Model<IUser> = model<IUser>('User', userschema);
