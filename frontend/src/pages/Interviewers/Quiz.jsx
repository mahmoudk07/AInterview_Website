import React, { useState, useEffect } from 'react';
import { FaRegClock } from "react-icons/fa6";
import { FaBriefcase } from "react-icons/fa";
import { RiSurveyFill } from "react-icons/ri";
import Header from '../../components/Header/Header';
import { useLocation } from 'react-router-dom';
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    const [score, setScore] = useState(0);
    const [finalized, setFinalized] = useState(false);
    const [stopped, setStopped] = useState(false);
    const UserId = location.state.userId;
    const InterviewId = location.state.interviewId;
    const [counter, setCounter] = useState(0);
    const [totalTechnicalQuestions, setTotalTechnicalQuestions] = useState(0);
    const [allUploaded, setAllUploaded] = useState(false);
    const [gohometime, setGohometime] = useState(null);
    const [startGohomeCountdown, setStartGohomeCountdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (startGohomeCountdown && gohometime === 0) {
            navigate('/');
        }
    }, [gohometime, startGohomeCountdown, navigate]);

    useEffect(() => {
        if (startGohomeCountdown) {
            const interval = setInterval(() => {
                setGohometime(prevGohometime => prevGohometime - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [startGohomeCountdown]);

    useEffect(() => {
        if (location.state && location.state.questions) {
            const transformedQuestions = location.state.questions.reduce((acc, question, index) => {
                const questionKey = `Q${index + 1}`;
                acc[questionKey] = {
                    Type: question.Type,
                    Question: question[questionKey],
                    Choices: question.choices ? question.choices.split(',') : [],
                    Answer: question.Answer,
                    UserId: UserId,
                    InterviewId: InterviewId
                };
                return acc;
            }, {});
            setQuestions(transformedQuestions);
            setCurrentQuestionKey(Object.keys(transformedQuestions)[0]);
            const technicalCount = location.state.questions.filter(question => question.Type === 'Technical').length;
            setTotalTechnicalQuestions(technicalCount);
        }
    }, [location.state]);

    const handleNextQuestion = () => {
        if (quizFinished) return;
        setTransitioning(true);
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
            setTransitioning(false);
        }, 300);
    };

    const handleChoice = (choice) => {
        setSelectedChoice(choice);
    };

    const handleRecordVideo = () => {
        if (recording) {
            mediaRecorder.stop();
            setRecording(false);
            setStopped(true);
        } else {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    const recorder = new MediaRecorder(stream);
                    setMediaRecorder(recorder);
                    const chunks = [];

                    recorder.ondataavailable = event => {
                        chunks.push(event.data);
                    };

                    recorder.onstop = async () => {
                        const blob = new Blob(chunks, { type: 'video/webm' });
                        const videoURL = URL.createObjectURL(blob);
                        const FileName = UserId.concat("_", InterviewId, "_", currentQuestionKey, ".webm");

                        const target = { Bucket: "megz-bucket", Key: FileName, Body: blob };
                        const creds = { accessKeyId: 'DO00DKLWYQ693LRYQVNT', secretAccessKey: 'dzoaaPhHNeGoR1bVBdRh3YycWRw6mqEJxYWjBY9pMy8' };

                        setAnswers(prevAnswers => ({
                            ...prevAnswers,
                            [currentQuestionKey]: videoURL
                        }));

                        stream.getTracks().forEach(track => track.stop());

                        try {
                            const s3Client = new S3Client({
                                region: "fra1",
                                credentials: creds,
                                endpoint: "https://fra1.digitaloceanspaces.com"
                            });

                            const upload = new Upload({
                                client: s3Client,
                                queueSize: 4,
                                partSize: 5 * 1024 * 1024,
                                leavePartsOnError: false,
                                params: target,
                            });

                            upload.on("httpUploadProgress", (progress) => {
                                console.log(`Upload progress: ${Math.round((progress.loaded / progress.total) * 100)}%`);
                            });

                            await upload.done();
                            console.log('File uploaded successfully!');
                            setCounter(prevCounter => {
                                const newCounter = prevCounter + 1;
                                console.log('Counter to be checked under:', newCounter);
                                return newCounter;
                            })
                        } catch (error) {
                            console.error('Error uploading file:', error);
                        }
                    };

                    recorder.start();
                    setRecording(true);
                })
                .catch(error => {
                    console.error('Error accessing camera:', error);
                });
        }
    };

    useEffect(() => {
        console.log('Counter:', counter);
        console.log('Total Technical Questions:', totalTechnicalQuestions)
        if (counter === totalTechnicalQuestions && counter !== 0) {
            console.log('All videos have been uploaded!');
            setAllUploaded(true);
        }
    }, [counter, totalTechnicalQuestions]);

    useEffect(() => {
        if (quizFinished) return;
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
        if (selectedChoice !== null) {
            setAnswers(prevAnswers => ({
                ...prevAnswers,
                [currentQuestionKey]: selectedChoice
            }));
        }
    }, [selectedChoice, currentQuestionKey, quizFinished]);

    const Megz_Finished_Interview = async (SentFileToServer) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/interview/Process_Interview`, {
                Interview_ID: InterviewId.toString(),
                Interviewee_ID: UserId.toString(),
                Vedios_PATH: SentFileToServer,
                Score: score.toString()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 200) {
                console.log('Megz API Called Correctly:', response);
            }
        } catch (error) {
            console.error('Error finishing interview:', error);
        }
    };

    const Mahmoud_Finished_Interview = async () => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/auth/finish_interview/${InterviewId}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("7oda API", response);
        } catch (error) {
            console.error(error);
        }
    };

    const [SentFileToServer, setSentFileToServer] = useState([]);
    useEffect(() => {
        if (quizFinished && !finalized) {
            let newScore = 0;
            const filesToServer = [];
            const finalAnswers = Object.keys(questions).map(questionKey => {
                const question = questions[questionKey];
                const answer = answers[questionKey];
                const UserID = question.UserId;
                const InterviewID = question.InterviewId;
                

                if (question.Type === 'MCQ' || question.Type === 'TF') {
                    filesToServer.push("");
                    if (answer === question.Answer) {
                        newScore++;
                    }
                    return '';
                }

                if (question.Type === 'Technical') {
                    filesToServer.push(UserID.concat("_", InterviewID, "_", questionKey, ".webm"));
                    return answer || '';
                }

                return '';
            });

            setSentFileToServer(filesToServer);
            setScore(newScore);
            console.log("Interview finished. Final Answers:", finalAnswers);
            console.log("SentFileToServer:", filesToServer);
            Mahmoud_Finished_Interview();
            setFinalized(true);
        }
    }, [quizFinished, answers, questions, finalized]);

    useEffect(() => {
        if (allUploaded && quizFinished && finalized) {
            // console.log('Megz API Called Correctly:', SentFileToServer);
            Megz_Finished_Interview(SentFileToServer);
            console.log(score);
            setStartGohomeCountdown(true);
            setGohometime(5);
        }
    }, [allUploaded, quizFinished, finalized, SentFileToServer]);

    // useEffect(() => {
    //     if (quizFinished && !allUploaded && finalized) {
    //         setStartGohomeCountdown(true);
    //         setGohometime(5);
    //     }
    // }, [quizFinished, finalized, allUploaded]);

    if (!currentQuestionKey) {
        return <div>Loading...</div>;
    }

    const currentQuestion = questions[currentQuestionKey];
    const { Type, Question, Choices } = currentQuestion;

    if (allUploaded && finalized && quizFinished) {
        return (
            <div className='flex flex-col h-screen justify-center items-center'>
                <Header />
                <div className='bg-white p-4 rounded-md w-96'>
                    <h1 className='text-center text-3xl font-bold'>Interview Finished</h1>
                    <hr className='my-2 border-t-1 border-gray-400' />
                    <h2 className='text-center text-xl'>Thank you for taking the Interview</h2>
                    <p className='text-center text-md text-gray-400'>You will be redirected to the home page in {gohometime} seconds</p>
                </div>
            </div>
        );
    }

    if (quizFinished && finalized) {
        return (
            <div className='flex flex-col h-screen justify-center items-center'>
                <Header />
                <div className='bg-white p-4 rounded-md w-96'>
                    <h1 className='text-center text-3xl font-bold'>Answers are being Analyzed.....</h1>
                    <hr className='my-2 border-t-1 border-gray-400' />
                    <h2 className='text-center text-lg text-red-500'>Please don't Close this interview</h2>
                    <h2 className='text-center text-lg text-red-500'>Wait for a while it only takes seconds</h2>
                </div>
            </div>
        );
    }

    const TF_Choices = ['True', 'False'];
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
                    {Type === 'TF' && TF_Choices.map((choice, index) => (
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
                            <button onClick={handleRecordVideo} className='bg-blue-600 text-white p-2 rounded-md w-full mt-4'>
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
    );
}

export default Quiz;