import { JWTPayload } from "../../../config/types";
import constants from "../../../config/constants";
import { IUser, User } from "../../../models/traditional/user.model";
import { CustomBcrypt } from "../../../config/custom-bcrypt";
const jwt = require('jsonwebtoken');

export const loginUser = (userName, password) => {
    return true;
}

export const registerUser = (userName, password) => {
    return true;
}

export const hashData = async (data) => {
    const bcrypt = new CustomBcrypt();
    return bcrypt.hash(data);
}

export const getUserById = async (userId) => {
    return await User.findOne({ _id: userId });
}

export const getUserByNameOrEmail = async (name, email) => {
    return await User.findOne({ active: true, $or: [{ username: name }, { email: email }] })
}

export const createUser = async (userData) => {
    userData.password = await hashData(userData.password)
    return await User.create(userData)
}

export const comparePasswords = (givenPassword: string, user: IUser) => {
    const bcrypt = new CustomBcrypt();
    if (!bcrypt.compare(givenPassword || '', user.password)) {
        throw new Error('Authentication failed. Wrong password.');
    }
}

export const makeToken = (user, isLoginTime = false) => {
    const result: Partial<JWTPayload> = {};
    const token = jwt.sign({user: user._id}, constants.jwtSecret, {
        expiresIn: constants.tokenExpireTime,
    });
    result['token'] = token;
    if(isLoginTime) {
        const refreshToken = jwt.sign({user: user._id}, constants.refreshJwtSecret, {
            expiresIn: constants.refreshTokenExpireTime,
        });
        result['refreshToken'] = refreshToken
    }
    return result;
}

export const getRefreshToken = async (userId) =>{
    return await User.findById(userId, { 'refreshToken': 1 });
}

export const updateRefreshToken = async (userId) => {
    let result = await getRefreshToken(userId)
    let refreshTokenObject: Object;
    if (result.refreshToken) {
        refreshTokenObject = result.refreshToken;
    } else {
        refreshTokenObject = {};
    }
    return await User.findByIdAndUpdate(userId, {
        $set: {
            'refreshToken': refreshTokenObject
        }
    });
}