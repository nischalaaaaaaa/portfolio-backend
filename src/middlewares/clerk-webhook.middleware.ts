import { NextFunction, Request, Response } from "express";
import { Webhook } from "svix";
import sendResponse from "./send-response";
import { CODES } from "../config/enums";

export const WebhookManager = {
    verifyWebhook: (secret: string) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const svixHeaders: any =req.headers;
            const wh = new Webhook(secret ?? 'random');
            const evt: any = wh.verify(req.body.toString(), svixHeaders);
            if(!evt) {
                return sendResponse(res, false, 'Unauthorized request', null, false, CODES.CLERK_UNAUTHORIZED);
            }
            const { id } = evt.data;
            if(!id) {
                throw new Error(`Invalid request`)
            }
            req['clerkEventType'] = evt.type;
            req['clerkAttributes'] = { ...evt.data };
            return next();
        }
    }   
}