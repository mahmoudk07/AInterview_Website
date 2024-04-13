from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from schemas.interviewSchema import UpdateInterview
from models.interview import Interview
from bson import ObjectId
from fastapi import status
class InterviewServices:
    @staticmethod
    async def update_interview(id : str , updated_data: UpdateInterview):
        interview = await Interview.get(ObjectId(id))
        if not interview:
            raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "Interview not found")
        update_dict = updated_data.dict(exclude_unset=True, exclude_none=True)
        for key , value in update_dict.items():
            setattr(interview , key, value)
        await interview.save()
        return JSONResponse(status_code = status.HTTP_200_OK , content = {"message": "Interview updated successfully"})
        
