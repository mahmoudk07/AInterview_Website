import cv2
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt

def crop_faces(images,net):
    net=net
    cropped_faces=[]
    for img_array in images:
        (h, w) = img_array.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(img_array, (224, 224)), 1.0,
                                    (224, 224), (104.0, 177.0, 123.0))
    

        net.setInput(blob)
        detections = net.forward()

        for i in range(0, detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > 0.5:  # Confidence threshold
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")

                face = img_array[startY:endY, startX:endX]
                cropped_faces.append(face)
           
      
 
    # Plot each image in the grid
    cropped_faces = [face for face in cropped_faces if face.size > 0]
    

    # Filter out any empty arrays from cropped_faces
    preprocessed_faces = []

    target_size = (256, 256)

    for face in cropped_faces:
    # Resize face image
        face_resized = np.array(Image.fromarray(face).resize(target_size))
    # Add the preprocessed face to the list
        preprocessed_faces.append(face_resized)

    return preprocessed_faces
