import * as bcrypt from 'bcryptjs';

export interface IUser {
    username: string;
    password: string;
}

export class User implements IUser {
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.encryptPassword(password);
    }

    private encryptPassword(passwordInput: string): void {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(passwordInput, salt);
    }

    static comparePassword(passwordInput: string, passwordHash: string): boolean {
        return bcrypt.compareSync(passwordInput, passwordHash);
    }
}
