from bson import ObjectId


def Insert_Scores(interview_id, interviewee_id, score,client):
   
    
   
    db = client.AInterview_v2
    scores_collection = db["Scores"]

    scores_collection.update_one(
        {"interview_id": ObjectId(str(interview_id))},
        {"$push": {"interviewees_scores": {"id": str(interviewee_id), "score": str(score)}}},
        upsert=True
    )


