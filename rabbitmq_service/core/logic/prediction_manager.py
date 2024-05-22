import uuid
from core.logic.sampling import sample_and_select_frames
from core.logic.face_cropping import crop_faces
from core.logic.predict_faces import process_cropped_faces
from core.logic.send_email import send_email
from core.logic.vocal_analysis import vocal_analysis
from core.logic.nlp import NLP_MODULE
import boto3
from botocore.exceptions import NoCredentialsError
from moviepy.editor import *
from moviepy.editor import VideoFileClip
import os
from dotenv import load_dotenv
import cv2
import imageio
from pydub import AudioSegment
from ffmpeg import FFmpeg

## load dot_environment
load_dotenv()

# Example usage
# sender_email = 'ahmedfec2000@gmail.com'
# receiver_email = 'mahmoud.taky02@eng-st.cu.edu.eg'
# subject = 'Test Email'
# message = 'This is a test email sent from Python using yagmail.'
# smtp_username = 'ahmedfec2000@gmail.com'
# smtp_password = 'fhlv orad yexr vgnv'



def video_to_audio(video_path, audio_path):
    try:
        video = VideoFileClip(video_path)
        audio = video.audio
        audio.write_audiofile(audio_path)
    finally:
        # Ensure resources are properly released even if an exception occurs
        if 'video' in locals():
            video.close()
        if 'audio' in locals():
            audio.close()


s3 = boto3.client('s3',
                  endpoint_url=os.getenv("endpoint_url"),
                  region_name=os.getenv("region_name"),  # Change this to your region
                  aws_access_key_id=os.getenv("aws_access_key_id"),
                  aws_secret_access_key=os.getenv("aws_secret_access_key") )


def download_file(file_key, local_file_path):

    bucket_name=os.getenv("bucket_name")

    try:
        s3.download_file(bucket_name, file_key, local_file_path)
        print(f"Successfully downloaded file: {local_file_path}")
    except NoCredentialsError:
        print("Credentials not available")
    except Exception as e:
        print(f"An error occurred: {e}")



def convert_webm_to_mp4_high_quality(input_file, output_file):
    # Create a VideoCapture object
    cap = cv2.VideoCapture(input_file)
    
    # Check if camera opened successfully
    if not cap.isOpened():
        print("Error: Could not open video.")
        return
    
    # Define the codec and create VideoWriter object
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Set up writer - using a lower CRF for higher quality
    writer = imageio.get_writer(output_file, fps=fps, codec='libx264', quality=9, ffmpeg_params=["-crf", "16"])

    # Read until video is completed
    while cap.isOpened():
        ret, frame = cap.read()
        if ret:
            # Write the frame into the file
            writer.append_data(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        else:
            break

    # Release everything if job is finished
    cap.release()
    writer.close()


def convert_webm_to_mp4(input_file, output_file):
    ffmpeg = (
        FFmpeg(executable='C:\\ffmpeg\\ffmpeg-master-latest-win64-gpl\\bin\\ffmpeg.exe')
        .option("y")  # Overwrite output files without asking
        .input(input_file)  # Specify the input file
        .output(
            output_file,  # Specify the output file
            {"codec:v": "libx264",  # Video codec
             "codec:a": "aac"},  # Audio codec
            vf="scale=1280:-1",  # Scale video, maintain aspect ratio
            preset="slow",  # Use the veryslow preset for better compression
            crf=17  # Constant Rate Factor for quality
        )
    )

    ffmpeg.execute()



def predict(key,m,net,audio_model,question,answer,hint_Keywords):

    unique_id = str(uuid.uuid4())  # Generate a unique identifier
    
    output_vedio_webm = f"video_{unique_id}.webm"
    
    output_vedio = f"video_{unique_id}.mp4"  # Unique video file name
    
    output_audio=f"audio_{unique_id}.wav"
    
    output_dir = f"images_{unique_id}"  # Unique output directory name
    
    if isinstance(key, bytes):
        key = key.decode('utf-8')
    
    ## downloading from S3 bucket
    download_file(key, output_vedio_webm)
    
    convert_webm_to_mp4(output_vedio_webm,output_vedio)
    #convert_webm_to_mp4_high_quality(output_vedio_webm, output_vedio)
    
    ## convert mp4 to wav
    video_to_audio(output_vedio, output_audio)

    hint_Keywords_array = [keyword.strip() for keyword in hint_Keywords.split(',')]
    questions = {"Q": {
    "question":question,
    "model_answer": answer,
    "hint_keywords": hint_Keywords_array
    }}

   
    
    nlp_class_module = NLP_MODULE(
        output_audio, questions)
    
    print(questions)
    
    nlp_class_module.listen_to_answer()
   


    result_nlp = nlp_class_module.generate_results()

    print("nlp---result") 
    print(result_nlp)
    ## run local analysis model 
    vocal_analysis(output_audio,audio_model)
    
    ## sample_frames
    sampled_frames=sample_and_select_frames(video_path=output_vedio,output_dir=output_dir,sampling_rate=2)
    
    ## cropping faces
    cropped_faces=crop_faces(images=sampled_frames,net=net)
    
    ## run model
    result=process_cropped_faces(cropped_faces=cropped_faces,m=m)


    os.remove(output_vedio_webm)
    #send_email(sender_email, receiver_email, subject, message, smtp_username, smtp_password)
    return result
