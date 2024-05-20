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
def extract_users_field(user):
    return {
        "id": str(user.id),
        "firstname": user.firstname,
        "lastname": user.lastname,
        "email": user.email,
        "job": user.job,
        "image": user.image,
        "role": user.role
}

def extract_specific_company_fields(company):
    return {
        "id": str(company.id),
        "name": company.name,
        "address": company.address,
        "country": company.country,
        "website": company.website,
        "image": company.image,
    }
def extract_interview_fields(interview):
    return {
        "id": str(interview.id),
        "title": interview.title,
        "status": interview.status,
        "Date": interview.Date,
        "Time": interview.Time,
        "interviewees": len(interview.interviewees),
        "questions": interview.questions,
        "company_name": interview.company_name
}
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

@UserRoutes.get("/get_following_companies" , summary = "Get following companies")
async def get_following_companies(payload: dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload["email"])
    companies = await Company.find({"_id": {"$in": user.following}}).to_list()
    companies = [extract_specific_company_fields(company) for company in companies]
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"companies": companies})

@UserRoutes.get("/get_interviews_by_following_companies" , summary = "Get interviews by following companies")
async def get_interviews_by_following_companies(payload: dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload["email"])
    companies = await Company.find({"_id": {"$in": user.following}}).to_list()
    interviews = []
    for company in companies:
        company_interviews = await Interview.find(Interview.company_id == company.id).to_list()
        interviews.extend(company_interviews)
    interviews = [extract_interview_fields(interview) for interview in interviews]
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"interviews": interviews})

@UserRoutes.patch("/follow_interview/{interview_id}" , summary = "Follow an interview")
async def follow_interview(interview_id: str , user: dict = Depends(UserServices.is_authorized_user)):
    existed_user = await UserServices.get_user_by_email(user["email"])
    interview = await Interview.find_one(Interview.id == ObjectId(interview_id))
    if not interview:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Interview not found")
    existed_user.following_interviews.append(ObjectId(interview_id))
    await existed_user.save()
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Interview followed successfully"})

@UserRoutes.patch("/unfollow_interview/{interview_id}" , summary = "Unfollow an interview")
async def unfollow_interview(interview_id: str , user: dict = Depends(UserServices.is_authorized_user)):
    existed_user = await UserServices.get_user_by_email(user["email"])
    interview = await Interview.find_one(Interview.id == ObjectId(interview_id))
    if not interview:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Interview not found")
    existed_user.following_interviews.remove(ObjectId(interview_id))
    await existed_user.save()
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Interview unfollowed successfully"})

@UserRoutes.get("/get_following_interviews" , summary = "Get following interviews")
async def get_following_interviews(payload: dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload["email"])
    interviews = await Interview.find({"_id": {"$in": user.following_interviews}}).to_list()
    interviews = [extract_interview_fields(interview) for interview in interviews]
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"interviews": interviews})

@UserRoutes.get("/getUserInfo" , summary = "Get user by id")
async def getUser(user: dict = Depends(UserServices.is_authorized_user)):
    existed_user = await UserServices.get_user_by_email(user["email"])
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "User retrieved successfully", "user": extract_users_field(existed_user)})