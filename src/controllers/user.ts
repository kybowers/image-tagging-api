import { Request, Response, NextFunction } from 'express';
import { User, UserDocument, AuthToken } from '../models/User';
import Bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const tokenOptions = {
    expiresIn: process.env.JWT_EXPIRES,
    issuer: process.env.JWT_ISSUER,
};
const refreshTokenOptions = {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
    issuer: process.env.JWT_ISSUER,
};

const signAccessAndRefreshToken = (
    payload: any,
    request: Request,
    response: Response
) =>
    jwt.sign(payload, process.env.JWT_SECRET, tokenOptions, (error, token) => {
        if (error) {
            response.sendStatus(500);
        } else {
            jwt.sign(
                payload,
                process.env.JWT_REFRESH_SECRET,
                refreshTokenOptions,
                (error, refreshToken) => {
                    if (error) {
                        response.sendStatus(500);
                    } else {
                        response.status(200).send({
                            status: 'Logged in',
                            token: token,
                            refreshToken: refreshToken,
                        });
                    }
                }
            );
        }
    });

export const postLogin = (request: Request, response: Response) => {
    const { username, password } = request.body;
    User.findOne({ username: username }, (error, user) => {
        if (user) {
            if (Bcrypt.compareSync(password, user.password)) {
                signAccessAndRefreshToken(
                    { username: username },
                    request,
                    response
                );
            }
        } else {
            response.sendStatus(401);
        }
    });
};

export const postSignup = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { username, password } = request.body;

    const user = new User({
        username: username,
        password: password,
    });
    user.save((error) => {
        if (error) {
            return next(error);
        }
        signAccessAndRefreshToken({ username: username }, request, response);
    });
};

export const getOwnUser = (request: Request, response: Response) => {
    if (request.decoded && request.decoded.username) {
        User.findOne({ username: request.decoded.username }, (error, user) =>
            user ? response.status(200).json(user) : response.sendStatus(404)
        );
    } else {
        response.sendStatus(401);
    }
};
