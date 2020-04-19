import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware for verifying a valid auth token in request header
 * @param request 
 * @param response 
 * @param next 
 */
const validateAuthToken = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader) {
        const token = authorizationHeader.split(' ')[1]; // Bearer {token}
        try {
            request.decoded = <any>jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch (error) {
            throw new Error(error);
        }
    } else {
        response.status(401).send({
            error: 'Authentication error, token required.',
            status: 401,
        });
    }
};

export default validateAuthToken;
