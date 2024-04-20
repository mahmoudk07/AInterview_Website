from typing import List
from bson import ObjectId
from pydantic import BaseModel, Field

class ScoresSchema(BaseModel):
    interview_id: str = Field(..., description="Interview ID")
    interviewees_scores: List[dict] = Field(..., description="List of interviewees scores")
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: lambda oid: str(oid)
        }