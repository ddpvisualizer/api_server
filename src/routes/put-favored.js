const {County} = require('../libs/mongo-store.js')

module.exports = {
    method: 'PUT',
    path:'/put-favored',
    handler: function (request, reply) {
        const fips = request.payload.fips
        const favored = request.payload.favored || false

        County.update({fips}, {favored})
            .then(() => reply('succeed'))
            .catch(error => reply(error))
    }
};
