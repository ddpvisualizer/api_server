const {County} = require('../libs/mongo-store.js')

module.exports = {
    method: 'GET',
    path:'/get-counties',
    handler: function (request, reply) {
        County.find({}, {fips: true, name: true, favored: true, state: true})
            .then(counties => reply(counties.map(county => ({
                fips: county.fips,
                name: county.name,
                favored: county.favored,
                state: county.state
            }))))
            .catch(error => reply(error))
    }
};
