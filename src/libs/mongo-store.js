const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const MONGODB_USER = process.env.MONGODB_USER
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const MONGODB_SERVER = process.env.MONGODB_SERVER

mongoose.connect(`mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_SERVER}`, { useMongoClient: true });
mongoose.Promise = global.Promise;

let countySchema = {
    name: String,
    state: String,
    fips: {type: String, unique: true},
    favored: {type: Boolean, 'default': false},
    metrics: [{
      name: String,
      years: [{
        year: String,
        number: String,
        percent: String,
        lowerConfidenceLimit: String,
        upperConfidenceLimit: String,
        ageAjustedPercent: String,
        ageAjustedLowerConfidenceLimit: String,
        ageAjustedUpperConfidenceLimit: String
      }]
    }]
};

module.exports = {
    County: mongoose.model('County', new Schema(countySchema))
};
