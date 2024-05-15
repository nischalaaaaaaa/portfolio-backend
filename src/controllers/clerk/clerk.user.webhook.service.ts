import { ClerkUser } from "../../models/miracle/clerk-user.model"

export class ClerkUserService {
    private clerkUserId: string = null;

    constructor (clerkUserId?: string) {
        this.clerkUserId = clerkUserId
    }

    protected setUserId (clerkUserId: string) {
        this.clerkUserId = clerkUserId
    }

    async create (
        name: {
            firstName: string,
            lastName: string
        },
        gender?: string,
        imageUrl?: string
    ) {
        const user = await this.getUser();
        if(!user) {
            await ClerkUser.create({
                clerkUserId: this.clerkUserId,
                firstName: name.firstName,
                lastName: name.lastName,
                ...(gender? { gender } : {}),
                ...(imageUrl? { imageUrl } : {}),
            })
        }
    }

    async update (
        payload: {
            firstName?: string,
            lastName?: string,
            gender?: string,
            imageUrl?: string
        }
    ) {
        const user = await this.getUser();
        if(!user) {
            throw new Error(`User does not exist anymore`)
        }
        await ClerkUser.updateOne({
            clerkUserId: this.clerkUserId
        }, {
            update: {
                $set: {
                    ...payload
                }
            }
        })
    }

    async delete () {
        await ClerkUser.deleteOne({
            clerkUserId: this.clerkUserId
        })
    }

    async getUser () {
        return await ClerkUser.findOne({clerkUserId: this.clerkUserId})
    }
}