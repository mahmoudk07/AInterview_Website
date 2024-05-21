from bson import ObjectId

def get_Questions(interview_id,client):
    
    db = client.AInterview_v2
    
    interview_collection = db["Interview"]

       # Find the document by _id and retrieve only the questions field
    document =  interview_collection.find_one(
        {"_id": ObjectId("664ce88b508757d5128f59c5")},
        {"questions": 1, "_id": 0}
    )
    
    # Extract the questions array
    questions = document.get("questions", []) if document else []
    return questions


