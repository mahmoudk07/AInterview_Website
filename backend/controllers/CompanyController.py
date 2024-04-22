from bson import ObjectId
from fastapi import APIRouter , Depends , status, Query
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
import pymongo.errors
from models.company import Company
from models.user import User
from schemas.CompanySchema import CompanySchema , updateCompanySchema
from services.userServices import UserServices
import pymongo

def extract_specific_fields(user):
    return {
        "id": str(user.id),
        "firstname": user.firstname,
        "lastname": user.lastname,
        "email": user.email,
        "job": user.job,
        "image": user.image
    }
def extract_specific_company_fields(company):
    return {
        "name": company.name,
        "address": company.address,
        "country": company.country,
        "website": company.website,
        "image": company.image,
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
        website = data.website,
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
async def get_all_followers(page : int = Query(1 , gt = 0) ,payload : dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload['email'])
    company = await Company.find_one(Company.id == user.company_id)
    if not company:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Company not found")
    limit , totalCount = 6 , len(company.followers)
    totalPages = (totalCount + limit - 1) // limit
    start_index = (page - 1) * limit
    end_index = min(start_index + limit, totalCount)
    followers = []
    for follower in company.followers[start_index : end_index]:
        user = await User.find_one(User.id == follower)
        followers.append(user)
    followers = [extract_specific_fields(user) for user in followers]
    print(followers)
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Followers retrieved successfully", "followers": followers, "totalPages": totalPages})

@CompanyRoutes.get("/get_companies" , summary = "get all companies")
async def get_all_companies(_ : dict = Depends(UserServices.is_authorized_user)):
    companies = await Company.find().to_list()
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Companies retrieved successfully", "companies": companies})

@CompanyRoutes.get('/get_company' , summary = "Get company by id")
async def get_company_by_id(payload : dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload['email'])
    company = await Company.find_one(Company.id == user.company_id)
    if not company:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Company not found")
    company = extract_specific_company_fields(company)
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Company retrieved successfully", "company": company, "user": {"firstname": user.firstname, "lastname": user.lastname, "image": user.image}})

@CompanyRoutes.patch('/update' , summary = "Update company")
async def update_company(data : updateCompanySchema , payload : dict = Depends(UserServices.is_authorized_user)):
    user = await UserServices.get_user_by_email(payload['email'])
    company = await Company.find_one(Company.id == user.company_id)
    if not company:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Company not found")
    company.name = data.name
    company.address = data.address
    company.country = data.country
    company.website = data.website
    try:
        await company.save()
    except pymongo.errors.DuplicateKeyError as e:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST , detail = "Company already exists")
    return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Company updated successfully"})