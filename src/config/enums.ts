export enum CODES {
    TOKEN_EXPIRED = 1001,
    REFRESH_TOKEN_EXPIRED = 1002,
}

export enum RESPONSE_TYPE {
    Error,
    Information,
    Question,
    Warning,
    Success,
}

export enum CHANNEL_TYPE {
    PERMISSION_REFRESH = 'PERMISSION_REFRESH',
    NOTIFICATION_REFRESH = 'NOTIFICATION_REFRESH',
}