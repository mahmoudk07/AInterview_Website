from fastapi import APIRouter
from controllers.UserController import UserRoutes
from controllers.InterviewController import InterviewRoutes
from controllers.CompanyController import CompanyRoutes
router = APIRouter()

router.include_router(UserRoutes , prefix = '/auth' , tags = ["User Authnetication"])
router.include_router(InterviewRoutes, prefix = '/interview' , tags = ["Interview APIs"])
router.include_router(CompanyRoutes, prefix = "/company", tags = ["Company APIs"])