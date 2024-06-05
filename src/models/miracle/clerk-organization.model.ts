import { Document, Schema, Model, model } from 'mongoose';

export interface IClerkOrganization extends Document {
    organizationIdClerk: string,
    name: string,
    slug: string,
    createdByClerkUser: string,
    createdByUser: string,
    imageUrl?: string,
    logoUrl?: string,
};

const clerkOrganizationSchema = new Schema({
    organizationIdClerk: { type: Schema.Types.String, unique: true, required:true },
    createdByClerkUser: { type: Schema.Types.String, required:true },
    createdByUser: { type: Schema.Types.ObjectId, required: true },
    name: { type: Schema.Types.String, required: true, trim: true },
    slug: { type: Schema.Types.String, required: true, trim: true, unique: true },
    imageUrl: { type: Schema.Types.String, trim: true },
    logoUrl: { type: Schema.Types.String, trim: true },
}, {
    timestamps: true
});

export const ClerkOrganization: Model<IClerkOrganization> = model<IClerkOrganization>('ClerkOrganization', clerkOrganizationSchema);

clerkOrganizationSchema.index({
    organizationIdClerk: 1
}).index({
    slug: 1
})