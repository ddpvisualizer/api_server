const Joi = require('joi')

const csvParser = require('../libs/csv-parser.js')
const {County} = require('../libs/mongo-store.js')

module.exports = {
    method: 'POST',
    path:'/post-counties',
    config: {
        payload: {
            maxBytes: 10485760,
            allow: ['multipart/form-data', 'application/x-www-form-urlencoded']
        },
        validate: {
            payload: {
                key: Joi.any().valid(process.env.POST_KEY),
                file: Joi.any(),
                metric: Joi.string().min(3)
            }
        }
    },
    handler: function (request, reply) {
        let key    = request.payload.key
        let file   = request.payload.file
        let metric = request.payload.metric

        csvParser(file)
            .then(parsedCounties => Promise.all(counties.map(
                    parsedCounty => County.find({
                        name : parsedCounty.name,
                        state: parsedCounty.state
                    }).then((error, county) => {
                        if(error) {
                            return County.create({
                                name : parsedCounty.name,
                                state: parsedCounty.state,
                                fips : parsedCounty.fips,
                                metrics: []
                            }).then((error, county) => county)
                        } else {
                            return county
                        }
                    }).then(county => County.update(
                        {_id: county._id},
                        {
                            $push: {
                                metrics: {
                                    name : metric,
                                    years: parsedCounty.years
                                }
                            }
                        }
                    ))
                )
            ))
            .then(() => reply('done'))
            .catch(error => reply(error))
    }
}
