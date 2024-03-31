from beanie import Document 
class User(Document):
    fullname: str
    email: str
    course_of_study: str
    year: int
    gpa: float
    class Config:
        json_schema_extra = {
        "example": {
            "fullname": "Abdulazeez Abdulazeez Adeshina",
            "email": "abdul@school.com",
            "course_of_study": "Water resources engineering",
            "year": 4,
            "gpa": "3.76",
        }
    }
