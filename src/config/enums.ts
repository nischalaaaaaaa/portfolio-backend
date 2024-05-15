export enum CODES {
    TOKEN_EXPIRED = 1001,
    REFRESH_TOKEN_EXPIRED = 1002,
    CLERK_UNAUTHORIZED = 1003
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

export enum CLERK_WEBHOOK_EVENTS {
    USER_CREATED = 'user.created',
    USER_UPDATED = 'user.updated',
    USER_DELETED = 'user.deleted'
}