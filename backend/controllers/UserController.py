from datetime import timedelta
from bson import ObjectId
from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from models.company import Company
from schemas.userSchema import RegisterSchema, LoginSchema , PasswordSchema
from models.user import User
from models.interview import Interview
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
    token = UserServices.generate_JWT(user.email, timedelta(minutes=30))
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "User logged in successfully", "token": token , "type": user.role, "isManager": str(user.company_id)})

@UserRoutes.post("/changePassword" , summary = "Change Password of the user")
async def changePassword(request: PasswordSchema , payload : dict = Depends(UserServices.is_authorized_user)):
    email = payload.get("email")
    user = await UserServices.get_user_by_email(email)
    if not UserServices.verify_password(request.old_password, user.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid old password")
    if request.new_password != request.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please enter two matching passwords")
    user.password = UserServices.hashed_password(request.new_password)
    try:
        await user.save()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error occurred while saving")
    return JSONResponse(status_code = status.HTTP_200_OK, content = {"message": "Password changed successfully"})

@UserRoutes.patch("/join_interview/{interview_id}" , summary = "Apply for an interview")
async def apply_to_interview(interview_id: str , user: dict = Depends(UserServices.is_authorized_user)):
    existed_user = await UserServices.get_user_by_email(user["email"])
    interview = await Interview.find_one(Interview.id == ObjectId(interview_id))
    if not interview:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Interview not found")
    existed_user.interviews.append(ObjectId(interview_id))
    interview.interviewees.append(existed_user.id)
    await interview.save()
    await existed_user.save()
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Applied to interview successfully"})

@UserRoutes.patch('/follow/{company_id}' , summary = "Follow a company")
async def follow_company(company_id : str , payload: dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload['email'])
    if not user:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "User not found to follow company")
    company = await Company.find_one(Company.id == ObjectId(company_id))
    if not company:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Company not found")
    company.followers.append(user.id)
    user.following.append(company.id)
    try:
        await company.save()
        await user.save()
    except Exception as e:
        raise HTTPException(status_code = status.HTTP_500_INTERNAL_SERVER_ERROR , detail = "Error occurred while saving")
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Company followed successfully"})

@UserRoutes.patch('/unfollow/{company_id}' , summary = "Unfollow a company")
async def unfollow_company(company_id : str , payload : dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload['email'])
    if not user:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "User not found to unfollow company")
    company = await Company.find_one(Company.id == ObjectId(company_id))
    if not company:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Company not found")
    company.followers.remove(user.id)
    user.following.remove(company.id)
    try:
        await company.save()
        await user.save()
    except Exception as e:
        raise HTTPException(status_code = status.HTTP_500_INTERNAL_SERVER_ERROR , detail = "Error occurred while saving")
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Company unfollowed successfully"})

@UserRoutes.patch("/finish_interview/{interview_id}" , summary = "Finish for an interview")
async def apply_to_interview(interview_id: str , user: dict = Depends(UserServices.is_authorized_user)):
    existed_user = await UserServices.get_user_by_email(user["email"])
    interview = await Interview.find_one(Interview.id == ObjectId(interview_id))
    if not interview:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Interview not found")
    interview.attended_interviewees.append(existed_user.id)
    try:
        await interview.save()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Interview submitted successfully"})