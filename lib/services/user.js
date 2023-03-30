'use strict';

const { Service } = require('@hapipal/schmervice');
const crypt = require('@hymas/iut-encrypt');
const Jwt = require("@hapi/jwt");

module.exports = class UserService extends Service {

    async create(user){
        const { User } = this.server.models();
        const passwordEncrypt = await crypt.sha1(user.password);
        user.password = passwordEncrypt;
        return User.query().insertAndFetch(user);
    }

    async update(id, data) {
        const { User } = this.server.models();
        const user = await User.query().findById(id);

        if (!user) {
            throw new Error('User not found');
        }

        // Update user properties with new data
        if (data.firstName) {
            user.firstName = data.firstName;
        }
        if (data.lastName) {
            user.lastName = data.lastName;
        }
        if (data.userName) {
            user.userName = data.userName;
        }
        if (data.mail) {
            user.mail = data.mail;
        }
        if (data.password) {
            const passwordEncrypt = await crypt.sha1(data.password);
            user.password = passwordEncrypt;
        }

        // Save updated user
        return User.query().upsertGraph(user, { relate: true, unrelate: true });
    }

    async delete(id) {
        const { User } = this.server.models();
        await User.query().deleteById(id);
    }

    async verify(payload, h) {
        const { User } = this.server.models();
        const { mail, password } = payload;
        const user = await User.query().findOne({ mail });

        if (!user) {
            return h.response('Invalid email or password').code(401);
        }

        const isPasswordValid = await crypt.compareSha1(password, user.password);
        if (!isPasswordValid) {
            return h.response('Invalid email or password').code(401);
        }

        // Génération du JWT
        const token = Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                mail: user.mail,
                scope: user.scope,
            },
            {
                key: "alexkey",
                algorithm: 'HS512',
            },
            {
                ttlSec: 14400 // 4 hours
            }
        );

        return { token };
    }

    async updateScopes(id, scope) {
        const { User } = this.server.models();
        const user = await User.query().findById(id);
        user.scope = scope;
        return User.query().upsertGraph(user, { relate: true, unrelate: true });
    }

    async addFavorite(idUser, idMovie) {
        const { Movie, Favorie } = this.server.models();

        await Movie.query().findById(idMovie).throwIfNotFound();

        const favori = await Favorie.query().select().where({
            'idUser': idUser,
            'idMovie': idMovie
        });

        if (favori.length !== 0) {
            return "Movie always in favorite"
        }

        return Favorie.query().insertAndFetch({'idUser': idUser, 'idMovie': idMovie});
    }

    async deleteFavorite(idUser, idMovie) {
        const { Movie, Favorie } = this.server.models();

        await Movie.query().findById(idMovie).throwIfNotFound();

        const favorite = await Favorie.query().select().where({
            'idUser': idUser,
            'idMovie': idMovie
        });

        if (favorite.length === 0) {
            return "Movie not in favorites"
        }

        return Favorie.query().delete().where({
            'idUser': idUser,
            'idMovie': idMovie
        });
    }
}
