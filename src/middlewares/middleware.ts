import { Response } from "express";
import { CODES, RESPONSE_TYPE } from "../config/enums";

export default function sendResponse<T>(res: Response, success: boolean, message: string,
    data?: T,
    showPopUp = true, code = CODES.DEFAULT, responseType = RESPONSE_TYPE.Warning) {

    return res.send({
        data: data,
        success: success,
        message: message,
        showPopUp: showPopUp,
        code: code,
        responseType: responseType
    });
}