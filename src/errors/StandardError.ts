export class StandardError {
    readonly name: string = 'StandardError';
    readonly message: string;
    readonly error: any;

    constructor(message: string, error?: any) {
        this.message = message;
        this.error = error ? error : '';
    }

    toString(): string {
        return `${this.name}:${this.message}. ${this.error}`;
    }
}