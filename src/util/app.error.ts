export class AppError extends Error {
    public status: number;
    public message: string;

    constructor(status: number, message: string) {
        super(message);
        this.message = message;
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            status: this.status,
            message: this.message,
        };
    }
}