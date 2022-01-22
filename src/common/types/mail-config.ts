type AUTH = {
    user: string;
    pass: string;
};

export type MAILCONFIG = {
    host: string;
    port: number;
    secure: boolean;
    auth: AUTH;
};
