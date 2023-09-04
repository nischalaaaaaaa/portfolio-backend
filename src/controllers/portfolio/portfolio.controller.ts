import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import sendResponse from '../../middlewares/send-response';
import { Types } from 'mongoose';

@Controller('sai-akhil')
export class UserController {
    @Get('main')
    async getDataOfDay(req, res) {
        try {
            return sendResponse(res, true, '', [1,2,3]);
        } catch (error) {
            return sendResponse(res, false, error.message, error);
        }
    }
}