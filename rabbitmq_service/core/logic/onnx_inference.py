import cv2
import numpy as np



def emotions_detector(img_array,m):

    if len(img_array.shape)==2:
        img_array=cv2.cvtColor(img_array,cv2.COLOR_GRAY2RGB)
    test_image = cv2.resize(img_array, (256 ,256))
    
    im = test_image.astype(np.float32)

    im = np.expand_dims(im, axis = 0)

    
    onnx_pred = m.run(['output_1'], {"input_1": im})
    if np.argmax(onnx_pred[0][0])==0:
        emotion=0  ## confident
    else:
        emotion=1  ## unconfident
    return emotion



