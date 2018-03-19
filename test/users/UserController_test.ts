import { expect } from 'chai';
import * as request from 'supertest';
import { app } from '../../src/app';
import * as passport from 'passport';
import * as sinon from 'sinon';
import { UserDb } from '../../src/users/UserDb';

describe('UserController', () => {
    let passportStub;

    beforeEach(() => {
        passportStub = sinon.stub(passport, 'authenticate').returns(() => {
        });
        passportStub.yields(null, {username: 'user1'});
    });

    afterEach(() => {
        passportStub.restore();
    });

    describe('POST /users', () => {
        let dbStub;

        beforeEach(() => {
            dbStub = sinon.stub(UserDb.prototype, 'create');
        });

        afterEach(() => {
            dbStub.restore();
        });

        it('should return 201 when user is successfully created', (done) => {
            dbStub.returns({id: 'user1_id'});

            request(app)
                .post('/users')
                .set('Accept', /json/)
                .send({username: 'user1', password: 'secret'})
                .expect(201, {
                    message: 'User saved successfully!', id: 'user1_id'
                }, done);
        });

        it('should return 400 when user creation fails', (done) => {
            dbStub.throws();

            request(app)
                .post('/users')
                .set('Accept', /json/)
                .send({username: 'user1', password: 'secret'})
                .expect(400, done);
        });
    });

    describe('GET /users/:name', () => {
        let dbStub;

        beforeEach(() => {
            dbStub = sinon.stub(UserDb.prototype, 'findByUsername');
        });

        afterEach(() => {
            dbStub.restore();
        });

        it('should return a 200 when user exists', (done) => {
            dbStub.withArgs('user1').returns({username: 'user1'});

            request(app)
                .get('/users/user1')
                .expect(200, {
                    username: 'user1'
                }, done);
        });

        it('should return a 404 when user does not exist', (done) => {
            dbStub.withArgs('user1').returns(null);

            request(app)
                .get('/users/user1')
                .expect(404, {
                    error: 'Username does not exist'
                }, done);
        });

        it('should return a 400 for bad request', (done) => {
            dbStub.withArgs('user1').throws();

            request(app)
                .get('/users/user1')
                .expect(400, done);
        });
    });
});