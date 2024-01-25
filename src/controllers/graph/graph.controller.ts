import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import sendResponse from '../../middlewares/send-response';
import constants from '../../config/constants';
import { JWTPayload } from '../../config/types';
import { User } from '../../models/user.model';

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