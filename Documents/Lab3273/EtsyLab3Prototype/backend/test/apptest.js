import app from "../app.js";
var assert = require('chai').assert;
var chai = require('chai');
chai.use(require('chai-http'));
const request = require('supertest');
let should = chai.should();
var expect = require('chai').expect;

var agent = require('chai').request.agent(app);

describe('Login', function () {
    it('POST /login', done => {    
        agent.post('/login')
        .set('Accept', 'application/json')
        .send({"email":"sushan@gmail.com", "password":"admin"})
        .end((err,res)=>{
            if(err) throw err;
            expect(res.status).to.be.equal(200);
            done();
        });
    });
})