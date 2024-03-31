from fastapi import FastAPI
from fastapi.exceptions import HTTPException
from config.database_connection import database_connection
from models.user import User
from schemas.user import UserSchema
from dotenv import load_dotenv
import uvicorn
import os
load_dotenv()

app = FastAPI()

@app.get("/")
def getUsers():
    return {"users": ["John", "Doe"]}

@app.post("/user/createUser")
async def createUser(request: UserSchema):
    user = User(**request.dict())
    await user.create()
    return {"message": "User created successfully"}

    
async def startup_event():
    connectionString = os.getenv("CONNECTION_STRING")
    if connectionString is None:
        raise HTTPException(status_code=500, detail="Connection string is not provided")
    successed = await database_connection(connectionString)
    if not successed:
        raise HTTPException(status_code=500, detail="Database connection failed")

app.add_event_handler("startup",startup_event)
if __name__ == "__main__":
    port = int(os.getenv("PORT"))
    print(f"Server is running on port {port}")
    uvicorn.run("main:app" , host = '127.0.0.1' , port = port , lifespan = "on" , reload=True)