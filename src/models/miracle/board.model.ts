import { Document, Schema, Model, model } from 'mongoose';

export interface IMiracleBoard extends Document {
    title: string;
    organizationId: string;
    authorId: string;
    authorName: string;
    imageUrl?: string;
};

const miracleBoardSchema = new Schema({
    title: { type: Schema.Types.String, trim: true, required:true },
    authorId: { type: Schema.Types.ObjectId, required:true },
    organizationId: { type: Schema.Types.ObjectId, required:true },
    authorName: { type: Schema.Types.String, trim: true, required: true },
    imageUrl: { type: Schema.Types.String },
});

export const Board: Model<IMiracleBoard> = model<IMiracleBoard>('User', miracleBoardSchema);

miracleBoardSchema.index({
    title: 1
}).index({
    organizationId: 1
})
