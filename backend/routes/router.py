from fastapi import APIRouter
from controllers.UserController import UserRoutes
from controllers.InterviewController import InterviewRoutes
from controllers.CompanyController import CompanyRoutes
from controllers.AdminController import AdminRoutes
router = APIRouter()

router.include_router(UserRoutes , prefix = '/auth' , tags = ["User APIs"])
router.include_router(InterviewRoutes, prefix = '/interview' , tags = ["Interview APIs"])
router.include_router(CompanyRoutes, prefix = "/company", tags = ["Company APIs"])
router.include_router(AdminRoutes, prefix = "/admin", tags = ["Admin APIs"])