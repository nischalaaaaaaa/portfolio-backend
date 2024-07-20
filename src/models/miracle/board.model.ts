import { Document, Schema, Model, model, Types } from 'mongoose';
import { ClerkUser } from './clerk-user.model';
import { ClerkOrganization } from './clerk-organization.model';

export interface IMiracleBoard extends Document {
    title: string;
    organizationIdClerk: string;
    authorIdClerk: string;
    organizationId: Types.ObjectId;
    authorId: Types.ObjectId;
    authorName: string;
    imageUrl?: string;
};

const miracleBoardSchema: Schema<IMiracleBoard> = new Schema<IMiracleBoard>({
    title: { type: Schema.Types.String, trim: true, required:true },
    authorIdClerk: { type: Schema.Types.String, required:true },
    organizationIdClerk: { type: Schema.Types.String, required:true },
    authorId: { type: Schema.Types.ObjectId, required: true, ref: ClerkUser },
    organizationId: { type: Schema.Types.ObjectId, required:true, ref: ClerkOrganization },
    authorName: { type: Schema.Types.String, trim: true, required: true },
    imageUrl: { type: Schema.Types.String },
}, {
    timestamps: true
});

export const MiracleBoard: Model<IMiracleBoard> = model<IMiracleBoard>('MiracleBoard', miracleBoardSchema);

miracleBoardSchema.index({
    title: 1,
    organizationIdClerk: 1,
    authorIdClerk: 1
}).index({
    title: 1,
    organizationId: 1,
    authorId: 1
})
