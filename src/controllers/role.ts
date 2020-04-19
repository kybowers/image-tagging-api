import { Request, Response, NextFunction } from 'express';
import { Role, RoleDocument } from '../models/Role';

export const getRoles = (request: Request, response: Response) => {
    Role.find({}, (error, roles) => {
        response.status(200).json(roles);
    });
};

export const createRole = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { name, description, permissions } = request.body;
    const role = new Role({
        name: name,
        description: description,
        permissions: permissions,
    });
    role.save((error) => {
        if (error) {
            return next(error);
        }
        response.status(200).json(role);
    });
};

export const updateRole = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { name } = request.body;
    const filter = {name: name};
    await Role.findOneAndUpdate(filter, {...request.body});
    const role = await Role.findOne(filter);
    if (!role) {
        response.sendStatus(404);
    } else {
        response.status(200).json(role);
    }
};
