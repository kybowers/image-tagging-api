import passport from 'passport';
import passportLocal from 'passport-local';
import HeaderAPIKeyStrategy from 'passport-headerapikey';
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

passport.use(
    new HeaderAPIKeyStrategy(
        { header: 'Authorization', prefix: 'Api-Key ' },
        false,
        (apikey, done) => {
            User.findOne({ apiKey: apikey }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            });
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
        return response.redirect('/login');
    }
};

export const authenticateAPIKey = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    passport.authenticate('headerapikey', { session: false })(
        request,
        response,
        next
    );
};
