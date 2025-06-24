export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = "Resource not found") {
        super(message, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = "Bad request") {
        super(message, 400);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = "Unauthorized") {
        super(message, 401);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = "Forbidden") {
        super(message, 403);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = "Conflict") {
        super(message, 409);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}