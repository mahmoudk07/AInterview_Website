from bson import ObjectId
from fastapi import APIRouter, Depends , status
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from models.user import User
from services.userServices import UserServices

AdminRoutes = APIRouter()
@AdminRoutes.get("/getAllUsers" , summary = "Get all signed up users")
async def getAllUsers(user: dict = Depends(UserServices.is_admin_user)):
    users =  await User.find().to_list()
    users = [user.dict() for user in users]
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Users retrieved successfully", "users": users})

@AdminRoutes.delete("/deleteUser/{id}" , summary = "Delete user by id")
async def deleteUser(id: str , user: dict = Depends(UserServices.is_admin_user)):
    user = await User.find_one(User.id == ObjectId(id))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    await user.delete()
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "User deleted successfully"})

@AdminRoutes.delete("/deleteAllUsers" , summary = "Delete all users")
async def deleteAllUsers(user: dict = Depends(UserServices.is_admin_user)):
    await User.delete_all()
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "All users deleted successfully"})