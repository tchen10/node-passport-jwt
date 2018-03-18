import { StandardError } from './StandardError';

export class DbError extends StandardError {
    readonly name: string = 'DbError';
}