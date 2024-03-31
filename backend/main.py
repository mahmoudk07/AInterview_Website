from fastapi import FastAPI
from fastapi.exceptions import HTTPException
from config.database_connection import database_connection
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
    pass


def run_server():
    port = int(os.getenv("PORT"))
    print(f"Server is running on port {port}")
    uvicorn.run("main:app" , host = '127.0.0.1' , port = port , lifespan = "on" , reload=True)
    
async def startup_event():
    connectionString = os.getenv("CONNECTION_STRING")
    successed = await database_connection(connectionString)
    return successed

if __name__ == "__main__":
    import asyncio
    connection_success = asyncio.run(startup_event())
    if connection_success:
        run_server()
    else:
        raise HTTPException(status_code = 500 , detail = "Failed to connect to Database, Server will not run")