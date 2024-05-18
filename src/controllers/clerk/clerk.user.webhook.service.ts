import { ClerkUser } from "../../models/miracle/clerk-user.model"

export class ClerkUserService {
    async create (
        id: string,
        name: {
            firstName: string,
            lastName: string
        },
        emailAddresses: string[],
        gender?: string,
        imageUrl?: string
    ) {
        const user = await this.getUser(emailAddresses);
        if(!user) {
            await ClerkUser.create({
                clerkUserId: id,
                firstName: name.firstName,
                lastName: name.lastName,
                emailAddresses,
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
            emailAddresses: string[],
            gender?: string,
            imageUrl?: string
        }
    ) {
        const user = await this.getUser(payload.emailAddresses);
        if(!user) {
            throw new Error(`User does not exist anymore`)
        }
        await ClerkUser.updateOne({
            emailAddresses: { $in: payload.emailAddresses }
        }, {
            update: {
                $set: {
                    ...payload
                }
            }
        })
    }

    async delete(emailAddresses: string) {
        await ClerkUser.deleteOne({ emailAddresses: { $in: emailAddresses } })
    }

    async getUser(emailAddresses) {
        return await ClerkUser.findOne({emailAddresses: { $in: emailAddresses }})
    }
}