from typing import List, Optional
from bson import ObjectId
from pydantic import BaseModel , Field , EmailStr

class RegisterSchema(BaseModel):
    firstname: str = Field(..., min_length = 3 , max_length = 20 , description = "First name of the user")
    lastname: str = Field(... , min_length = 3 , max_length = 20 , description = "Last name of the user")
    email: EmailStr = Field(..., description = "Email address of the user")
    password: str = Field(..., description = "Password of the user")
    gender: str = Field(default = "male", description = "Gender of the user")
    job: str = Field(... , description = "Job title of the user", enum = [
          "Software Engineer",
          "Data Scientist",
          "Product Manager",
          "UX Designer",
          "Marketing Manager",
          "Accountant",
          "HR Specialist",
          "Sales Representative",
          "Customer Service Representative",
          "Operations Manager"])
    role: str = Field(..., description = "Role of the user", enum = ['admin', 'user', 'manager'])
class UpdateUser(BaseModel):
    firstname: Optional[str] = Field(None, min_length = 3 , max_length = 20 , description = "First name of the user")
    lastname: Optional[str] = Field(None , min_length = 3 , max_length = 20 , description = "Last name of the user")
    email: Optional[EmailStr] = Field(None, description = "Email address of the user")
    password: Optional[str] = Field(None, description = "Password of the user")
    gender: Optional[str] = Field(None, description = "gender of the user")
    job: Optional[str] = Field(None , description = "Job title of the user", enum = [
          "Software Engineer",
          "Data Scientist",
          "Product Manager",
          "UX Designer",
          "Marketing Manager",
          "Accountant",
          "HR Specialist",
          "Sales Representative",
          "Customer Service Representative",
          "Operations Manager"])
    role: str = Field(None, description = "Role of the user", enum = ['admin', 'user', 'manager'])
    interviews : Optional[List[ObjectId]] = Field([] , description = "Interviews of the user")
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: lambda oid: str(oid),  # Converts ObjectId to string for JSON serialization
        }

class LoginSchema(BaseModel):
    email: EmailStr = Field(... , description = 'Email address of the user')
    password: str = Field(... , description = 'Password of the user')

class PasswordSchema(BaseModel):
    old_password: str = Field(... , description = 'Old password of the user')
    new_password: str = Field(... , description = 'New password of the user')
    confirm_password: str = Field(... , description = 'Confirm password of the user')