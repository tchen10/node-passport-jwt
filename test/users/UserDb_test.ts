import { expect } from 'chai';
import * as sinon from 'sinon';
import { cloudant } from '../../src/config/db';
import { UserDb } from '../../src/users/UserDb';
import { User } from '../../src/users/User';
import { MockDb } from '../helpers/MockDb';

describe('UserDb', () => {
    let userDb: UserDb;
    let dbStub;

    beforeEach(() => {
        dbStub = new MockDb();
        sinon.stub(cloudant, 'use').returns(dbStub);
        userDb = new UserDb();
    });

    afterEach(() => {
        cloudant.use.restore();
    });

    describe('create', () => {
        it('should call insert with username and password', async () => {
            const dbSpy = sinon.spy(dbStub, 'insert');

            const user = new User('a user', 'a password');
            const result = await userDb.create(user);

            expect(dbSpy.withArgs({username: user.username, password: user.password}).calledOnce).to.be.true;
        });
    });

    describe('findByUsername', () => {

        afterEach(() => {
            dbStub.find.restore();
        });

        it('should return the first matching document', async () => {
            const query = {
                selector: {
                    username: 'user1'
                },
                fields: ['username', 'password']
            };

            sinon.stub(dbStub, 'find').withArgs(query).returns({
                docs: [
                    {username: 'user1'},
                    {username: 'user2'}
                ]
            });

            const dbUser = await userDb.findByUsername('user1');

            expect(dbUser.username).to.equal('user1');
        });

        it('should return null if user does not exist', async () => {
            sinon.stub(dbStub, 'find').returns({
                docs: []
            });

            const dbUser = await userDb.findByUsername('user1');

            expect(dbUser).to.equal(null);
        });
    });
});