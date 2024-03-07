import { UserModel } from "../models/UserModel.js"
import { StatusCodes } from 'http-status-codes'
import { AsyncHandler } from "../middlewares/AsyncHandler.js"
import bcrypt from "bcrypt";
export const Signup = AsyncHandler(async (request, response) => {
    const { firstname, lastname, email, password, role } = request.body
    if (!firstname || !lastname || !email || !password || !role)
        return response.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Please provide all fields"
        })
    const user = await UserModel.create(request.body)
    return response.status(StatusCodes.OK).json(user)
})
export const Login = AsyncHandler(async (request, response) => {
    const { email, password } = request.body
    if (!email || !password)
        return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Please provide email and password" })
    const user = await UserModel.findOne({ email: email })
    if (!user)
        return response.status(StatusCodes.UNAUTHORIZED).json(`No user with email: ${email}`)
    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if (!isPasswordMatched)
        return response.status(StatusCodes.UNAUTHORIZED).json(`Please provide a correct password to login`)
    const token = user.CreateJWT()
    return response.status(StatusCodes.OK).json({
        message: `User logged in successfully`,
        token: token
    })
});
export const getAllUsers = AsyncHandler(async (request, response) => {
    const users = await UserModel.find({})
    return response.status(StatusCodes.OK).json({
        users: users,
        length: users.length
    })
})
export const getUserByID = AsyncHandler(async (request, response) => {
    const { id } = request.params
    const user = await UserModel.findOne({ _id: id })
    if (!user)
        return response.status(StatusCodes.NOT_FOUND).json(`No user with ID: ${id}`)
    return response.status(StatusCodes.OK).json(user)
})
export const deleteAllUsers = AsyncHandler(async (request, response) => {
    await UserModel.deleteMany({})
    return response.status(StatusCodes.OK).json(`All users deleted successfully`)
})
export const deleteUserByID = AsyncHandler(async (request, response) => {
    const { id } = request.params
    const user = await UserModel.findOne({ _id: id })
    if (!user)
        return response.status(StatusCodes.NOT_FOUND).json(`No user with ID: ${id}`)
    await UserModel.deleteOne({ _id: id })
    return response.status(StatusCodes.OK).json(`User with ID: ${id} deleted successfully`)
})
