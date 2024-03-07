import { StatusCodes } from "http-status-codes"

export const ErrorHandler = (error, request, response, next) => {
    let CustomeMessage = {
        message: error?.message || "Something went wrong",
        status: error?.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR
    }
    if (error.name && error.name === "ValidationError")
    {
        CustomeMessage.message = error.message
        CustomeMessage.status = StatusCodes.BAD_REQUEST
    }
    if (error.code && error.code === 11000)
    {
        if (error.keyValue.hasOwnProperty("email"))
            CustomeMessage.message = `Duplicate creation for email: ${error.keyValue.email}`
        CustomeMessage.status = StatusCodes.BAD_REQUEST
    }
    if (error.name && error.name === "CastError")
    {
        CustomeMessage.status = StatusCodes.NOT_FOUND
        CustomeMessage.message = `No user found with ID: ${error.value}`
    }
    return response.status(CustomeMessage.status).json(CustomeMessage.message)
}