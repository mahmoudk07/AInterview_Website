import gdown
import uuid
from core.logic.sampling import sample_and_select_frames
from core.logic.face_cropping import crop_faces
from core.logic.predict_faces import process_cropped_faces
from core.logic.send_email import send_email
from core.logic.vocal_analysis import vocal_analysis
from moviepy.editor import *

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






def predict(url,m,net,audio_model):
    unique_id = str(uuid.uuid4())  # Generate a unique identifier
    
    output_vedio = f"video_{unique_id}.mp4"  # Unique video file name
    
    output_audio=f"audio_{unique_id}.wav"
    
    output_dir = f"images_{unique_id}"  # Unique output directory name
    
    if isinstance(url, bytes):
        url = url.decode('utf-8')
    
    ## downloading from drive
    gdown.download(url, output_vedio, quiet=True)  # Set quiet=True to suppress output
    
    ## convert mp4 to wav
    video_to_audio(output_vedio, output_audio)
    
    ## run local analysis model 
    vocal_analysis(output_audio,audio_model)
    
    ## sample_frames
    sampled_frames=sample_and_select_frames(video_path=output_vedio,output_dir=output_dir,sampling_rate=2)
    
    ## cropping faces
    cropped_faces=crop_faces(images=sampled_frames,net=net)
    
    ## run model
    result=process_cropped_faces(cropped_faces=cropped_faces,m=m)
    
    #send_email(sender_email, receiver_email, subject, message, smtp_username, smtp_password)
    return result
