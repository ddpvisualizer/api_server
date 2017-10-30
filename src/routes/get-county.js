const {County} = require('../libs/mongo-store.js')

module.exports = {
    method: 'GET',
    path:'/get-county',
    handler: function (request, reply) {
        const fips = request.query.fips

        County.findOne({fips})
            .then(county => reply(county))
            .catch(error => reply(error))
    }
};
