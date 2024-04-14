from bson import ObjectId
from fastapi import APIRouter , Depends , status
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
import pymongo.errors
from models.company import Company
from models.user import User
from schemas.CompanySchema import CompanySchema
from services.userServices import UserServices
import pymongo

def extract_specific_fields(user):
    return {
        "firstname": user.firstname,
        "lastname": user.lastname,
        "email": user.email,
        "job": user.job,
        "image": user.image
    }
CompanyRoutes = APIRouter()

@CompanyRoutes.post('/create' , summary = "Create a new company")
async def create_company(data : CompanySchema , payload : dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload['email'])
    if not user:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "User not found to create company")
    newCompany = Company(
        name = data.name,
        address = data.address,
        country = data.country,
        image = data.image,
        followers = data.followers,
        interviews = data.interviews
    )
    try:
        await newCompany.create()
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST , detail = "Company already exists")
    try:      
        user.company_id = ObjectId(newCompany.id)
        await user.save()
    except Exception as e:
        raise HTTPException(status_code = status.HTTP_500_INTERNAL_SERVER_ERROR , detail = "Error occurred while saving")
    return JSONResponse(status_code = status.HTTP_201_CREATED , content = {"message": "Company created successfully", "company": newCompany.dict()})
@CompanyRoutes.get('/followers' , summary = "Get all followers")
async def get_all_followers(payload : dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload['email'])
    company = await Company.find_one(Company.id == user.company_id)
    if not company:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Company not found")
    followers = []
    for follower in company.followers:
        user = await User.find_one(User.id == follower)
        followers.append(user)
    followers = [extract_specific_fields(user) for user in followers]
    print(followers)
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Followers retrieved successfully", "followers": followers})
