import { ClerkUser } from "../../models/miracle/clerk-user.model"

export class ClerkUserService {
    async create (
        id: string,
        name: {
            firstName: string,
            lastName: string
        },
        gender?: string,
        imageUrl?: string
    ) {
        const user = await this.getUser(id);
        if(!user) {
            await ClerkUser.create({
                clerkUserId: id,
                firstName: name.firstName,
                lastName: name.lastName,
                ...(gender? { gender } : {}),
                ...(imageUrl? { imageUrl } : {}),
            })
        }
    }

    async update (
        payload: {
            id: string,
            firstName?: string,
            lastName?: string,
            gender?: string,
            imageUrl?: string
        }
    ) {
        const user = await this.getUser(payload.id);
        if(!user) {
            throw new Error(`User does not exist anymore`)
        }
        await ClerkUser.updateOne({
            clerkUserId: payload.id
        }, {
            update: {
                $set: {
                    ...payload
                }
            }
        })
    }

    async delete (id: string) {
        await ClerkUser.deleteOne({
            clerkUserId: id
        })
    }

    async getUser (id) {
        return await ClerkUser.findOne({clerkUserId: id})
    }
}