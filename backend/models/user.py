from typing import List, Optional
from beanie import Document, Indexed
from bson import ObjectId
from pydantic import EmailStr
class User(Document):
    firstname: str
    lastname: str
    email: Indexed(EmailStr , unique=True) # type: ignore
    password: str
    gender: Optional[str]
    job: str
    role: str
    image: Optional[str] = "https://www.gravatar.com/avatar/?d=mp"
    interviews: Optional[List[ObjectId]] = []
    company_id: Optional[ObjectId] = None
    following: Optional[List[ObjectId]] = []
    following_interviews: Optional[List[ObjectId]] = []
    companies_email: Optional[List[object]] = []
    class Settings:
        collection = "User"
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: lambda oid: str(oid),
        }
        json_schema_extra = {
        "example": {
            "firstname": "Mahmoud",
            "lastname": "Khaled",
            "email": "mahmoud@example.com",
            "gender": "Male",
            "job": "Software Engineer",
            "role": "user",
        }
    }
