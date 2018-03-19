import { expect } from 'chai';
import * as sinon from 'sinon';
import * as bcrypt from 'bcryptjs';
import { User } from '../../src/users/User';

describe('User', () => {
    describe('constructor', () => {
        it('should set password as encrypted password', () => {
            sinon.stub(bcrypt, 'genSaltSync').withArgs(10).returns('salty');
            sinon.stub(bcrypt, 'hashSync').withArgs('newPassword', 'salty').returns('encryptedPassword');

            const user = new User('username', 'newPassword');

            expect(user.password).to.equal('encryptedPassword');
        });
    });

    describe('comparePassword', () => {
        it('should call bcrypt to compare passwords', () => {
           sinon.stub(bcrypt, 'compareSync').withArgs('passwordInput', 'passwordHash').returns(true);

           const actual = User.comparePassword('passwordInput', 'passwordHash');
           expect(actual).to.be.true;
        });
    });
});