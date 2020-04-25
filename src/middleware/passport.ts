import passport from 'passport';
import passportLocal from 'passport-local';
import { Request, Response, NextFunction } from 'express';

import { User, UserDocument } from '../models/User';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(
    new LocalStrategy(
        { usernameField: 'username' },
        (username, password, done) => {
            User.findOne(
                { username: username.toLowerCase() },
                (err, user: any) => {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(undefined, false, {
                            message: `User ${username} not found.`,
                        });
                    }
                    user.comparePassword(
                        password,
                        (err: Error, isMatch: boolean) => {
                            if (err) {
                                return done(err);
                            }
                            if (isMatch) {
                                return done(undefined, user);
                            }
                            return done(undefined, false, {
                                message: 'Invalid email or password.',
                            });
                        }
                    );
                }
            );
        }
    )
);

export const isAuthenticated = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (request.isAuthenticated()) {
        return next();
    } else {
        return response.redirect("/login");
    }
};

// I don't think I'll ever need this, but I'll keep it just in case
export const isAuthorized = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const provider = request.path.split('/').slice(-1)[0];

    const user = request.user as UserDocument;
    if (user.tokens.find((token) => token.kind === provider)) {
        next();
    } else {
        response.status(401).send('Not authorized by a known provider');
    }
};
