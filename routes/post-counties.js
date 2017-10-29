const csvParser = require('../libs/csv-parser.js')

module.exports = {
    method: 'POST',
    path:'/post-counties',
    config: {
      payload: {
            //output: 'file',
            //parse: true,
            maxBytes: 10485760,
            allow: ['multipart/form-data', 'application/x-www-form-urlencoded']
        }
    },
    handler: function (request, reply) {
        let file = request.payload.file
        csvParser(file)
          .then(parsedFile => reply(JSON.stringify(parsedFile)))
          .catch(error => reply(error))
    }
}
