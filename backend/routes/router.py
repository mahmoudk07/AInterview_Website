from fastapi import APIRouter
from controllers.UserController import UserRoutes
from controllers.InterviewController import InterviewRoutes
router = APIRouter()

router.include_router(UserRoutes , prefix = '/auth' , tags = ["User Authnetication"])
router.include_router(InterviewRoutes, prefix = '/interview' , tags = ["Interview APIs"])