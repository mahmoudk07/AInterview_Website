import { UserModel } from "../models/UserModel.js"
import { StatusCodes } from 'http-status-codes'
import { AsyncHandler } from "../middlewares/AsyncHandler.js"
import { BadRequest } from "../errors/BadRequestError.js";
import { UnAuthentication } from "../errors/UnAuthenticationError.js";
import { NotFound } from "../errors/NotFoundError.js";
import bcrypt from "bcrypt";
export const Signup = AsyncHandler(async (request, response) => {
    const { firstname, lastname, email, password, role, job } = request.body
    if (!firstname || !lastname || !email || !password || !role || !job)
        throw new UnAuthentication(`All fields are required`);
    const user = await UserModel.create(request.body)
    return response.status(StatusCodes.OK).json(user)
})
export const Login = AsyncHandler(async (request, response) => {
    const { email, password } = request.body
    if (!email || !password)
        throw new UnAuthentication(`Please provide both email and password`)
    const user = await UserModel.findOne({ email: email })
    if (!user)
        throw new NotFound(`No user with email: ${email}`)
    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if (!isPasswordMatched)
        throw new UnAuthentication(`Please provide a correct password to login`)
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
        throw new NotFound(`No user with ID: ${id}`)
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
        throw new NotFound(`No user with ID: ${id}`)
    await UserModel.deleteOne({ _id: id })
    return response.status(StatusCodes.OK).json(`User with ID: ${id} deleted successfully`)
})
export const UpdatePassword = AsyncHandler(async (request, response) => {
    const { newPassword } = request.body
    if (!newPassword)
        throw new BadRequest(`Please provide a new password`)
    const { id } = request.user
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    await UserModel.findOneAndUpdate({ _id: id }, { password: hashedPassword }, {
        runValidators: true,
        new: true
    })
    return response.status(StatusCodes.OK).json(`Password updated successfully`)
})