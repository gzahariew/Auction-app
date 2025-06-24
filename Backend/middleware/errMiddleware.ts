import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppErr';
import { QueryFailedError } from 'typeorm';

const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'An unexpected error occurred.';

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof QueryFailedError) {
        statusCode = 400;
        message = 'Database operation failed.';
        if (err.driverError.code === 'SQLITE_CONSTRAINT') {
            statusCode = 409;
            message = 'A data conflict occurred (e.g., duplicate entry or foreign key violation).';
        }
        console.error('TypeORM QueryFailedError:', err.message, err.driverError);
    } else {
        console.error('Unhandled Server Error:', err);
    }

    const errorResponse = {
        status: 'error',
        statusCode: statusCode,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    };

    res.status(statusCode).json(errorResponse);
};

export default errorMiddleware;