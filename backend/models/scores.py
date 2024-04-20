from typing import List , Optional 
from beanie import Document
from bson import ObjectId

class Scores(Document):
    interview_id : ObjectId
    interviewees_scores: List[dict]
    class Settings:
        collection = "Scores"
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: lambda oid: str(oid),
        }
        json_schema_extra = {
        "example": {
            "interview_id": "5f9b9f0a4c0c9f3f3d5d8e2a",
            "interviewees_scores": ["5f9b9f0a4c0c9f3f3d5d8e2a","5f9b9f0a4c0c9f3f3d5d8e2a","5f9b9f0a4c0c9f3f3d5d8e2a"],
        }}