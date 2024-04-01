from fastapi import FastAPI, Request
from fastapi.exceptions import HTTPException, RequestValidationError
from fastapi.responses import JSONResponse
from config.database_connection import database_connection
from routes.router import router
from dotenv import load_dotenv
import uvicorn
import os
load_dotenv()

app = FastAPI()


app.include_router(router)

@app.exception_handler(RequestValidationError)
async def validationErrorHandler(request: Request , exc: RequestValidationError):
    error_details = [
    {"field": error["loc"][-1], "message": error["msg"]} for error in exc.errors()]
    return JSONResponse(status_code=400 , content={"message": "Validation error", "errors": error_details})
    
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