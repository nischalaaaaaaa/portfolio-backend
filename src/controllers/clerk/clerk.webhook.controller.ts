import { Controller, Get, Post } from '@overnightjs/core';
import sendResponse from '../../middlewares/send-response';
import { CLERK_WEBHOOK_EVENTS } from '../../config/enums';
import { ClerkUser } from '../../models/miracle/clerk-user.model';

@Controller('webhook/clerk')
export class ClerkController {

    @Post('user')
    async userHandler(req, res) {
        try {
            const { clerkEventType, clerkAttributes }: { clerkEventType: CLERK_WEBHOOK_EVENTS, clerkAttributes: any } = req;

            switch(clerkEventType) {
                case CLERK_WEBHOOK_EVENTS.USER_CREATED:
                    console.log(clerkAttributes)
                    break;
                case CLERK_WEBHOOK_EVENTS.USER_UPDATED:
                    break;
                case CLERK_WEBHOOK_EVENTS.USER_DELETED:
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