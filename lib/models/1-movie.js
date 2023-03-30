'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Movie extends Model {

    static get tableName() {

        return 'movie';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(3).example('Titanic').description('Movie title'),
            description: Joi.string().min(3).example('Titanic is a movie').description('Movie description'),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
            release: Joi.number().min(1891).max(2023).example('1997').description('Year of release'),
            director: Joi.string().min(8).example('James Cameron').description('Director'),
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

};