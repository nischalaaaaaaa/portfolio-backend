import { Controller, Post } from '@overnightjs/core';
import sendResponse from '../../middlewares/send-response';
import { Request, Response } from 'express';
import { MiracleBoard } from '../../models/miracle/board.model';
import { ClerkUser } from '../../models/miracle/clerk-user.model';
import { IUserInfo, Liveblocks } from '@liveblocks/node';

@Controller('api/clerk/liveblocks')
export class MiracleLiveBlocks {
    @Post('miracle')
    async login(request: Request & { userId: string, auth: any }, response: Response) {
        try {
            const { userId: clerkUserId, body: { room }, auth: { orgId } } = request;
            const { organizationIdClerk } = await MiracleBoard.findById(room).lean()
            if(orgId != organizationIdClerk) {
                throw new Error('Unauthorized')
            }
            const { _id, firstName, imageUrl } = await ClerkUser.findOne({ clerkUserId }).lean();
            const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_MIRACLE_SECRET });
            const userInfo: IUserInfo = { name: firstName , avatar: imageUrl }
            const session = liveblocks.prepareSession(_id.toString(), { userInfo });
            if(room) {
                session.allow(room, session.FULL_ACCESS)
            }
            const { status, body } = await session.authorize();
            return sendResponse(response, true, '', body);
        } catch (error) {
            return sendResponse(response, false, error.message, { token: null }, true, 403);
        }
    }
}