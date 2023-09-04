import { Types } from "mongoose"

export type JWTPayload = {
    token: string,
    refreshToken: string,
    userDetails: {
        _id: Types.ObjectId | string
        name: string,
    }
}