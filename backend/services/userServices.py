from datetime import datetime, timedelta
import os
from typing import Optional
from fastapi.exceptions import HTTPException
from fastapi import Depends, Header , status
from models.user import User
from schemas.userSchema import RegisterSchema
from passlib.context import CryptContext
from pydantic import EmailStr
import jwt

passwordContext = CryptContext(schemes = ["bcrypt"], deprecated = "auto")
class UserServices:
    @staticmethod
    async def get_user_by_email(email: EmailStr) -> Optional[User]:
        user = await User.find_one(User.email == email)
        return user
    async def get_all_users():
        users = await User.find_all()
        return users
    @staticmethod
    def hashed_password(password: str) -> str:
        return passwordContext.hash(password)
    @staticmethod
    def verify_password(password: str , hashedPassword: str) -> bool:
        return passwordContext.verify(password, hashedPassword)
    @staticmethod
    def generate_JWT(user_email : str , expires_delta : timedelta) -> str:
        encode = {"email": user_email}
        expires = datetime.utcnow() + expires_delta
        encode.update({"expires": expires.strftime('%Y-%m-%d %H:%M:%S')})
        return jwt.encode(encode , os.getenv("JWT_SECRET") , algorithm = 'HS256')
    @staticmethod
    async def is_authorized_user(authorization : str = Header(...)):
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code = status.HTTP_401_UNAUTHORIZED , detail = "Invalid authorization header"
            )
        token = authorization.split(" ")[1]
        try:
            payload = jwt.decode(token , os.getenv("JWT_SECRET") , algorithms = ['HS256'])
            return payload
        except jwt.PyJWTError:
            raise HTTPException(
                status_code = status.HTTP_401_UNAUTHORIZED , detail = "Invalid token"
            )
    @staticmethod
    async def is_admin_user(authorization : str = Header(...)):
        payload = await UserServices.is_authorized_user(authorization)
        user = await UserServices.get_user_by_email(payload.get('email'))
        if not user.role == "admin":
            raise HTTPException(
                status_code = status.HTTP_403_FORBIDDEN , detail = "You are not authorized to perform this action"
            )
        return user
    @staticmethod
    def verify_JWT() -> bool:
        pass