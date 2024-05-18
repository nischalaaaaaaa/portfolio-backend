import { Controller, Post } from '@overnightjs/core';
import sendResponse from '../../middlewares/send-response';
import { CLERK_WEBHOOK_EVENTS } from '../../config/enums';
import { ClerkUserService } from './clerk.user.webhook.service';

@Controller('webhook/clerk')
export class ClerkController extends ClerkUserService{

    private clerkUserService: ClerkUserService = new ClerkUserService();

    constructor() {
        super();
    }

    @Post('user')
    async userHandler(req, res) {
        try {
            const { clerkEventType, clerkAttributes }: { clerkEventType: CLERK_WEBHOOK_EVENTS, clerkAttributes: any } = req;
            const { first_name, last_name, image_url, id, gender, email_addresses } = clerkAttributes;
            if(!id) {
                throw new Error(`Invalid request`)
            }

            const emailAddresses = email_addresses.map(_ => _.email_address);

            switch(clerkEventType) {
                case CLERK_WEBHOOK_EVENTS.USER_CREATED:
                    await this.clerkUserService.create( 
                        id,
                        { firstName: first_name, lastName: last_name },
                        emailAddresses,
                        gender,
                        image_url
                    )
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
}