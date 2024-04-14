from bson import ObjectId
from fastapi import APIRouter, Depends , status
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from models.user import User
from models.company import Company
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
    if user.role == "manager" and user.company_id != None:
        company = await Company.find_one(Company.id == user.company_id)
        if not company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        await company.delete()
    await user.delete()
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "User deleted successfully"})

@AdminRoutes.delete("/deleteAllUsers" , summary = "Delete all users")
async def deleteAllUsers(user: dict = Depends(UserServices.is_admin_user)):
    await User.delete_all()
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "All users deleted successfully"})
@AdminRoutes.delete("/deleteCompany/{id}" , summary = "Delete company by id")
async def delete_company(id : str , payload : dict = Depends(UserServices.is_admin_user)):
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
    await company.delete()
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Company deleted successfully"})
    