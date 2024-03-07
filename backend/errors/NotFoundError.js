import { StatusCodes } from "http-status-codes";

export class NotFound extends Error {
    constructor(message) {
        super(message)
        this.StatusCode = StatusCodes.NOT_FOUND
    }
}