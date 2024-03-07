import { StatusCodes } from "http-status-codes";

export class UnAuthentication extends Error {
    constructor(message) {
        super(message);
        this.StatusCode = StatusCodes.UNAUTHORIZED;
    }
}