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

![System Architecture](path/to/architecture-diagram.png)

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

### On Company's side

- Detailed score reports for each interviewee.
- Enhanced decision-making based on comprehensive interview data.

### On Interviewee's side

- Receive feedback and scores.
- Understand areas of improvement.

![Results and Outcomes](path/to/results-and-outcomes.png)

## Future Enhancements

- **Multiple Languages:** Support for international companies and interviews in different languages.
- **Enhanced Dashboards:** Dynamic visuals for interview insights.

## Contact

For any questions or suggestions, please contact:

- **Ahmed Tarek:** ahmed.tarek@example.com
- **Ahmed Magdy:** ahmed.magdy@example.com
- **Mahmoud Khaled:** mahmoud.khaled@example.com
- **Ziad Ezzat:** ziad.ezzat@example.com

Under the supervision of Dr. Ayman Abou El Maaty.
