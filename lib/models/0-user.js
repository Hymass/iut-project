'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get tableName() {

        return 'user';
    }

    static get jsonAttributes(){

        return ['scope']
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
            scope: Joi.string(),
            userName: Joi.string().min(3).example('Superman').description('Username of the user'),
            password: Joi.string().min(8).example('azerty123').description('Password of the user'),
            mail: Joi.string().email({tlds: {allow: false}}).example('superman@gmail.com').description('Email of the user'),
        });
    }

    static get jsonAttributes(){

        return ['scope']
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
        this.scope = '["user"]';
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

};