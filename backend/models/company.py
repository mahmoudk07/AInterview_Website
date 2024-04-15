from typing import List, Optional
from beanie import Document, Indexed
from bson import ObjectId

class Company(Document):
    name: Indexed(str , unique=True) # type: ignore
    address: str
    country: str
    website: str
    image: str
    followers: List[ObjectId]
    interviews: List[ObjectId]
    class Settings:
        collection = "Company"
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: lambda oid: str(oid),
        }
        json_schema_extra = {
            "example": {
                "name": "Company",
                "address": "1234 Main St",
                "country": "USA",
                "image": "path/to/image",
                "following_interviewees": ["5f5f4f7c7b7e13b0f7f3e7b2"],
                "interviews": ["5f5f4f7c7b7e13b0f7f3e7b2"]
            }
        }