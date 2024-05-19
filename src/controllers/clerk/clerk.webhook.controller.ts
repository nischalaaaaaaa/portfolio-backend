import { Controller, Middleware, Post } from '@overnightjs/core';
import sendResponse from '../../middlewares/send-response';
import { CLERK_WEBHOOK_EVENTS } from '../../config/enums';
import { ClerkUserService } from './clerk.user.webhook.service';
import { ClerkOrganization } from '../../models/miracle/clerk-organization.model';
import { ClerkUser } from '../../models/miracle/clerk-user.model';
import { WebhookManager } from '../../middlewares/clerk-webhook.middleware';
import 'dotenv/config'; 

@Controller('webhook/clerk')
export class ClerkController extends ClerkUserService{

    private clerkUserService: ClerkUserService = new ClerkUserService();

    constructor() {
        super();
    }

    @Post('user')
    @Middleware(WebhookManager.verifyWebhook(process.env.CLERK_WEBHOOK_SECRET_USER))
    async userHandler(req, res) {
        try {
            const { clerkEventType, clerkAttributes }: { clerkEventType: CLERK_WEBHOOK_EVENTS, clerkAttributes: any } = req;
            const { first_name, last_name, image_url, id, gender, email_addresses } = clerkAttributes;
            if(!id) {
                throw new Error(`Invalid request`)
            }

            const emailAddresses = (email_addresses ?? []).map(_ => _.email_address);

            switch(clerkEventType) {
                case CLERK_WEBHOOK_EVENTS.USER_CREATED:
                    await this.clerkUserService.create( 
                        id,
                        { firstName: first_name, lastName: last_name },
                        emailAddresses,
                        gender,
                        image_url
                    )
                    break;
                case CLERK_WEBHOOK_EVENTS.USER_UPDATED:
                    await this.clerkUserService.update({
                        id,
                        firstName: first_name,
                        lastName: last_name,
                        gender,
                        emailAddresses,
                        imageUrl: image_url
                    })
                    break;
                case CLERK_WEBHOOK_EVENTS.USER_DELETED:
                    await this.clerkUserService.delete(id);
                    break;
                default: 
                    break;
            }
            
            return sendResponse(res, true, 'Success', null);
        } catch (error) {
            return sendResponse(res, false, error.message, error);
        }
    }

    @Post('organization')
    @Middleware(WebhookManager.verifyWebhook(process.env.CLERK_WEBHOOK_SECRET_ORGANIZATION))
    async organizationHandler(req, res) {
        try {
            const { clerkEventType, clerkAttributes }: { clerkEventType: CLERK_WEBHOOK_EVENTS, clerkAttributes: any } = req;
            const { created_by, logo_url, name, slug, image_url, id } = clerkAttributes;
            
            if(!id) {
                throw new Error(`Invalid request`)
            }
            const slugTaken = slug && (await ClerkOrganization.findOne({ slug }))
            if(slugTaken) {
                throw new Error(`Slug is already taken`);
            }
            const user = created_by ? await ClerkUser.findOne({ clerkUserId: created_by }).lean() : null;

            const payload = {
                organizationIdClerk: id,
                createdByClerkUser: created_by,
                createdByUser: user?._id,
                name,
                slug,
                imageUrl: image_url,
                logoUrl: logo_url,
            }

            switch(clerkEventType) {
                case CLERK_WEBHOOK_EVENTS.ORGANIZATION_CREATED:
                    await ClerkOrganization.create(payload)
                    break;
                case CLERK_WEBHOOK_EVENTS.ORGANIZATION_UPDATED:
                    await ClerkOrganization.updateOne({
                        organizationIdClerk: id
                    }, {
                        update: {
                            $set: {
                                ...payload
                            }
                        }
                    }, {
                        upsert: true
                    })
                    break;
                case CLERK_WEBHOOK_EVENTS.ORGANIZATION_DELETED:
                    await ClerkOrganization.deleteOne({ organizationIdClerk: id })
                    break;
                default: 
                    break;
            }
            
            return sendResponse(res, true, 'Success', true);
        } catch (error) {
            return sendResponse(res, false, error.message, error);
        }
    }
}