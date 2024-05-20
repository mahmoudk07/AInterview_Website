from pydantic import BaseModel , Field
from datetime import date , time
from typing import List, Optional
from bson.objectid import ObjectId
class InterviewSchema(BaseModel):
    job_title: str = Field(..., description = "Job Title of the interview" , min_length = 3 , max_length = 50)
    job_description: str = Field(..., description = "Job Description of the interview" , min_length = 3 , max_length = 500)
    job_opportunity: str = Field(..., description = "Job Opportunity of the interview" , min_length = 3 , max_length = 100)
    status: str = Field(default = "upcoming" , description = "Status of Interview" , enum = ["upcoming" , "finished" , "current", "processed"])
    Date: str = Field(... , description = "Date of the interview")
    Time: str = Field(... , description = "Time of the interview")
    questions: List[dict] = Field(... , description = "Questions and answers of the interview")
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: lambda oid: str(oid),  # Converts ObjectId to string for JSON serialization
    }
class UpdateInterview(BaseModel):
    job_title: Optional[str] = Field(None , description = "Title of the interview" , min_length = 3 , max_length = 50)
    job_description: Optional[str] = Field(None , description = "Description of the interview" , min_length = 3 , max_length = 500)
    job_opportunity: Optional[str] = Field(None , description = "Opportunity of the interview" , min_length = 3 , max_length = 100)
    status: Optional[str] = Field(default = "upcoming" , description = "Status of Interview" , enum = ["upcoming" , "finished" , "cancelled"])
    Date: Optional[str] = Field(None , description = "Date of the interview")
    Time: Optional[str] = Field(None ,description = "Time of the interview")
    questions: Optional[List[dict]] = Field(None ,description = "Questions and answers of the interview")
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: lambda oid: str(oid),  # Converts ObjectId to string for JSON serialization
        }

class ProcessingInterviews(BaseModel):
    Interview_ID:str
    Interviewee_ID:str
    Vedio_Path:str
