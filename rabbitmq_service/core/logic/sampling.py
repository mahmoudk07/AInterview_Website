import cv2
import os
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import shutil







def is_significant_motion(previous_frame, current_frame, threshold=5.0):
    gray_prev = cv2.cvtColor(previous_frame, cv2.COLOR_BGR2GRAY)
    gray_curr = cv2.cvtColor(current_frame, cv2.COLOR_BGR2GRAY)
    frame_diff = cv2.absdiff(gray_prev, gray_curr)
    _, thresh = cv2.threshold(frame_diff, 25, 255, cv2.THRESH_BINARY)
    motion_area = (cv2.countNonZero(thresh) / gray_curr.size) * 100
    return motion_area > threshold

def sample_and_select_frames(video_path, output_dir, sampling_rate):
    # Create separate directories for selected frames
    selected_frames_dir = os.path.join(output_dir, "selected_frames")
    os.makedirs(selected_frames_dir, exist_ok=True)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error opening video file.")
        return
    
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_count = 0
    selected_frame_count = 0

    ret, prev_frame = cap.read()
    while ret:
        if frame_count % (fps // sampling_rate) == 0:
            # Proceed to check for significant motion for selection
            ret, current_frame = cap.read()
            if ret and is_significant_motion(prev_frame, current_frame, threshold=5.0):
                # Save selected frame due to significant motion
                selected_frame_path = os.path.join(selected_frames_dir, f"selected_frame_{selected_frame_count}.jpg")
                cv2.imwrite(selected_frame_path, current_frame)
                selected_frame_count += 1
            prev_frame = current_frame if ret else prev_frame

        frame_count += 1
        ret, _ = cap.read()  # Move to the next frame for sampling/checking

    cap.release()
    cap = None
    image_files = [f for f in os.listdir(selected_frames_dir) if os.path.isfile(os.path.join(selected_frames_dir, f))]

    # Load images into a list of numpy arrays
    images = []
    for image_file in image_files:
        image_path = os.path.join(selected_frames_dir, image_file)
        image = Image.open(image_path)
        image = image.resize((240, 240))
        images.append(np.array(image))
    ## remove
    os.remove(video_path)
    shutil.rmtree(output_dir)

    return images
