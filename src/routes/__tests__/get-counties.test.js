describe('/get-counties', () => {
    let getCountiesPath
    let countySchemaMock
    let countiesMock

    before(() => {
        countiesMock = [
            {
                fips: 'MOCK_FIPS',
                name: 'MOCK_NAME',
                favored: false,
                state: 'MOCK_STATE'
            }
        ]
        countySchemaMock = {
            find: spy(() => new Promise(resolve => resolve(countiesMock)))
        }
        getCountiesPath = proxyquire('src/routes/get-counties.js', {
            '../libs/mongo-store.js': {County: countySchemaMock}
        })
    })

    it('should have correct configuration', () => {
        expect(getCountiesPath.method).to.equal('GET')
        expect(getCountiesPath.path).to.equal('/get-counties')
        expect(typeof(getCountiesPath.handler)).to.equal('function')
    })

    it('should return all counties', () => {
        let reply = stub()

        getCountiesPath.handler(null, reply)
        expect(countySchemaMock.find).to.have.been.calledWithMatch({}, {fips: true, name: true, favored: true, state: true})

        return setTimeout(() => {
            expect(reply).to.have.been.calledOnce()
            expect(reply).to.have.been.calledWithMatch(countiesMock)
        }, 0)
    })
})
