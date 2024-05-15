import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Types } from 'mongoose';
import constants from '../../../config/constants';
import { JWTPayload } from '../../../config/types';
import { User } from '../../../models/traditional/user.model';
import { comparePasswords, getUserByNameOrEmail, makeToken } from './auth.service';
import { CHANNEL_TYPE, CODES } from '../../../config/enums';
import { CustomBcrypt } from '../../../config/custom-bcrypt';
import socketConnection from '../../../../socket';
import sendResponse from '../../../middlewares/send-response';
const jwt = require('jsonwebtoken');

@Controller('api/auth')
export class AuthController {

    @Get('test')
    async test(req, res) {
        try {
            await socketConnection.publishToChannel(CHANNEL_TYPE.PERMISSION_REFRESH, 'data');
            return sendResponse(res, true, '', null);
        } catch (error) {
            return sendResponse(res, false, error.message, error);
        }
    }

    @Post('login')
    async login(req, res) {
        try {
            const { username, email, password } = req.body;
            if(!username || !password) {
                throw new Error('Invalid data')
            }
            const user = await User.findOne({
                $or: [
                    { username: username },
                    { email: email || '' },
                ],
            }).lean();
            if(!user) {
                throw new Error('Details not found! Kindly register');
            }
            comparePasswords(password, user);
            const tokens = makeToken(user, true);
            const payload: Partial<JWTPayload> = {
                userDetails: {
                    _id: user._id,
                    name: user.username
                },
                ...tokens
            };
            return sendResponse(res, true, '', payload);
        } catch (error) {
            return sendResponse(res, false, error.message, error);
        }
    }

    @Post('register')
    async register(req, res) {
        try {
            const { name, password, email } = req.body;
            if(!name || !password || !email) {
                throw new Error('Invalid data');
            }
            const userExistence = await getUserByNameOrEmail(name, email);
            if(userExistence) {
                throw new Error('User already exists');
            }
            const bcrypt = new CustomBcrypt();
            const hash = bcrypt.hash(password);
            await User.create({
                username: name,
                email: email,
                password: hash,
                lastLogin: new Date(),
                active: true,
            })
            return sendResponse(res, true, 'Registered Successfully', null);
        } catch (error) {
            return sendResponse(res, false, error.message, error);
        }
    }

    @Post('renew-access')
    async renewAccess(req, res) {
        try {
            const { refreshToken } = req.body;
            jwt.verify(refreshToken, constants.refreshJwtSecret, async (err, decoded) => {
                if (err) {
                    return sendResponse(res, false, err.message, err, false, CODES.REFRESH_TOKEN_EXPIRED);
                } else {
                    try {
                        const userId = new Types.ObjectId(decoded.user);
                        const user = await User.findById(userId);
                        const tokens = makeToken(user, false);
                        const payload: Partial<JWTPayload> = {
                            userDetails: {
                                _id: user._id,
                                name: user.username
                            },
                            ...tokens
                        };
                        return sendResponse(res, true, 'New access token', payload);
                    } catch (err) {
                        return sendResponse(res, false, 'Error getting new tokens', null);
                    }
                }
            });
        } catch (error) {
            return sendResponse(res, false, error.message, error);
        }
    }
}