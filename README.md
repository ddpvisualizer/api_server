# API Server for Disease Control and Prevention Visualizer
[![Build Status](https://travis-ci.org/ddpvisualizer/api_server.svg?branch=master)](https://travis-ci.org/ddpvisualizer/api_server)
The goal of this project is to create an api server that recieves data from [Center for Disease Control and Prevention](https://www.cdc.gov/diabetes/data/countydata/countydataindicators.html), stores it its in a database and can be retrieved in a efficient way.

### Technology stack
* The API server runs on a NodeJS platform with [HapiJS](https://hapijs.com/). The data is stored in a [MongoDB](https://www.mongodb.com/) by using [mongoose](http://mongoosejs.com/).
Testing is done with [Mocha](https://mochajs.org/), [sinon](http://sinonjs.org/), [chai](http://chaijs.com/) and [proxyquire](https://www.npmjs.com/package/proxyquire).

* This repository is hosted in a [Heroku App](https://ddpvisualizer-api.herokuapp.com/) for testing. It is also running continuous integration in [TravisCI](https://travis-ci.org/ddpvisualizer/api_server)

### Total time it took
This will be added soon.

**API Documentation**

* `GET` /get-counties
    Parameters: None
    Request Data: None
    Returns: An array of counties represented as objects with name, FIPS, state and if they're favored.

* `GET` /get-county
    Parameters: `fips=[county_fips]`, the FIPS of the counties.
    Request Data: None
    Returns: An object with all the information about that county and its disease data.

* `PUT` /put-favored
    Parameters: None
    Request Data:
        - `fips`: the FIPS number of the county we want to favored or unfavored.
        - `favored`: the value we want to put (true or false)
    Returns: `Succeed` in case of a successful update.
* `POST` /post-counties
    Parameters: None
    Request Data:
        `file`: CSV file containing the information for a desease. It has to have the structure of [Center for Disease Control and Prevention](https://www.cdc.gov/diabetes/data/countydata/countydataindicators.html) and be in CSV format.
        `key`: Secret key for performing POST operations
        `metric`: Name of the metric related to the provided file
    Returns: Returns a message saying the data stated to populate. It may take a while.
