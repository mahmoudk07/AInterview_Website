from fastapi import APIRouter, Body , Depends , status
from bson.objectid import ObjectId
from fastapi.exceptions import HTTPException
from schemas.interviewSchema import InterviewSchema , UpdateInterview
from models.interview import Interview
from models.company import Company
from models.user import User
from fastapi.responses import JSONResponse
from services.userServices import UserServices
from services.InterviewServices import InterviewServices
InterviewRoutes = APIRouter()
def extract_interview_fields(interview):
    return {
        "id": str(interview.id),
        "title": interview.title,
        "status": interview.status,
        "Date": interview.Date,
        "Time": interview.Time,
        "interviewees": len(interview.interviewees),
        "questions": interview.questions,
    }
def extract_interviewee_fields(interviewee):
    return {
        "id": str(interviewee.id),
        "email": interviewee.email,
        "firstname": interviewee.firstname,
        "lastname": interviewee.lastname,
        "image": interviewee.image,
        "job": interviewee.job
    }
@InterviewRoutes.post("/create" , summary = "Create an interview")
async def create_interview(interview: InterviewSchema , payload : dict = Depends(UserServices.is_authorized_user)) -> InterviewSchema:
    user = await UserServices.get_user_by_email(payload["email"])
    company = await Company.find_one(Company.id == user.company_id)
    newInterview = Interview(
        title = interview.title,
        questions = interview.questions,
        company_id = ObjectId(company.id),
        status = interview.status,
        Date = interview.Date,
        Time = interview.Time
    )
    await newInterview.create()
    try:
        company.interviews.append(ObjectId(newInterview.id))
        await company.save()
    except Exception as e:
        raise HTTPException(status_code = status.HTTP_500_INTERNAL_SERVER_ERROR , detail = "Error occurred while saving")
    return JSONResponse(status_code = status.HTTP_201_CREATED , content = {"message": "Interview created successfully"})
@InterviewRoutes.get("/get_interviews" , summary = "Get Interview by ID")
async def get_interviews(payload : dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload["email"])
    interviews = await Interview.find(Interview.company_id == user.company_id).to_list()
    interviews = [extract_interview_fields(interview) for interview in interviews]
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"interviews": interviews , "count" : len(interviews)})
@InterviewRoutes.delete('/delete_interview/{id}' , summary = "Delete interview by ID")
async def delete_interview_by_id(id : str):
    interview = await Interview.find_one(Interview.id == ObjectId(id))
    company = await Company.find_one(interview.company_id == Company.id)
    if not interview:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Interview not found")
    await interview.delete()
    company.interviews.remove(interview.id)
    await company.save()
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Interview deleted successfully"})
@InterviewRoutes.patch('/update_interview/{id}' , summary = "Update an interview")
async def update_interview(id : str , updatedInterview : UpdateInterview = Body(...)):
    await InterviewServices.update_interview(id , updatedInterview)
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Interview updated successfully"})
@InterviewRoutes.get("/get_interviews_status" , summary = "Get count for each status")
async def get_status_count(payload : dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload["email"])
    pipeline = [
        {
            "$match": {
                "company_id": user.company_id
            }
        },
        {
            "$group": {
                "_id": "$status",
                "count": {"$sum": 1}
            }
        },
        {
            "$match": {
                "_id": {"$in": ["upcoming", "finished", "cancelled"]}
            }
        }
    ]
    results = await Interview.aggregate(pipeline).to_list()
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"results": results})

@InterviewRoutes.get("/get_interview/{id}" , summary = "Get Interview by ID")
async def get_interview_by_id(id : str , _ : dict = Depends(UserServices.is_authorized_user)):
    interview = await Interview.find_one(Interview.id == ObjectId(id))
    if not interview:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Interview not found")
    interview = extract_interview_fields(interview)
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"interview": interview})

@InterviewRoutes.get("/get_interviewees/{id}" , summary = "Get Interviewees by ID")
async def get_interviewees_by_id(id : str , _ : dict = Depends(UserServices.is_authorized_user)):
    interview = await Interview.find_one(Interview.id == ObjectId(id))
    if not interview:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Interview not found")
    interviewees = []
    for interviewee in interview.interviewees:
        user = await User.find_one(User.id == interviewee)
        user = extract_interviewee_fields(user)
        interviewees.append(user)
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"interviewees": interviewees , "count": len(interviewees)})
