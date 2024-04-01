from fastapi import APIRouter, status
from fastapi.exceptions import HTTPException
from schemas.userSchema import RegisterSchema, LoginSchema
from models.user import User
from services.userServices import UserServices
from fastapi.responses import JSONResponse
import pymongo

UserRoutes = APIRouter()

@UserRoutes.post("/register" , summary = "Create a new user")
async def register(request: RegisterSchema):
    empty_attributes = [key for key, value in request.dict().items() if not value]
    if empty_attributes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="All fields are required")
    user = User(
        firstname=request.firstname,
        lastname=request.lastname,
        email=request.email,
        password=UserServices.hashed_password(request.password),
        gender=request.gender,
        job=request.job,
        role=request.role
    )
    try:
        await user.create()
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    return JSONResponse(status_code = status.HTTP_201_CREATED , content = {"message": "User created successfully", "user": user.dict()})

@UserRoutes.post("/login" , summary = "Login to the system")
async def loginUser(request: LoginSchema):
    user = await UserServices.get_user_by_email(request.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if not UserServices.verify_password(request.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "User logged in successfully", "token": "token"})