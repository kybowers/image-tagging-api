'use strict';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import session from 'express-session';
import mongo from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';
import path from 'path';
import helmet from 'helmet';
import * as userController from './controllers/userController';
import * as roleController from './controllers/roleController';
import * as fileController from './controllers/fileController';
import { isAuthenticated } from './middleware/passport';

const app = express();

const MongoStore = mongo(session);
const mongoURI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOSTNAME}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}?authSource=admin`;
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {})
    .catch((err) => {
        console.log(
            'MongoDB connection error. Please make sure MongoDB is running. ' +
                err
        );
        // process.exit();
    });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
        store: new MongoStore({
            url: mongoURI,
            autoReconnect: true,
            ttl: 1 * 24 * 60 * 60, // = 1 day
        }),
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.post('/login', userController.postLogin);
app.get("/logout", userController.logout);
app.post('/users', userController.postSignup);
app.get('/users/self', isAuthenticated, userController.getOwnUser);
app.get('/users', userController.getAllUsers);
app.post('/roles', roleController.createRole);
app.get('/roles', roleController.getRoles);
app.put('/roles', roleController.updateRole);
app.post('/files', isAuthenticated, fileController.createFile);
app.get('/files', isAuthenticated, fileController.getFiles);
app.put('/files/:fileId', isAuthenticated, fileController.saveTags);
app.get('/files/:fileId', isAuthenticated, fileController.getFile);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export default app;
