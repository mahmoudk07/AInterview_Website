import { json } from 'express'
import { StatusCodes } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'

export const IsAuthorized = async (request, response, next) => {
    const authHeader = request.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return response.status(StatusCodes.UNAUTHORIZED).json(`Invalid authorization`)
    const token = authHeader.split(" ")[1]
    try {
        const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET)
        request.user = payload
        next()
    }
    catch (error) {
        return response.status(StatusCodes.UNAUTHORIZED).json(`Invalid token`)
    }
}