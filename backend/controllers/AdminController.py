import asyncio
from bson import ObjectId
from fastapi import APIRouter, Depends, Query , status
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from models.user import User
from models.company import Company
from models.interview import Interview
from services.userServices import UserServices
from schemas.userSchema import UpdateUser
from pymongo import DeleteMany
AdminRoutes = APIRouter()

def extract_users_field(user):
    return {
        "id": str(user.id),
        "firstname": user.firstname,
        "lastname": user.lastname,
        "email": user.email,
        "job": user.job,
        "image": user.image,
        "role": user.role
    }

@AdminRoutes.get("/getAllUsers" , summary = "Get all signed up users")
async def getAllUsers(page : int = Query(1 , gt=0) , _: dict = Depends(UserServices.is_admin_user)):
    limit = 6
    total_count = await User.find({"role" : {"$ne" : "admin"}}).count()
    totalPages = (total_count + limit - 1) // limit
    skip = (page - 1)*limit;
    users =  await User.find({"role" : {"$ne" : "admin"}}).skip(skip).limit(limit).to_list()
    users = [extract_users_field(user) for user in users]
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Users retrieved successfully", "users": users, "totalPages": totalPages})

@AdminRoutes.delete("/deleteUser/{id}" , summary = "Delete user by id")
async def deleteUser(id: str , user: dict = Depends(UserServices.is_admin_user)):
    user = await User.find_one(User.id == ObjectId(id))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.role == "manager" and user.company_id != None:
        company = await Company.find_one(Company.id == user.company_id)
        if not company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        await Interview.get_motor_collection().delete_many({'company_id': company.id})
    await user.delete()
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "User deleted successfully"})

@AdminRoutes.delete("/deleteAllUsers" , summary = "Delete all users")
async def deleteAllUsers(user: dict = Depends(UserServices.is_admin_user)):
    await User.delete_all()
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "All users deleted successfully"})

@AdminRoutes.delete("/deleteCompany/{id}" , summary = "Delete company by id")
async def delete_company(id : str , _ : dict = Depends(UserServices.is_admin_user)):
    company = await Company.find_one(Company.id == ObjectId(id))
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    users_in_company = await User.find(User.company_id == company.id).to_list()
    for user in users_in_company:
        user.company_id = None
        try:
            await user.save()
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete company when trying to remove company from users")
    await Interview.get_motor_collection().delete_many({'company_id': company.id})
    await company.delete()
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Company deleted successfully"})

@AdminRoutes.patch("/updateAdmin" , summary = "Update user by id")
async def updateUser(data: UpdateUser , user : dict = Depends(UserServices.is_admin_user)):
    user = await User.find_one(User.id == user.id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if data.email:
        user.email = data.email
    if data.firstname:
        user.firstname = data.firstname
    if data.lastname:
        user.lastname = data.lastname
    if data.job:
        user.job = data.job
    print(data)
    try:
        await user.save()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update user")
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "User updated successfully"})



