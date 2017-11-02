const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection({
    host: '0.0.0.0',
    port: process.env.PORT,
    config: {
        cors: {
            origin: ['*']
        }
    }
})

server.route(require('./routes/post-counties.js'))
server.route(require('./routes/get-county.js'))
server.route(require('./routes/get-counties.js'))
server.route(require('./routes/put-favored.js'))

server.start((err) => {

    if (err) {
        throw err
    }
    console.log('Server running at:', server.info.uri)
});
