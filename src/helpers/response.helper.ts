import { Response } from 'express';
import httpStatus from 'http-status';

export default (res: Response, status, message: string, body: unknown, errors?: unknown): Response => {
    return res.status(status).json({
        status,
        message,
        body,
        errors,
    });
};