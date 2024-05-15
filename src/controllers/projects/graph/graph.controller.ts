import { Controller, Post } from '@overnightjs/core';
import sendResponse from '../../../middlewares/send-response';

@Controller('graph')
export class GraphController {
    @Post('save')
    async login(req, res) {
        try {
            return sendResponse(res, true, '', {});
        } catch (error) {
            return sendResponse(res, false, error.message, error);
        }
    }
}