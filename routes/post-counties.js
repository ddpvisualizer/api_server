const csvParser = require('../libs/csv-parser.js')
const {County} = require('../libs/mongo-store.js')

module.exports = {
    method: 'POST',
    path:'/post-counties',
    config: {
      payload: {
            maxBytes: 10485760,
            allow: ['multipart/form-data', 'application/x-www-form-urlencoded']
        }
    },
    handler: function (request, reply) {
        let file = request.payload.file
        if (request.payload.key !== process.env.POST_KEY) {
          reply('Invalid key')
        } else {
          csvParser(file)
            .then(counties => {
              counties.forEach(county => County.create(county))
              reply('done')
            })
            .catch(error => reply(error))
        }
    }
}
