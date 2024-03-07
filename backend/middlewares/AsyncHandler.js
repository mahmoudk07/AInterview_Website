export const AsyncHandler = (callback_fn) => {
    return async (request, response, next) => {
        try {
            await callback_fn(request, response , next)
        }
        catch (error) {
            next(error)
        }
    }
}