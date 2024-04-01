from fastapi import APIRouter
from controllers.UserController import UserRoutes

router = APIRouter()

router.include_router(UserRoutes , prefix = '/auth' , tags = ["User Authnetication"])