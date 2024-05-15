import { Document, Schema, Model, model } from 'mongoose';

export interface IClerkUser extends Document {
    clerkUserId: string,
    firstName: string,
    lastName: string,
    active : boolean,
};

const clerkUsersSchema = new Schema({
    clerkUserId: { type: Schema.Types.String, unique: true, required:true },
    firstName: { type: Schema.Types.String, trim: true },
    lastName: { type: Schema.Types.String, trim: true },
    active : { type : Boolean},
}, {
    timestamps: true
});

export const ClerkUser: Model<IClerkUser> = model<IClerkUser>('ClerkUser', clerkUsersSchema);
