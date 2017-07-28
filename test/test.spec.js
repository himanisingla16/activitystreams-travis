
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

describe('Circle API', function() {
	it('should save circle without error', (done) => {
		chai.request('http://localhost:4000')
		.post('/circle')
		.set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiY2lyY2xlczphbGwiLCJmb2xsb3dzOmFsbCIsIm1haWxib3g6YWxsIl0sImlhdCI6MTUwMDU3MDYyMX0.YqHdtxTPeq5UoT9yUhQw9gziURvdHAfaiALOwlhGCTg`)
		.end((err, res) => {
			res.should.have.status(200);
			expect(res.body).to.be.an('object').to.have.property('circleId');
			expect(res.body).to.be.an('object').to.have.property('mailboxId');
			expect(res.body).to.be.an('object').to.have.property('createdOn');
			done();});
	});
});