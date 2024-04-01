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

class LoginSchema(BaseModel):
    email: EmailStr = Field(... , description = 'Email address of the user')
    password: str = Field(... , description = 'Password of the user')