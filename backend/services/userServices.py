from typing import Optional
from models.user import User
from schemas.userSchema import RegisterSchema
from passlib.context import CryptContext
from pydantic import EmailStr

passwordContext = CryptContext(schemes = ["bcrypt"], deprecated = "auto")
class UserServices:
    @staticmethod
    async def get_user_by_email(email: EmailStr) -> Optional[User]:
        user = await User.find_one(User.email == email)
        return user
    @staticmethod
    def hashed_password(password: str) -> str:
        return passwordContext.hash(password)
    @staticmethod
    def verify_password(password: str , hashedPassword: str) -> bool:
        return passwordContext.verify(password, hashedPassword)
    @staticmethod
    def generate_JWT() -> str:
        pass
    @staticmethod
    def verify_JWT() -> bool:
        pass