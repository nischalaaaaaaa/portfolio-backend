import { Controller, Get } from '@overnightjs/core';
import sendResponse from '../../middlewares/send-response';
import { CHANNEL_TYPE } from '../../config/enums';
import socketConnection from '../../../socket';

@Controller('api/clerk')
export class ClerkController {

    @Get('test-endpoint')
    async test(req, res) {
        try {
            // await socketConnection.publishToChannel(CHANNEL_TYPE.PERMISSION_REFRESH, 'data');
            return sendResponse(res, true, '', null);
        } catch (error) {
            return sendResponse(res, false, error.message, error);
        }
    }
}