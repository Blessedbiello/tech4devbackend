export class ErrorResponse extends Error {
	statusCode: Number;
	constructor(message: any, statusCode: Number) {
		super(message);
		this.statusCode = statusCode;
	}
}