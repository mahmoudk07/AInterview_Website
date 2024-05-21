import librosa
import numpy as np
import os

def read_audio(path):
    data, samling_rate = librosa.load(path,duration = 2.4 ,offset = 0.6 )
    return [data, samling_rate]

def get_audio_features(data,sr):
    mfccs = librosa.feature.mfcc(y=data, sr=sr , n_mfcc = 25)  #may remove n_mfcc intially was 13
    return mfccs

def vocal_analysis(audio_path,vocal_model):
    data,sr = read_audio(audio_path)
    feature = get_audio_features(data,sr)
 
    feature_flatten = feature.reshape(1, -1)

   
    decision_function = vocal_model.decision_function(feature_flatten)

    index = np.where(decision_function[0] == np.max(decision_function[0]))
    emotions_info = {
            1: "Neutral",
            2: "Calm",
            3: "Happy",
            4: "Sad",
            5: "Angry",
            6: "Fearful",
            7: "Disgust",
        }
    weights = [0.5,0.8,0.45,0.4,0.2,0.2,0.1]
    oneorzero = [1,1,1,0,0,0,0]
    dict = {}
    for i in range(7):
        dict[i+1] = oneorzero[i]
    ranking = abs(decision_function[0])
    sorted_ranking = sorted(enumerate(ranking), key=lambda x: x[1], reverse=True)[:4]
    total_one_and_zero = []
    for i in range(len(sorted_ranking)):
        total_one_and_zero.append(sorted_ranking[i][0]+1)
    added_value = 0    
    for element in total_one_and_zero:
        if dict[element] == 1 :
            added_value = added_value + 0.15
        else :
            added_value = added_value - 0.1

    ranking = ranking / np.sum(ranking)
    Total_Score = (np.sum(ranking * weights) * 1 / 0.8 )
    if (int(index[0])+1) == 2 :
        Total_Score = Total_Score + 0.1
    Total_Score = Total_Score + added_value
    if Total_Score > 1 :
        Total_Score = 1
    print("Final Score : " , Total_Score)
    os.remove(audio_path)