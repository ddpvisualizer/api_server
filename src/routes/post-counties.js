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
                file: Joi.any(),
                key: Joi.any(),
                metric: Joi.string().min(3)
            }
        }
    },
    handler: function (request, reply) {
        let key    = request.payload.key
        let file   = request.payload.file
        let metric = request.payload.metric

        if(key !== process.env.POST_KEY) {
            reply('Invalid key')
        } else {
            reply('file uploaded, data is being populated')

            csvParser(file)
                .then(parsedCounties => {
                    return Promise.all(parsedCounties.map(
                            parsedCounty => {
                                //console.log('ready to find ' + parsedCounty.name)
                                return County.findOne({
                                    fips: parsedCounty.fips
                                }).then(county => {
                                    //console.log('seached county ' + parsedCounty.name)
                                    //console.log(county)
                                    if(county) {
                                        //console.log('not found ' + parsedCounty.name)
                                        return county
                                    } else {
                                        //console.log('creating ' + parsedCounty.name)
                                        return County.create({
                                            name   : parsedCounty.name,
                                            state  : parsedCounty.state,
                                            fips   : parsedCounty.fips,
                                            metrics: []
                                        }).then(county => {
                                            //console.log('create ' + county.name)
                                            return county
                                        })
                                    }
                                }).then(county => {
                                    //console.log(`update ${county.name}`)
                                    return County.update(
                                        {_id: county._id},
                                        {
                                            $push: {
                                                metrics: {
                                                    name : metric,
                                                    years: parsedCounty.years
                                                }
                                            }
                                        }
                                    )
                                })
                            }
                        )
                    )
                })
                .then(() => console.log('data population done'))
                .catch(error => console.log(error))
        }
    }
}
