import { Request, Response } from 'express';
import { File } from '../models/File';
import { User } from '../models/User';

export const getFiles = async (request: Request, response: Response) => {
    const files = await File.find({},).populate('reviewer', 'username');
    response.status(200).json(files);
};

export const getFile = async (request: Request, response: Response) => {
    if (request.decoded && request.decoded.username) {
        const md5 = request.params.fileId;
        const files = await File.find({md5: md5},).populate('reviewer', 'username');
        response.status(200).json(files);
    }
};

// TODO delete this, it is useful for development but not meant for release
export const createFile = async (request: Request, response: Response) => {
    if (request.decoded && request.decoded.username) {
        const { name, md5, location } = request.body;
        const user = await User.findOne({
            username: request.decoded.username,
        });
        const file = new File({
            name: name,
            md5: md5,
            location: location,
            status: 'pending',
            reviewer: user,
        });
        await file.save();
        response.status(200).json(file);
    } else {
        response.sendStatus(401);
    }
};

export const saveTags = async (request: Request, response: Response) => {
    if (request.decoded && request.decoded.username) {
        const md5 = request.params.fileId;
        const tags = request.body;
        const user = await User.findOne({
            username: request.decoded.username,
        });
        const filter = { md5: md5 };
        await File.findOneAndUpdate(filter, { tags: tags, reviewer: user });
        const file = await File.findOne(filter);
        if (!file) {
            response.sendStatus(404);
        } else {
            response.status(200).json(file);
        }
    } else {
        response.sendStatus(401);
    }
};
