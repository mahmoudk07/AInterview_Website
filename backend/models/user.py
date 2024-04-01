from typing import Optional
from beanie import Document, Indexed
from pydantic import EmailStr
class User(Document):
    firstname: str
    lastname: str
    email: Indexed(EmailStr , unique=True) # type: ignore
    password: str
    gender: Optional[str] = None
    job: str
    role: str
    class Config:
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
