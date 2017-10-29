module.exports = {
    method: 'GET',
    path:'/hello2',
    handler: function (request, reply) {
        return reply('hello world');
    }
};
