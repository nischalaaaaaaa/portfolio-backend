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
            const { first_name, last_name, image_url, id, gender } = clerkAttributes;
            if(!id || !first_name) {
                throw new Error(`Invalid request`)
            }
            this.setUserId(id);

            switch(clerkEventType) {
                case CLERK_WEBHOOK_EVENTS.USER_CREATED:
                    await this.clerkUserService.create( 
                        { firstName: first_name, lastName: last_name },
                        gender,
                        image_url
                    )
                case CLERK_WEBHOOK_EVENTS.USER_UPDATED:
                    await this.clerkUserService.update({
                        firstName: first_name,
                        lastName:last_name,
                        gender,
                        imageUrl: image_url
                    })
                    break;
                case CLERK_WEBHOOK_EVENTS.USER_DELETED:
                    await this.clerkUserService.delete();
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