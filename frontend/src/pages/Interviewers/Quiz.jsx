import React, { useState, useEffect } from 'react';
import { FaRegClock } from "react-icons/fa6";
import { FaBriefcase } from "react-icons/fa";
import { RiSurveyFill } from "react-icons/ri";
import Header from '../../components/Header/Header';
import { useLocation } from 'react-router-dom';

const Quiz = () => {
    const location = useLocation();
    const [questions, setQuestions] = useState({});
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentQuestionKey, setCurrentQuestionKey] = useState(null);
    const [selectedChoice, setSelectedChoice] = useState('');
    const [answers, setAnswers] = useState({});
    const [quizFinished, setQuizFinished] = useState(false);
    const [transitioning, setTransitioning] = useState(false); 
    const [recording, setRecording] = useState(false); 
    const [mediaRecorder, setMediaRecorder] = useState(null); 
    const [score, setScore] = useState(0); // Initialize the score
    const [finalized, setFinalized] = useState(false); // Track if final answers have been processed

    useEffect(() => {
        if (location.state && location.state.questions) {
            //console.log('Location State:', location.state);
            const UserId = location.state.userId;
            const InterviewId = location.state.interviewId;
            const transformedQuestions = location.state.questions.reduce((acc, question, index) => {
                const questionKey = `Q${index + 1}`;
                acc[questionKey] = {
                    Type: question.Type,
                    Question: question.Q1,    // Will be changed to the actual question when Mahmoud changes the field name
                    Choices: [], // Initialize Choices as an empty array, will be changed when Mahmoud adds Choices
                    Answer: question.Answer,
                    UserId: UserId,
                    InterviewId: InterviewId
                };
                return acc;
            }, {});
            setQuestions(transformedQuestions);
            setCurrentQuestionKey(Object.keys(transformedQuestions)[0]);
        }
    }, [location.state]);

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
        if (recording) {
            mediaRecorder.stop();
            setRecording(false);
        } else {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    const recorder = new MediaRecorder(stream);
                    setMediaRecorder(recorder);
                    const chunks = [];

                    recorder.ondataavailable = event => {
                        chunks.push(event.data);
                    };

                    recorder.onstop = () => {
                        const blob = new Blob(chunks, { type: 'video/webm' });
                        const videoURL = URL.createObjectURL(blob);

                        setAnswers(prevAnswers => ({
                            ...prevAnswers,
                            [currentQuestionKey]: videoURL
                        }));

                        // Stop all video tracks to release the camera
                        stream.getTracks().forEach(track => track.stop());
                    };

                    recorder.start();
                    setRecording(true);
                })
                .catch(error => {
                    console.error('Error accessing camera:', error);
                    // Handle error, e.g., display an error message to the user
                });
        }
    };

    useEffect(() => {
        if (quizFinished) return; // Stop the timer if the quiz is finished
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
    }, [currentQuestionKey, quizFinished]);

    useEffect(() => {
        // Store the selected choice in answers state
        if (selectedChoice !== null) {
            setAnswers(prevAnswers => ({
                ...prevAnswers,
                [currentQuestionKey]: selectedChoice
            }));
        }
    }, [selectedChoice, currentQuestionKey, quizFinished]);

    useEffect(() => {
        if (quizFinished && !finalized) {
            let newScore = 0;
            let SentFileToServer = [];
            const finalAnswers = Object.keys(questions).map(questionKey => {
                const question = questions[questionKey];
                const answer = answers[questionKey];
                // console.log("Question:", questionKey, "Answer:", answer);
                const UserID = question.UserId;
                const InterviewID = question.InterviewId;
                SentFileToServer.push(UserID.concat("_",InterviewID,"_",questionKey)); 
                if (question.Type === 'MCQ' || question.Type === 'TF') {
                    if (answer === question.Answer) {
                        newScore++;
                    }
                    return '';
                }

                if (question.Type === 'Technical') {
                    return answer || '';
                }

                return '';
            });

            finalAnswers.push(newScore);
            SentFileToServer.push(newScore);
            setScore(newScore);
            console.log("Interview finished. Final Answers:", finalAnswers);
            console.log("SentFileToServer:", SentFileToServer);
            setFinalized(true); 
        }
    }, [quizFinished, answers, questions, finalized]);

    if (!currentQuestionKey) {
        return <div>Loading...</div>;
    }

    const currentQuestion = questions[currentQuestionKey];
    const { Type, Question, Choices } = currentQuestion;

    if (quizFinished) {
        return (
            <div className='flex flex-col h-screen justify-center items-center'>
                <Header />
                <div className='bg-white p-4 rounded-md w-96'>
                    <h1 className='text-center text-3xl font-bold'>Interview Finished</h1>
                    <hr className='my-2 border-t-1 border-gray-400' />
                    <h2 className='text-center text-xl'>Thank you for taking the Interview</h2>
                    {/* <h3 className='text-center text-lg'>Your Score: {score}</h3> */}
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col h-screen justify-center items-center'>
            <Header />
            <div className={`transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
                <div className='bg-white p-4 rounded-md md:w-[700px] sm:w-full'>
                    <h1 className='text-center text-3xl font-bold'>Interview Time</h1>
                    <div className='flex flex-row justify-between my-3'>
                        <div className='flex flex-r justify-center items-center gap-2'>
                            <FaBriefcase className='' />
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
                    {Type === 'Technical' && (
                        <div className='flex flex-col items-center'>
                            <button disabled={recording} onClick={handleRecordVideo} className='bg-blue-600 text-white p-2 rounded-md w-full mt-4'>
                                {recording ? 'Stop Recording' : 'Record Video'}
                            </button>
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
