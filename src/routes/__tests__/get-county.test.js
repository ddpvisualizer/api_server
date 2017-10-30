describe('/get-county', () => {
    let getCountyPath
    let countySchemaMock
    let countyMock

    before(() => {
        countyMock = {
            fips: 'MOCK_FIPS',
            name: 'MOCK_NAME',
            favored: false,
            state: 'MOCK_STATE',
            years: [
                {number: '123', percent: '1.2'},
                {number: '113', percent: '1.3'}
            ]
        }
        countySchemaMock = {
            findOne: spy(() => new Promise(resolve => resolve(countyMock)))
        }
        getCountyPath = proxyquire('src/routes/get-county.js', {
            '../libs/mongo-store.js': {County: countySchemaMock}
        })
    })

    it('should have correct configuration', () => {
        expect(getCountyPath.method).to.equal('GET')
        expect(getCountyPath.path).to.equal('/get-county')
        expect(typeof(getCountyPath.handler)).to.equal('function')
    })

    it('should return one county', () => {
        let reply = stub()

        getCountyPath.handler({query: {fips: 'MOCK_FIPS'}}, reply)
        expect(countySchemaMock.findOne).to.have.been.calledWithMatch({fips: 'MOCK_FIPS'})

        return setTimeout(() => {
            expect(reply).to.have.been.calledOnce()
            expect(reply).to.have.been.calledWithMatch(countyMock)
        }, 0)
    })
})
