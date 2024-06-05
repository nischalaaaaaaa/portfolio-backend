import { Controller, Get, Post } from '@overnightjs/core';
import sendResponse from '../../middlewares/send-response';
import { MiracleBoard } from '../../models/miracle/board.model';
import { ClerkUser } from '../../models/miracle/clerk-user.model';
import { ClerkOrganization } from '../../models/miracle/clerk-organization.model';

@Controller('api/clerk/miracle-organization')
export class MiracleOrganizationBoardController {

    @Get('boards')
    async getOrganizationBoards(req, res) {
        try {
            const { organizationId } = req.query;
            const boards = await MiracleBoard.find({
                organizationIdClerk: organizationId,
            }).sort('updatedAt').lean();
            return sendResponse(res, true, 'Success', boards);
        } catch (error) {
            return sendResponse(res, false, error.message, error);
        }
    }

    @Post('create-board')
    async userHandler(req, res) {
        try {
            const { organizationId, imageUrl } = req.query;
            const { userId } = req;
            const { firstName, lastName } = await ClerkUser.findOne({
                clerkUserId: userId
            }).lean()
            
            const boards = await MiracleBoard.find({ 
                organizationIdClerk: organizationId, 
                authorIdClerk: userId, 
                title: {
                    $regex: "^untitled[1-9]\\d*$"
                }
            }).lean().collation({
                locale: 'en',
                numericOrdering: true
            });

            const series = boards ? Math.max(0, ...boards.map(({title}) => Number(title.match(/\d+/g)?.[0]))) : 0;
            const clerkUser = await ClerkUser.findOne({ clerkUserId: userId }).lean();
            const clerkOrganization = await ClerkOrganization.findOne({ organizationIdClerk: organizationId })

            await MiracleBoard.create({
                title: `untitled${series+1}`,
                organizationIdClerk: organizationId,
                authorIdClerk: userId,
                organizationId: clerkOrganization._id,
                authorId: clerkUser._id,
                authorName: `${firstName} ${lastName}`,
                imageUrl,
            })
            return sendResponse(res, true, 'Success', true);
        } catch (error) {
            return sendResponse(res, false, error.message, error);
        }
    }
}