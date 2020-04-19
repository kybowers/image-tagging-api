'use strict';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import helmet from 'helmet';
import * as userController from './controllers/user';
import * as roleController from './controllers/role';
import validateToken from './utils/validateAuthToken';


const app = express();
mongoose
    .connect(
        `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOSTNAME}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}?authSource=admin`,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }
    )
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

app.post('/login', userController.postLogin);
app.post('/users', userController.postSignup);
app.get('/users/self', validateToken, userController.getOwnUser);
app.get('/users', userController.getAllUsers);
app.post('/roles', roleController.createRole);
app.get('/roles', roleController.getRoles);
app.put('/roles', roleController.updateRole);

export default app;
