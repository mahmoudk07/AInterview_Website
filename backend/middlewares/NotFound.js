import { StatusCodes } from "http-status-codes"
export const NotFoundMiddleware = (request, response) => {
    return response.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "URL NOT FOUND"
    })
}