import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import sendResponse from '../../middlewares/send-response';
import { Types } from 'mongoose';
const bcrypt = require('bcrypt');
import variables from '../../config/variables';
import { JWTPayload } from '../../config/types';
import { User } from '../../models/user.model';
import { comparePasswords, getUserByNameOrEmail, hashData, makeToken } from './auth.service';
const { expressjwt: jwt } = require("express-jwt");

@Controller('auth')
export class AuthController {
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
            const salt = await bcrypt.genSalt(2);
            const hash = await bcrypt.hash(password, salt);
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
            jwt.verify(refreshToken, variables.refreshJwtSecret, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Invalid refresh token' });
                }
                const newAccessToken = jwt.sign( decoded, variables.jwtSecret, {
                    expiresIn: variables.refreshJwtSecret,
                });
                return sendResponse(res, true, 'New access token', newAccessToken);
            });
        } catch (error) {
            return sendResponse(res, false, error.message, error);
        }
    }
}