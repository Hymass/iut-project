'use strict';

const Joi = require('joi')

module.exports = [
    {
        method: 'post',
        path: '/movie',
        options: {
            tags: ['api'],
            auth : {
                scope: [ 'admin' ]
            },
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(3).example('Titanic').description('Movie title'),
                    description: Joi.string().min(3).example('Titanic is a movie').description('Movie description'),
                    release: Joi.number().min(1800).max(2023).example('1997').description('Year of release'),
                    director: Joi.string().min(8).example('James Cameron').description('Director'),
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();
            const result = await movieService.create(request.payload);
            return result;
        }
    },
    {
        method: 'patch',
        path: '/movie/{id}',
        options: {
            auth : {
                scope: [ 'admin' ]
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1).required().description('Movie ID'),
                }),
                payload: Joi.object({
                    title: Joi.string().min(3).example('Titanic').description('Movie title'),
                    description: Joi.string().min(3).example('Titanic is a movie').description('Movie description'),
                    release: Joi.number().min(1891).max(2023).example('1997').description('Year of release'),
                    director: Joi.string().min(8).example('James Cameron').description('Director'),
                }).min(1)
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            const updatedMovie = await movieService.update(request.params.id, request.payload);
            return updatedMovie;
        }
    },
];