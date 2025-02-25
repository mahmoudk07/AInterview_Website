from datetime import timedelta
from bson import ObjectId
from fastapi import APIRouter, Depends, Query, status
from fastapi.exceptions import HTTPException
from models.company import Company
from schemas.userSchema import RegisterSchema, LoginSchema , PasswordSchema , UpdateUser
from models.user import User
from models.interview import Interview
from models.scores import Scores
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
        "job_title": interview.job_title,
        "job_description": interview.job_description,
        "job_opportunity": interview.job_opportunity,
        "status": interview.status,
        "Date": interview.Date,
        "Time": interview.Time,
        "interviewees": len(interview.interviewees),
        "interviewees_ids": [str(interviewee) for interviewee in interview.interviewees],
        "attended_interviewees": len(interview.attended_interviewees),
        "attended_interviewees_ids": [str(interviewee) for interviewee in interview.attended_interviewees],
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
async def get_interviews_by_following_companies(page : int = Query(0 , gt = 0) , payload: dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload["email"])
    companies = await Company.find({"_id": {"$in": user.following}}).to_list()
    interviews = []
    limit = 6
    skip = (page - 1) * limit
    for company in companies:
        company_interviews = await Interview.find(Interview.company_id == company.id).to_list()
        interviews.extend(company_interviews)
    interviews = [extract_interview_fields(interview) for interview in interviews if interview.status in ["upcoming", "current"]]
    total_count = len(interviews)
    total_pages = (total_count + limit - 1) // limit
    interviews = interviews[skip:skip + limit]
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"interviews": interviews , "totalPages": total_pages})

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
@UserRoutes.patch("/updateUser" , summary = "Update user by id")
async def updateUser(data: UpdateUser , user : dict = Depends(UserServices.is_authorized_user)):
    existed_user = await UserServices.get_user_by_email(user["email"])
    if not existed_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if data.firstname:
        existed_user.firstname = data.firstname
    if data.lastname:
        existed_user.lastname = data.lastname
    if data.email:
        existed_user.email = data.email
    if data.job:
        existed_user.job = data.job
    if data.image:
        existed_user.image = data.image
    try:
        await existed_user.save()
    except pymongo.errors.DuplicateKeyError as e:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST , detail = "User already exists")
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "User updated successfully"})

@UserRoutes.patch("/sendAcceptanceEmail/{user_id}/{interview_id}" , summary = "Manager send an email to interviewee after finishing the interview")
async def sendEmail(user_id : str , interview_id : str ,  user: dict = Depends(UserServices.is_authorized_user)):
    existed_user = await UserServices.get_user_by_email(user["email"])
    if not existed_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user = await User.find_one(User.id == ObjectId(user_id))
    interview = await Interview.find_one(Interview.id == ObjectId(interview_id))
    company = await Company.find_one(Company.id == existed_user.company_id)
    # interview_score = await Scores.find_one(Scores.interview_id == ObjectId(interview_id))
    # interviewee_score = next((score for score in interview_score.interviewees_scores if ObjectId(score['id']) == ObjectId(user_id)), None)
    subject = "Congratulations"
    message = f"Dear {user.firstname} {user.lastname},\n\nI am pleased to inform you that you have been selected for the position of {interview.job_title} as {interview.job_opportunity} at {company.name}. Please contact us to discuss the next steps.\n\nBest Regards,\n{company.name}"
    user.companies_email.append({"message" : message , "subject" : subject})
    try:
        await user.save()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error occurred while saving")
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Email sent successfully"})

@UserRoutes.patch("/sendRejectionEmail/{user_id}/{interview_id}" , summary = "Manager send a rejection email to interviewee after finishing the interview")
async def sendRejectionEmail(user_id : str , interview_id : str ,  user: dict = Depends(UserServices.is_authorized_user)):
    existed_user = await UserServices.get_user_by_email(user["email"])
    if not existed_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user = await User.find_one(User.id == ObjectId(user_id))
    interview = await Interview.find_one(Interview.id == ObjectId(interview_id))
    company = await Company.find_one(Company.id == existed_user.company_id)
    interview_score = await Scores.find_one(Scores.interview_id == ObjectId(interview_id))
    interviewee_score = next((score for score in interview_score.interviewees_scores if ObjectId(score['id']) == ObjectId(user_id)), None)
    subject = "Rejection"
    # message = f"Dear {user.firstname} {user.lastname},\n\nI regret to inform you that you have not been selected for the position of {interview.job_title} as {interview.job_opportunity} at {company.name}. We appreciate your time and effort.\n\nBest Regards,\n{company.name}"
    nlp_score = interviewee_score['nlp_Score']
    audio_score = interviewee_score['audio_Score']
    video_score = interviewee_score['images_Score']
    final_score = interviewee_score['final_Score']
    message = (
    f"Dear {user.firstname} {user.lastname},\n\n"
    f"We regret to inform you that you have not been selected for the position of {interview.job_title} as {interview.job_opportunity} at {company.name}. "
    f"Your scores for the interview was {nlp_score} in technical score, {audio_score} in audio score, {video_score} in video score, and final score was {final_score}.We appreciate your time and effort.\n\n"
    f"Best Regards,\n{company.name}"
    )
    user.companies_email.append({"message" : message , "subject" : subject})
    try:
        await user.save()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error occurred while saving")
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Email sent successfully"})

@UserRoutes.get("/get_emails" , summary = "Get emails")
async def get_emails(page : int = Query(0 , gt = 0) ,user: dict = Depends(UserServices.is_authorized_user)):
    existed_user = await UserServices.get_user_by_email(user["email"])
    emails = existed_user.companies_email
    limit = 3
    skip = (page - 1) * limit
    total_count = len(emails)
    total_pages = (total_count + limit - 1) // limit
    emails = emails[skip:skip + limit]
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"emails": emails , "totalPages": total_pages})