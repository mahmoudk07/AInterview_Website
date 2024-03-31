from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import models as models
async def database_connection(connectionString: str):
    try:
        database_name = "AInterview_v2"
        client = AsyncIOMotorClient(connectionString)
        database = client[database_name]
        await init_beanie(database = database , document_models = models.__all__)
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False