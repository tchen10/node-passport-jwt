import { expect } from 'chai';
import * as sinon from 'sinon';
import * as request from 'supertest';
import { app } from '../../src/app';
import { UserDb } from '../../src/users/UserDb';
import { User } from '../../src/users/User';
import * as jwt from 'jwt-simple';
import * as passport from 'passport';

describe('AuthController', () => {
    describe('Middleware: authenticate', () => {
        let passportStub;

        beforeEach(() => {
            passportStub = sinon.stub(passport, 'authenticate').returns(() => {});
        });

        afterEach(() => {
           passportStub.restore();
        });

        it('should return 401 unauthorized when authorization header is not provided', (done) => {
            passportStub.yields(null, false, { name: 'InvalidAuthToken', message: 'No auth token' });

            request(app)
                .get('/any')
                .expect(401, {
                    message: 'No auth token'
                }, done);
        });

        it('should return 401 unauthorized when authorization token is expired', (done) => {
            passportStub.yields(null, false, { name: 'TokenExpiredError', message: 'Your token has expired. Please generate a new one' });

            request(app)
                .get('/any')
                .set('Authorization', 'expired token')
                .expect(401, {
                    message: 'Your token has expired. Please generate a new one'
                }, done);
        });
    });

    describe('POST /login', () => {
        describe('when user is authenticated', () => {
            beforeEach(() => {
                sinon.stub(UserDb.prototype, 'findByUsername').withArgs('user1').returns({
                    username: 'user1',
                    password: 'aPassword'
                });
                sinon.stub(User, 'comparePassword').returns(true);
            });

            afterEach(() => {
                UserDb.prototype.findByUsername.restore();
                User.comparePassword.restore();
            });

            it('should return a status 201 when user is logged in', (done) => {
                request(app)
                    .post('/login')
                    .set('Accept', /json/)
                    .send({username: 'user1', password: 'secret'})
                    .expect(200)
                    .end(done);
            });

            it('should generate a token', (done) => {
                sinon.stub(jwt, 'encode').returns('secret token');

                request(app)
                    .post('/login')
                    .set('Accept', /json/)
                    .send({username: 'user1', password: 'secret'})
                    .expect(res => {
                        expect(res.body.token).to.contain('JWT secret token');
                        expect(res.body.username).to.equal('user1');
                    }).end(done);
            });
        });
    });
});