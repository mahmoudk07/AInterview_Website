from core.logic.onnx_inference import emotions_detector
import numpy as np
def process_cropped_faces(cropped_faces,m):
    results = []
   
    for img in cropped_faces:
        result = emotions_detector(img,m=m)
        results.append(result)
    #print(results)
    percentage_of_zeros = np.mean(np.array(results) == 0) * 100
    #print(percentage_of_zeros)
    return percentage_of_zeros