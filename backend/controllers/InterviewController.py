from fastapi import APIRouter, Body , Depends, Response , status, Query
from bson.objectid import ObjectId
from fastapi.exceptions import HTTPException
from schemas.interviewSchema import InterviewSchema , UpdateInterview,ProcessingInterviews
from models.interview import Interview
from models.company import Company
from models.user import User
from models.scores import Scores
from fastapi.responses import JSONResponse
from services.userServices import UserServices
from services.InterviewServices import InterviewServices
import datetime
import json
import pika
from pymongo import UpdateOne
InterviewRoutes = APIRouter()
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
        "questions": interview.questions,
        "company_name": interview.company_name
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
    print(company.name)
    newInterview = Interview(
        company_name = company.name,
        job_title = interview.job_title,
        job_description = interview.job_description,
        job_opportunity = interview.job_opportunity,
        questions = interview.questions,
        company_id = ObjectId(company.id),
        status = interview.status,
        Date = interview.Date,
        Time = interview.Time,
    )
    await newInterview.create()
    try:
        company.interviews.append(ObjectId(newInterview.id))
        await company.save()
    except Exception as e:
        raise HTTPException(status_code = status.HTTP_500_INTERNAL_SERVER_ERROR , detail = "Error occurred while saving")
    return JSONResponse(status_code = status.HTTP_201_CREATED , content = {"message": "Interview created successfully"})

@InterviewRoutes.get("/get_interviews" , summary = "Get Interviews created by company")
async def get_interviews(page : int = Query(1 , gt=0), payload : dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload["email"])
    limit : int = 6
    skip = (page - 1) * limit
    interviews = await Interview.find(Interview.company_id == user.company_id).skip(skip).limit(limit).to_list()
    Status = None
    operations = []
    for interview in interviews:
        if interview.Date < datetime.datetime.now().strftime("%Y-%m-%d"):
            interview_score = await Scores.find_one({"interview_id": interview.id})
            if interview_score:
                if len(interview_score.interviewees_scores) == len(interview.attended_interviewees):
                    Status = "processed"
                else:
                    Status = "finished"
            else:
                Status = "finished"
        elif interview.Date > datetime.datetime.now().strftime("%Y-%m-%d"):
            Status = "upcoming"
        else:
            Status = "current"
        operations.append(UpdateOne({'_id': interview.id}, {'$set': {'status': Status}}))
    if operations:
        try:
            result = await Interview.get_motor_collection().bulk_write(operations)
            print("Bulk update result:", result.bulk_api_result)
            interviews = await Interview.find(Interview.company_id == user.company_id).skip(skip).limit(limit).to_list()
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    total_count = await Interview.find(Interview.company_id == user.company_id).count()
    total_pages = (total_count + limit - 1) // limit
    interviews = [extract_interview_fields(interview) for interview in interviews]
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"interviews": interviews , "totalPages" : total_pages})

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
                "_id": {"$in": ["upcoming", "finished", "processed"]}
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

@InterviewRoutes.get("/get_all_interviews" , summary = "Get all interviews")
async def get_all_interviews(page : int = Query(1 , gt=0) , _ : dict = Depends(UserServices.is_authorized_user)):
    limit : int = 6
    skip = (page - 1) * limit
    interviews = await Interview.find().skip(skip).limit(limit).to_list()
    total_count = await Interview.find().count()
    total_pages = (total_count + limit - 1) // limit
    interviews = [extract_interview_fields(interview) for interview in interviews]
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"interviews": interviews , "totalPages" : total_pages})

@InterviewRoutes.post("/Process_Interview" , summary = "Run AI Models")
async def detect(input_data:ProcessingInterviews):
    url=input_data.Vedio_Path
    input_data_dict = {
        "Interview_ID": input_data.Interview_ID,
        "Interviewee_ID": input_data.Interviewee_ID,
        "Vedio_Path": input_data.Vedio_Path
    }
    print(json.dumps( input_data_dict)
          )
    if not url.startswith("http"):
        raise HTTPException(
            status_code=400, detail="Invalid URL format"
        )
    connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='task_queue', durable=True)
    
    message = json.dumps( input_data_dict)
    
    channel.basic_publish(
        exchange='',
        routing_key='task_queue',
        body=message,   
        properties=pika.BasicProperties(
            delivery_mode=pika.DeliveryMode.Persistent
        ))
    connection.close()
   
    return Response(status_code=200)
