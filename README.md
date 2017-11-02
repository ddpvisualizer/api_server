# API Server for Disease Control and Prevention Visualizer

[![Build Status](https://travis-ci.org/ddpvisualizer/api_server.svg?branch=master)](https://travis-ci.org/ddpvisualizer/api_server)

The goal of this project is to create an api server that recieves data from [Center for Disease Control and Prevention](https://www.cdc.gov/diabetes/data/countydata/countydataindicators.html), stores it its in a database and can be retrieved in a efficient way.
You can see the React/Redux client that uses this API: https://github.com/ddpvisualizer/client_app

### Technology stack
* The API server runs on a NodeJS platform with [HapiJS](https://hapijs.com/). The data is stored in a [MongoDB](https://www.mongodb.com/) by using [mongoose](http://mongoosejs.com/).
Testing is done with [Mocha](https://mochajs.org/), [sinon](http://sinonjs.org/), [chai](http://chaijs.com/) and [proxyquire](https://www.npmjs.com/package/proxyquire).

* This repository is hosted in a [Heroku App](https://ddpvisualizer-api.herokuapp.com/) for testing. It is also running continuous integration in [TravisCI](https://travis-ci.org/ddpvisualizer/api_server)

### Total time it took (11.5h)
1. Choose Framework (0.5h)
I thought about sails but I didn't want a complex MVC overkill for a simple API. I decided to go with hapijs+mongodb.
2. Setting up environment (0.5h)
Set up nodejs environment with a simple hapi POC. Created the corresponding github repo and created a heroku server instance for it.
3. XLSX file upload (2h)
Added file uploader. Parsing it was difficult since the modules I found didn't do a good job. I was loosing data.
Decided to go with CSV instead.
Also had an issue that took me while to realize: bad configured postman for form-data.
4. CSV Parser (0.5h)
Decided to create [my own parser](https://github.com/ddpvisualizer/api_server/blob/master/src/libs/csv-parser.js) for this app. I used a module to parse it as a 2D-array. My parser generates a nice data structure I could use for storage in mongo for each county.
5. Store data in mongodb (4h)
Had to iterate through all the counties and add them, design the schema, make it flexible to add more diseases if the county was already stored. Took some time to debug and make it work.
6. Additional put/get paths (0.5h)
It was very straightforward to implement `/get-county`, `/get-counties` and `/put-favored`. The data structure allowed it in an easy way.
7. Implement testing env (0.5h)
Added a test environment with mocha+sinon+chai+proxyquire
8. Test CSV parser (1h)
Add test for CSV parse Took me a bit. Mostly mocking time.
9. Test paths (1h)
Test structures are similar for paths, it wasn't very hard.
10. Add README.md (1h)
Implement some simple documentation about the project.

#### Things to improve
1. Create more path for editing/adding years/diseases in a county.
2. Add test for mongo-store
3. Add a linter and define code standards.


**API Documentation**

* `GET` /get-counties
    - Parameters: None
    - Request Data: None
    - Returns: An array of counties represented as objects with name, FIPS, state and if they're favored.

* `GET` /get-county
    - Parameters: `fips=[county_fips]`, the FIPS of the counties.
    - Request Data: None
    - Returns: An object with all the information about that county and its disease data.

* `PUT` /put-favored
    - Parameters: None
    - Request Data:
        - `fips`: the FIPS number of the county we want to favored or unfavored.
        - `favored`: the value we want to put (true or false)
    Returns: `Succeed` in case of a successful update.
* `POST` /post-counties
    - Parameters: None
    - Request Data:
        - `file`: CSV file containing the information for a desease. It has to have the structure of [Center for Disease Control and Prevention](https://www.cdc.gov/diabetes/data/countydata/countydataindicators.html) and be in CSV format.
        - `key`: Secret key for performing POST operations
        - `metric`: Name of the metric related to the provided file
    - Returns: Returns a message saying the data stated to populate. It may take a while.
