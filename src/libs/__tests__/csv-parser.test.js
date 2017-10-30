describe('CSV Parser', () => {
    let csvtojsonMock
    let csvtojsonObjectMock = {}
    let CSVParser

    before(() => {
        csvtojsonObjectMock.fromString = stub().returns(csvtojsonObjectMock)
        csvtojsonObjectMock.on = stub().returns(csvtojsonObjectMock)
        csvtojsonMock = stub().returns(csvtojsonObjectMock)

        CSVParser = proxyquire('src/libs/csv-parser.js', {
            'csvtojson': csvtojsonMock
        })
    })

    it('should call external functions correctly', () => {
        CSVParser('TEST_CSV_STRING')
        expect(csvtojsonMock).to.have.been.calledWithMatch({noheader: true})
        expect(csvtojsonObjectMock.fromString).to.have.been.calledWith('TEST_CSV_STRING')
        expect(csvtojsonObjectMock.on).to.have.been.calledWithMatch('csv', sinon.match.func)
        expect(csvtojsonObjectMock.on).to.have.been.calledWithMatch('done', sinon.match.func)
    })

    it('should parse correctly', () => {
        //csvtojsonObjectMock.on = stub().callsArg(1).returns(csvtojsonObjectMock)
    })
})
