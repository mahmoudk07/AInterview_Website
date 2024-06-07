from bson import ObjectId
from fastapi import APIRouter, Depends , status , Query
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from models.scores import Scores
from models.user import User
from services.userServices import UserServices
from schemas.ScoresSchema import ScoresSchema

ScoresRoutes = APIRouter()
def extract_user_fields(user):
    return {
        "id": str(user.id),
        "firstname": user.firstname,
        "lastname": user.lastname,
        "email": user.email,
        "image": user.image,
        "job": user.job
    }

@ScoresRoutes.post("/add_scores" , summary = "Add scores of interviewees")
async def add_scores(request: ScoresSchema):
    scores = Scores(
        interview_id=ObjectId(request.interview_id),
        interviewees_scores=request.interviewees_scores
    )
    await scores.create()
    return JSONResponse(status_code=status.HTTP_201_CREATED, content = {"message": "Scores added successfully"})

@ScoresRoutes.get("/get_scores/{interview_id}" , summary = "get scores of interviewees by interview id")
async def get_scores(interview_id: str, page : int = Query(1 , gt = 0), _ : dict = Depends(UserServices.is_authorized_user)):
    scores = await Scores.find_one({"interview_id" : ObjectId(interview_id)})
    if not scores:
        raise HTTPException(status_code=404, detail="Scores with this interview id not found")
    ## Sort Scores descending ##
    scores.interviewees_scores = sorted(scores.interviewees_scores, key=lambda x: x["final_Score"], reverse=True)
    limit = 6
    total_count = len(scores.interviewees_scores)
    skip = (page - 1) * limit
    totalPages = (total_count + limit - 1) // limit
    paginated_scores = scores.interviewees_scores[skip:skip + limit]
    return JSONResponse(status_code=status.HTTP_200_OK, content = {"total_count": total_count, "total_pages": totalPages, "scores": paginated_scores})
