from fastapi import APIRouter, Body , Depends , status
from bson.objectid import ObjectId
from fastapi.exceptions import HTTPException
from schemas.interviewSchema import InterviewSchema , UpdateInterview
from models.interview import Interview
from fastapi.responses import JSONResponse
from services.userServices import UserServices
from services.InterviewServices import InterviewServices
InterviewRoutes = APIRouter()

@InterviewRoutes.post("/create" , summary = "Create an interview")
async def create_interview(interview: InterviewSchema , payload : dict = Depends(UserServices.is_authorized_user)) -> InterviewSchema:
    user = await UserServices.get_user_by_email(payload["email"])
    print(user)
    newInterview = Interview(
        title = interview.title,
        questions = interview.questions,
        company_id = str(user.id),
        status = interview.status,
        Date = interview.Date,
        Time = interview.Time
    )
    await newInterview.create()
    return JSONResponse(status_code = status.HTTP_201_CREATED , content = {"message": "Interview created successfully"})
@InterviewRoutes.get("/get_interviews" , summary = "Get Interview by ID")
async def get_interviews(payload : dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload["email"])
    interviews = await Interview.find(Interview.company_id == str(user.id)).to_list()
    interviews = [interview.dict() for interview in interviews]
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"interviews": interviews , "count" : len(interviews)})
@InterviewRoutes.delete('/delete_interview/{id}' , summary = "Delete interview by ID")
async def delete_interview_by_id(id : str):
    interview = await Interview.find_one(Interview.company_id == id)
    if not interview:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Interview not found")
    await interview.delete()
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
                "company_id": str(user.id)
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
