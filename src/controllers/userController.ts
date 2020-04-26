import { Request, Response, NextFunction, response } from 'express';
import { User, UserDocument, AuthToken } from '../models/User';
import passport from 'passport';
import '../middleware/passport';
import { IVerifyOptions } from 'passport-local';

export const postLogin = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    passport.authenticate(
        'local',
        (err: Error, user: UserDocument, info: IVerifyOptions) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                response.sendStatus(401);
            }
            request.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                response.sendStatus(200);
            });
        }
    )(request, response, next);
};

export const logout = (request: Request, response: Response) => {
    request.logout();
    response.redirect('/');
};

export const postSignup = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { username, password, role } = request.body;

    const user = new User({
        username: username,
        password: password,
        role: role,
    });
    await user.save();
    response.status(200).json(user);
};

export const getOwnUser = async (request: Request, response: Response) => {
    response.status(200).json(request.user);
};

export const getUser = async (request: Request, response: Response) => {
    const id = request.params.userId;
    const filter = { _id: id };
    const user = await User.findOne(filter).populate('role');;
    if (!user) {
        response.sendStatus(404);
    } else {
        response.status(200).json(user);
    }
};

export const getAllUsers = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const users = await User.find({}).populate('role');
    response.status(200).json(users);
};

export const updateUser = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const id = request.params.userId;
    const filter = { _id: id };
    await User.findOneAndUpdate(filter, { role: request.body.role });
    const user = await User.findOne(filter);
    if (!user) {
        response.sendStatus(404);
    } else {
        response.status(200).json(user);
    }
};
