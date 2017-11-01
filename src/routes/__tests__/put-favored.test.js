describe('/puth-favored', () => {
    let putFavoredPath
    let countySchemaMock

    before(() => {
        countySchemaMock = {
            update: spy(() => new Promise(resolve => resolve()))
        }
        putFavoredPath = proxyquire('src/routes/put-favored.js', {
            '../libs/mongo-store.js': {County: countySchemaMock}
        })
    })

    it('should have correct configuration', () => {
        expect(putFavoredPath.method).to.equal('PUT')
        expect(putFavoredPath.path).to.equal('/put-favored')
        expect(typeof(putFavoredPath.handler)).to.equal('function')
    })

    it('should return one county', () => {
        let reply = stub()

        putFavoredPath.handler({payload: {fips: 'MOCK_FIPS', favored: 'MOCK_FAVORED'}}, reply)
        expect(countySchemaMock.update).to.have.been.calledWithMatch(
            {fips: 'MOCK_FIPS'},
            {favored: 'MOCK_FAVORED'}
        )

        return setTimeout(() => {
            expect(reply).to.have.been.called
            expect(reply).to.have.been.calledWithMatch('succeed')
        }, 0)
    })
})
