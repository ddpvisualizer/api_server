//const XLSX = require('xlsx');

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
        //const requestData = request.payload;
        //let result = XLSX.read(requestData.file);
        //result = XLSX.utils.sheet_to_json(result.Sheets[result.SheetNames[0]]);
        //console.log(result)
        //reply(JSON.st);
        //reply(Object.keys(request.body));
    }
};
