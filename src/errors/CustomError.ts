export class CustomError extends Error {
	public readonly statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class NotFoundError extends CustomError {
	constructor(message: string) {
		super(message, 404);
	}
}

export class ForbiddenError extends CustomError {
	constructor(message: string) {
		super(message, 403);
	}
}

export class UnauthorizedError extends CustomError {
	constructor(message: string) {
		super(message, 401);
	}
}

export class BadRequestError extends CustomError {
	constructor(message: string) {
		super(message, 400);
	}
}

export class InternalServerError extends CustomError {
	constructor(message: string) {
		super(message, 500);
	}
}
