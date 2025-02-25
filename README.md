# AÏnterview

AÏnterview is an AI-assisted interviewing toolkit designed to enhance the interview process for both interviewers and interviewees. It deploys video processing, machine intelligence, and natural language processing models to provide a better interview experience.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Modules in Depth](#modules-in-depth)
- [Approach](#approach)
- [Results and Outcomes](#results-and-outcomes)
- [Future Enhancements](#future-enhancements)
- [How to Run the Project](#how-to-run-the-project)
- [Contact](#contact)

## Introduction

AÏnterview is designed to make asynchronous online interviews more efficient and flexible. By leveraging advanced AI models, the system can process interview videos to evaluate both the content and the manner of responses.

## Features

- Asynchronous online interview processing
- AI-driven analysis for video, vocal, and text inputs
- Scoring and feedback for interviewees
- Detailed reports for companies
- Secure video upload to AWS S3

## Technology Stack

- **Frontend:** React
- **Backend:** FastAPI
- **Queue Management:** RabbitMQ
- **Machine Learning:** TensorFlow, Scikit-learn
- **Database:** MongoDB
- **Storage:** AWS S3

## System Architecture

The system follows a producer-consumer architecture:

- **Producer:** Handles video uploads to AWS S3 and sends job details to RabbitMQ.
- **Consumer:** Processes the videos using three main modules (Facial Expression Recognition, Vocal Analysis, NLP).

![System Architecture](https://firebasestorage.googleapis.com/v0/b/ainterview-5e7bf.appspot.com/o/images%2FScreenshot%202024-07-11%20at%2012.53.30%E2%80%AFAM.png?alt=media&token=6fa88123-e328-4187-954d-2e87f060b6db)

## Modules in Depth

### 1. NLP Module

- **Input:** Audio and JSON data
- **Processes:**
  - Sound recognition
  - Answer evaluation (TF-IDF, keyword scoring)
- **Output:** Final score based on textual answers

### 2. Vocal Analysis Module

- **Input:** Audio data
- **Processes:**
  - Feature extraction (MFCC spectrogram)
  - Emotion classification using trained SVM
- **Output:** Final score based on vocal analysis

### 3. Facial Recognition Module

- **Input:** Video frames
- **Processes:**
  - Image processing for face detection
  - Feature extraction and classification
- **Output:** Final score based on facial expressions

## Approach

1. **Video Upload:** Videos are uploaded to AWS S3.
2. **Job Queueing:** Details are sent to RabbitMQ.
3. **Processing:**
   - **NLP Analysis:** Evaluates the text of answers.
   - **Vocal Analysis:** Determines emotional tone.
   - **Facial Recognition:** Analyzes facial expressions.
4. **Scoring:** Combined scores are sent back to the user interface.

## Results and Outcomes

### On Company's Side

- Detailed score reports for each interviewee.
- Enhanced decision-making based on comprehensive interview data.

### On Interviewee's Side

- Receive feedback and scores.
- Understand areas of improvement.

![Results and Outcomes](https://firebasestorage.googleapis.com/v0/b/ainterview-5e7bf.appspot.com/o/images%2FScreenshot%202024-07-11%20at%2012.47.00%E2%80%AFAM.png?alt=media&token=7c7b8897-262a-44fe-b988-a50f9cb0df97)

## Future Enhancements

- **Multiple Languages:** Support for international companies and interviews in different languages.
- **Enhanced Dashboards:** Dynamic visuals for interview insights.

## How to Run the Project

### Frontend

1. Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```

### Backend

1. Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3. Start the server:
    ```bash
    uvicorn main:app --reload
    ```

## Contact

For any questions or suggestions, please contact:

- **Ahmed Tarek:** ahmedtarek1754@gmail.com
- **Ahmed Magdy:** ahmed.magdy@example.com
- **Mahmoud Khaled:** mahmoudkk177@gmail.com
- **Ziad Ezzat:** ziadsamadony@gmail.com

Under the supervision of Dr. Ayman Abou El Maaty.
