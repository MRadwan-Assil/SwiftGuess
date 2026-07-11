export abstract class HttpError extends Error {
    abstract statusCode: number;
}

export class ServerFailedToStart extends Error {
    public constructor(message: string) {
        super(`Failed to start server.\n${message}`);
    }
}

export class UnsupportedOrInvalidHTTPMethod extends Error {
    public constructor(methodName: string) {
        super(`Unsupported or invalid HTTP method "${methodName}".`);
    }
}

export class PlayerAlreadyExists extends Error {
    public constructor(username: string, tag: string) {
        super(`User already exists. "${username}#${tag}"`);
    }
}

export class UsernameAndTagRequired extends HttpError {
    public statusCode: number = 400;

    public constructor() {
        super(`"username" and "tag" required.`);
    }
}

export class UsernameOrTagIsTooShortOrTooBig extends HttpError {
    public statusCode: number = 400;

    public constructor() {
        super(`"username" and "tag" is too short or too big.`);
    }
}

export class BadRequest extends HttpError {
    public statusCode: number = 400;

    public constructor() {
        super(`Bad request.`);
    }
}

export class DatabaseIsNULL extends Error {
    public constructor() {
        super(`Database is NULL`);
    }
}

export class ErrorAddingNewRowToTable extends Error {
    public constructor(tableName: string) {
        super(`Error while adding new row to table "${tableName}"`);
    }
}