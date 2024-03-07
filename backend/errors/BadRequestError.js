import { StatusCodes } from 'http-status-codes'
export class BadRequest extends Error{
    constructor(message) {
        super(message)
        this.StatusCode = StatusCodes.BAD_REQUEST
    }
}