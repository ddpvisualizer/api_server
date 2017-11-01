describe('/post-counties', () => {
    let postCountiesPath
    let countySchemaMock
    let csvParserMock
    let parsedCountiesMock
    let countyDBMock

    before(() => {
        parsedCountiesMock = [
            {
                name: 'MOCK_NAME',
                state: 'MOCK_STATE',
                fips: 'MOCK_FIPS',
                years: [{year: 'YEAR_MOCK'}]
            }
        ]

        csvParserMock = spy(() => new Promise(resolve => resolve(parsedCountiesMock)))
        countyDBMock = {
            _id: 'MOCK_ID'
        }

        countySchemaMock = {
            findOne: spy(() => new Promise(resolve => resolve())),
            create: spy(() => new Promise(resolve => resolve(countyDBMock))),
            update: stub()
        }

        postCountiesPath = proxyquire('src/routes/post-counties.js', {
            '../libs/csv-parser.js': csvParserMock,
            '../libs/mongo-store.js': {County: countySchemaMock},
            'joi': {
                any: stub().returns('MOCK_ANY'),
                string: stub().returns({min: stub().returns('MOCK_MIN')}),
            }
        })
    })

    it('should have correct configuration', () => {
        expect(postCountiesPath.method).to.equal('POST')
        expect(postCountiesPath.path).to.equal('/post-counties')
        expect(postCountiesPath.config.validate.payload.file).to.equal('MOCK_ANY')
        expect(postCountiesPath.config.validate.payload.key).to.equal('MOCK_ANY')
        expect(postCountiesPath.config.validate.payload.metric).to.equal('MOCK_MIN')
        expect(typeof(postCountiesPath.handler)).to.equal('function')
    })

    it('should reject if key is invalid', () => {
        let replyMock = stub()
        let requestMock = {
            payload: {
                key: 'MOCK_KEY',
                file: 'MOCK_FILE',
                metric: 'MOCK_METRIC'
            }
        }

        process.env.POST_KEY = 'MOCK_KEY_2'
        postCountiesPath.handler(requestMock, replyMock)

        expect(replyMock).to.have.been.called
        expect(replyMock).to.have.been.calledWith('Invalid key')
    })

    it('should take file and populate data', () => {
        let replyMock = stub()
        let requestMock = {
            payload: {
                key: 'MOCK_KEY',
                file: 'MOCK_FILE',
                metric: 'MOCK_METRIC'
            }
        }
        process.env.POST_KEY = 'MOCK_KEY'
        postCountiesPath.handler(requestMock, replyMock)

        expect(replyMock).to.have.been.called
        expect(replyMock).to.have.been.calledWith('file uploaded, data is being populated')

        return setTimeout(() => {
            expect(csvParserMock).to.have.been.calledWith('MOCK_FILE')
            expect(countySchemaMock.findOne).to.have.been.calledWithMatch({fips: parsedCountiesMock[0].fips})
            expect(countySchemaMock.create).to.have.been.calledWithMatch({
                name: parsedCountiesMock[0].name,
                state: parsedCountiesMock[0].state,
                fips: parsedCountiesMock[0].fips,
                metrics: []
            })
            expect(countySchemaMock.update).to.have.been.calledWithMatch({_id: 'MOCK_ID'}, {
                $push: {
                    metrics: {
                        name: 'MOCK_METRIC',
                        years: [{year: 'YEAR_MOCK'}]
                    }
                }
            })
        }, 0)
    })
})
