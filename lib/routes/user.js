'use strict';

const Joi = require('joi')

module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
            tags: ['api'],
            auth : false,
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    userName: Joi.string().required().min(3).example('Superman').description('Username of the user'),
                    password: Joi.string().required().min(8).example('azerty123').description('Lastname of the user'),
                    mail: Joi.string().email({tlds: {allow: false}}).example('Superman@gmail.com').description('Email of the user'),
                })
            }
        },
        handler: async (request, h) => {

            const { userService, mailService } = request.services();
            const result = await userService.create(request.payload);
            if(result){
                mailService.sendMail(request.payload);
            }
            return result;
        }
    },
    {
        method: 'delete',
        path: '/user/{id}',
        options: {
            tags: ['api'],
            auth : {
                scope: [ 'admin' ]
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1).required().description('User ID'),
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            await userService.delete(request.params.id);

            return '';
        }
    },
    {
        method: 'get',
        path: '/users',
        options: {
            auth : {
                scope: [
                    'admin',
                    'user',
                ]
            },
            tags: ['api'],
        },
        handler: async (request, h) => {

            const { User } = request.models();

            // Objection retourne des promeses, il ne faut pas oublier des les await.
            const users = await User.query();

            return users;
        }
    },
    {
        method: 'patch',
        path: '/user/{id}',
        options: {
            auth : {
                scope: [ 'admin' ]
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1).required().description('User ID'),
                }),
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    userName: Joi.string().required().min(3).example('Superman').description('Username of the user'),
                    password: Joi.string().required().min(8).example('azerty123').description('Lastname of the user'),
                    mail: Joi.string().email({tlds: {allow: false}}).example('Superman@gmail.com').description('Email of the user'),
                }).min(1)
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const updatedUser = await userService.update(request.params.id, request.payload);
            return updatedUser;
        }
    },
    {
        method: 'POST',
        path: '/user/login',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    mail: Joi.string().email({ tlds: { allow: false } }).required(),
                    password: Joi.string().required().min(8)
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const verifyUser = await userService.verify(request.payload, h);
            return verifyUser;
        }
    },
    {
        method: 'post',
        path: '/user/{id}/admin',
        options: {
            tags: ['api'],
            auth : {
                scope: [ 'admin' ]
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1).required().description('User ID'),
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            const updatedUser = await userService.updateScopes(request.params.id, 'admin');

            return updatedUser;
        }
    },
    {
        method: 'post',
        path: '/favorite',
        options: {
            auth: {
                scope: [
                    'user',
                    'admin'
                ]
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    idMovie: Joi.number().integer().required().example(1).description('Id of movie'),
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const idUser = request.auth.credentials.id;
            const { idMovie } = request.payload;
            const response = await userService.addFavorite(idUser, idMovie);
            return response;
        }
    },
    {
        method: 'delete',
        path: '/favorite',
        options: {
            auth: {
                scope: [
                    'user',
                    'admin'
                ]
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    idMovie: Joi.number().integer().required().example(1).description('Id of movie'),
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const idUser = request.auth.credentials.id;
            const { idMovie } = request.payload;
            const response = await userService.deleteFavorite(idUser, idMovie);
            return response;
        }
    }
];