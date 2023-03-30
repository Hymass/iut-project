'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Favorie extends Model {
    static get tableName() {
        return 'favori';
    }

    static get joiSchema() {
        return Joi.object({
            idUser: Joi.number().integer().greater(0),
            idMovie: Joi.number().integer().greater(0)
        })
    }

    static get idColumn() {
        return ['idUser', 'idMovie'];
    }
}