import { Document, Schema, Model, model, Types } from 'mongoose';
import { ClerkUser } from './clerk-user.model';
import { MiracleBoard } from './board.model';

export interface IUserFavouriteMiracleBoard extends Document {
    userId: Types.ObjectId;
    boardId: Types.ObjectId;
};

const userFavouriteMiracleBoardSchema: Schema<IUserFavouriteMiracleBoard> = new Schema<IUserFavouriteMiracleBoard>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: ClerkUser },
    boardId: { type: Schema.Types.ObjectId, required:true, ref: MiracleBoard },
}, {
    timestamps: true
});

export const UserFavouriteMiracleBoard: Model<IUserFavouriteMiracleBoard> = model<IUserFavouriteMiracleBoard>('UserFavouriteMiracleBoard', userFavouriteMiracleBoardSchema);

userFavouriteMiracleBoardSchema.index({
    userId: 1,
    organizationId: 1,
})
