global.chai = require('chai');
global.sinon = require('sinon')

global.expect = chai.expect
global.stub = sinon.stub
global.spy = sinon.spy

chai.use(require('sinon-chai'))
chai.use(require('chai-as-promised'));

const proxyquire = require('proxyquire')
global.proxyquire = (path, mocks) => proxyquire(process.cwd() + '/' + path, mocks)
