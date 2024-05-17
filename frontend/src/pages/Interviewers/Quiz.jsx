import React, { useState, useEffect } from 'react';
import { FaRegClock } from "react-icons/fa6";
import { FaBriefcase } from "react-icons/fa";
import { RiSurveyFill } from "react-icons/ri";
// import useDrivepicker from 'react-google-drive-picker';
const Quiz = () => {
    const [questions] = useState({
        "Q1": {
            "Type": "MCQ",
            "Question": "What is the capital of France?",  
            "Choices": ["Paris", "London", "Berlin"]
        },
        "Q2": {
            "Type": "TF",
            "Question": "Is the Earth round?",
            "Choices": ["True", "False"]
        },
        "Q3": {
            "Type": "Camera",
            "Question": "Please record a short video introducing yourself.",
            "Choices": []
        },
        "Q4": {
            "Type": "Written",
            "Question": "What is your age?",
            "Choices": []
        },
    });
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentQuestionKey, setCurrentQuestionKey] = useState(Object.keys(questions)[0]);
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [answers, setAnswers] = useState({});
    const [quizFinished, setQuizFinished] = useState(false);
    const [transitioning, setTransitioning] = useState(false); // State for smooth transition

    const handleNextQuestion = () => {
        if (quizFinished) return;
        setTransitioning(true); // Start transition
        setTimeout(() => {
            const questionKeys = Object.keys(questions);
            const currentIndex = questionKeys.indexOf(currentQuestionKey);
            if (questions[currentQuestionKey].Type === 'Written') {
                setAnswers(prevAnswers => ({
                    ...prevAnswers,
                    [currentQuestionKey]: document.querySelector('input[type="text"]').value
                }));
            }
            if (currentIndex === questionKeys.length - 1) {
                setQuizFinished(true);
                return;
            }
            const nextIndex = (currentIndex + 1);
            setCurrentQuestionKey(questionKeys[nextIndex]);
            setTimeLeft(60);
            setSelectedChoice(null);
            setTransitioning(false); // End transition
        }, 300); // Adjust the delay time to match your transition duration
    }

    const handleChoice = (choice) => {
        setSelectedChoice(choice);
    }

    const handleRecordVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                const chunks = [];

                mediaRecorder.ondataavailable = event => {
                    chunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const videoURL = URL.createObjectURL(blob);
                    
                    // Save the videoURL as the answer to the current question
                    setAnswers(prevAnswers => ({
                        ...prevAnswers,
                        [currentQuestionKey]: videoURL
                    }));
                };

                mediaRecorder.start();

                // Placeholder: You may want to set a timer to stop recording after a certain duration
                setTimeout(() => {
                    mediaRecorder.stop();
                }, 10000); // Recording duration of 10 seconds (adjust as needed)
            })
            .catch(error => {
                console.error('Error accessing camera:', error);
                // Handle error, e.g., display an error message to the user
            });
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTimeLeft => {
                const newTimeLeft = prevTimeLeft - 1;
                if (newTimeLeft === 0) {
                    handleNextQuestion();
                }
                return newTimeLeft;
            });
        }, 1000);
        return () => clearInterval(timer);
        // eslint-disable-next-line
    }, [currentQuestionKey]);

    useEffect(() => {
        // Store the selected choice in answers state
        if (selectedChoice !== null) {
            setAnswers(prevAnswers => ({
                ...prevAnswers,
                [currentQuestionKey]: selectedChoice
            }));
        }
        // eslint-disable-next-line
    }, [selectedChoice, currentQuestionKey, quizFinished]);
    useEffect(() => {
        // Log answers when quiz is finished
        if (quizFinished) {
            console.log("Interview finished. Answers:", answers);
        }
        // eslint-disable-next-line
    }, [quizFinished, answers]);
    const currentQuestion = questions[currentQuestionKey];
    const { Type, Question, Choices } = currentQuestion;
    if (quizFinished) {
        return (
            <div className='flex flex-col h-screen justify-center items-center'>
                <div className='bg-white p-4 rounded-md w-96'>
                    <h1 className='text-center text-3xl font-bold'>Interview Finished</h1>
                    <hr className='my-2 border-t-1 border-gray-400' />
                    <h2 className='text-center text-xl'>Thank you for taking the Interview</h2>
                </div>
            </div>
        )
    }
    return (
        <div className='flex flex-col h-screen justify-center items-center'>
            <div className={`transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
                <div className='bg-white p-4 rounded-md md:w-[700px] sm:w-full'>
                    <h1 className='text-center text-3xl font-bold'>Interview Time</h1>
                    <div className='flex flex-row justify-between my-3'>
                        <div  className='flex flex-r justify-center items-center gap-2'>
                            <FaBriefcase className= '' />
                            <h1 className='font-bold'>Google</h1>
                        </div>
                        <div className=' gap-2 flex flex-r justify-center items-center'>
                            <RiSurveyFill className='text-black' />
                            <h1 className='font-bold'>Software Engineer</h1>
                        </div>
                    </div>
                    <hr className='my-2 border-t-1 border-gray-400' />
                    <div className='flex flex-row justify-between items-center mt-5 mb-3 flex-wrap'>
                        <h2 className='text-center text-xl'>{Question}</h2>
                        <div className='bg-green-800 flex flex-row justify-center items-center p-2 rounded text-white'>
                            <FaRegClock className='' />
                            <p className=' ml-1 text-center'> : {timeLeft}</p>
                        </div>
                    </div>

                    {Type === 'MCQ' && Choices.map((choice, index) => (
                        <div key={index} className='flex items-center'>
                            <input type='radio' name='choice' className='hidden peer' id={`choice-${index}`} />
                            <label
                                htmlFor={`choice-${index}`}
                                onClick={() => handleChoice(choice)}
                                className={`w-full gap-4 p-4 mt-2  bg-gray-200 rounded-xl cursor-pointer ${selectedChoice === choice ? 'bg-gray-800 text-white' : 'hover:bg-gray-300'}`}
                            >
                                {choice}
                            </label>
                        </div>
                    ))}
                    {Type === 'TF' && Choices.map((choice, index) => (
                        <div key={index} className='flex items-center'>
                            <input type='radio' name='choice' className='hidden peer' id={`choice-${index}`} />
                            <label
                                htmlFor={`choice-${index}`}
                                onClick={() => handleChoice(choice)}
                                className={`w-full gap-4 p-4 mt-2 rounded-xl bg-gray-200 cursor-pointer ${selectedChoice === choice ? 'bg-gray-800 text-white' : 'hover:bg-gray-300'}`}
                            >
                                {choice}
                            </label>
                        </div>
                    ))}
                    {Type === 'Camera' && (
                        <div className='flex flex-col items-center'>
                            <button onClick={handleRecordVideo} className='bg-blue-600 text-white p-2 rounded-md w-full mt-4'>Record Video</button>
                        </div>
                    )}
                    {Type === 'Written' && (
                        <input type='text' className='border border-gray-400 w-full p-2 rounded-md mt-2' />
                    )}

                    <button onClick={handleNextQuestion} className='bg-blue-600 text-white p-2 rounded-md w-full mt-4'>{currentQuestionKey === Object.keys(questions)[Object.keys(questions).length - 1] ? 'Finish' : 'Next'}</button>
                </div>
            </div>
        </div>
    )
}

export default Quiz;
