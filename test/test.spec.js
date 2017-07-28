
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

describe('Circle API', function() {
	it('should save circle without error', (done) => {
		chai.request('http://localhost:4000')
		.post('/circle')
		.end((err, res) => {
			res.should.have.status(200);
			done();
		});
	});
});