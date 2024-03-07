import { Router } from "express"
import { Login, Signup, getAllUsers, getUserByID, deleteAllUsers, deleteUserByID } from "../controllers/UserController.js"
import { IsAdmin } from "../middlewares/IsAdmin.js"
import { IsAuthorized } from "../middlewares/IsAuthorized.js"
export const router = Router()

router.post('/login' , Login)
router.post('/signup', Signup)
router.get('/getAllUsers', IsAuthorized , IsAdmin , getAllUsers)
router.get('/getUser/:id', IsAuthorized , IsAdmin , getUserByID)
router.delete('/deleteAllUsers', IsAuthorized , IsAdmin , deleteAllUsers)
router.delete('/deleteUser/:id', IsAuthorized , IsAdmin , deleteUserByID)
