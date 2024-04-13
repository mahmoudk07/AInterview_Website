from pydantic import BaseModel , Field
from typing import List , Optional
from bson import ObjectId
class CompanySchema(BaseModel):
    name: str = Field(... , description = "Name of the company" , min_length = 3 , max_length = 50)
    address: str = Field(... , description = "Address of the company" , min_length = 3 , max_length = 50)
    country: str = Field(... , description = "Country of the company" , min_length = 3 , max_length = 50)
    image: Optional[str] = Field(default = "https://www.gravatar.com/avatar/?d=mp" , description = "Image of the company")
    followers: Optional[List[str]] = Field(default = [] , description = "List of interviewees")
    interviews: Optional[List[str]] = Field(default = [] , description = "List of interviews")
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: lambda oid: str(oid)
        }
