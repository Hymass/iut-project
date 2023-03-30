'use strict';

require('dotenv').config();
const { Service } = require('@hapipal/schmervice');

module.exports = class MovieService extends Service {
    create(movie) {
        const { Movie } = this.server.models();

        if(movie.release > 1890 && movie.release < 2023){
            return Movie.query().insertAndFetch(movie);
        }
        else{
            return "The year must be between 1891 and 2023"
        }

    }

    async update(id, data) {
        const { Movie } = this.server.models();
        const movie = await Movie.query().findById(id);

        if (!movie) {
            throw new Error('Movie not found');
        }

        // Update user properties with new data
        if (data.title) {
            movie.title = data.title;
        }
        if (data.release) {
            if(data.release > 1890 && data.release < 2023){
                movie.release = data.release;
            }
            else{
                return "The year must be between 1891 and 2023"
            }
        }
        if (data.director) {
            movie.director = data.director;
        }
        if (data.description) {
            movie.description = data.description;
        }

        // Save updated user
        return Movie.query().upsertGraph(movie, { relate: true, unrelate: true });
    }

}