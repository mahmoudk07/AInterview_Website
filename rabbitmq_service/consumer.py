import onnxruntime as rt
import pika
import cv2
import json
import pickle
from core.logic.prediction_manager import predict
from core.logic.Insert_scores import Insert_Scores
from core.logic.get_Questions import get_Questions
from core.logic.process_questions import process_questions
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os

## load dot_environment
load_dotenv()

## load image model
providers=['CPUExecutionProvider' ]
m = rt.InferenceSession("light_onnx.onnx", providers=providers)

## load model for cutting faces
net = cv2.dnn.readNetFromCaffe('deploy.prototxt.txt','res10_300x300_ssd_iter_140000.caffemodel')


## load model for voice analysis
with open('vocal_analysis.pkl', 'rb') as f:
    clf = pickle.load(f)

## connecting with mongodb data base
connectionString = os.getenv("CONNECTION_STRING")
client=AsyncIOMotorClient(connectionString)

client_Sync=MongoClient(connectionString)

## rabbitmq consumer
def callback(ch, method, properties, body):
   
    body=json.loads(body)
    print(body)
    
    interview_questions=get_Questions("",client_Sync)

  

    questions,q_type,answers=process_questions(interview_questions)
    print("Q")
    print(questions)
    print("t")
    print(q_type)
    print("a")
    print(answers)
  
    ## main function for predicting
    for path in body["Vedios_PATH"]:
        print("vedio_path"+path)
        result=predict(path,m=m,net=net,audio_model=clf)
        print(f"confidence level : {result}")
        
    ## putting in database
    #Insert_Scores(body['Interview_ID'],body['Interviewee_ID'],result,client)
    
    ## make ack for rabbitmq
    ch.basic_ack(delivery_tag=method.delivery_tag)



connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='task_queue', durable=True)




channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='task_queue', on_message_callback=callback)
channel.start_consuming()


