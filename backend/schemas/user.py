from pydantic import BaseModel

class UserSchema(BaseModel):
    fullname: str
    email: str
    course_of_study: str
    year: int
    gpa: float