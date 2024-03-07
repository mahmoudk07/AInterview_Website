import { StatusCodes } from "http-status-codes"
import { UserModel } from "../models/UserModel.js"
import { AsyncHandler } from "./AsyncHandler.js"
export const IsAdmin = AsyncHandler(async (request, response, next) => {
    const { id } = request.user
    const user = await UserModel.findOne({ _id: id })
    if (user.role === 'admin')
        next()
    else
        return response.status(StatusCodes.UNAUTHORIZED).json(`User not an admin`)
})
