from bson import ObjectId

def get_Questions(interview_id,client):
    
    db = client.AInterview_v2
    
    interview_collection = db["Interview"]

       # Find the document by _id and retrieve only the questions field
    document =  interview_collection.find_one(
        {"_id": ObjectId("664b74c25990eb0b7452e012")},
        {"questions": 1, "_id": 0}
    )
    
    # Extract the questions array
    questions = document.get("questions", []) if document else []
    return questions


