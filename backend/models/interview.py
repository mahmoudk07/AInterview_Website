from typing import Optional , List
from beanie import Document
from datetime import date , time
from bson.objectid import ObjectId
class Interview(Document):
    title: str
    questions: List[dict]
    company_id: ObjectId
    interviewees: Optional[List[ObjectId]] = []
    attended_interviewees: Optional[List[ObjectId]] = []
    video_path: Optional[List[dict]] = []
    status: str
    Date: str
    Time: str
    class Settings:
        collection = "Interview",
        use_state_management: True
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: lambda oid: str(oid),
        }
        json_schema_extra = {
            "example": {
                "title": "Interview",
                "company_id": ["5f5f4f7c7b7e13b0f7f3e7b2"],
                "interviewees": ["5f5f4f7c7b7e13b0f7f3e7b2"],
                "attended_interviewees": ["5f5f4f7c7b7e13b0f7f3e7b2"],
                "video_path": [{"path": "path/to/video"}],
                "status": "Finished",
                "date": "2021-09-10",
                "time": "09:00:00"
            }
        }