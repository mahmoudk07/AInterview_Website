import React, { useState, createContext } from 'react'
import Header from '../../../components/Header/Header'
import { Stepper, Step, Button, Typography } from '@material-tailwind/react'
import InterviewScheduling from './components/Scheduling/InterviewScheduling'
import QuestionsAnswers from './components/QuestionsAnswers/QuestionsAnswers'
import CompletedInterview from './components/CompletedInterview/CompletedInterview'
import { useDispatch } from 'react-redux'
import { createInterview } from '../../../services/manager/managerSlice'
export const InterviewContext = createContext(null)
const CreateInterview = () => {
    const dispatch = useDispatch()
    const [numOfQuestions, setNumOfQuestions] = useState("")
    const [data, setData] = useState({
        "job_title": "",
        "job_description": "",
        "job_opportunity": "",
        "Date": "",
        "Time": "",
        "questions": []
    })
    const [activeStep, setActiveStep] = useState(0);
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(false);
    const checkCurrentData = () => data.Date !== "" && data.Time !== "" && numOfQuestions !== "" && data.title !== ""
    const hasEmptyValues = data.questions.some(question => Object.values(question).some(value => value === ""));
    const handleNext = () => checkCurrentData() &&!isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
    const CurrentContent = () => {
        switch (activeStep) {
            case 0:
                return <InterviewScheduling />
            case 1:
                return <QuestionsAnswers />
            case 2:
                return <CompletedInterview />
            default:
        }
    }
    const handleSubmit = async () => {
        await dispatch(createInterview(data)).then((response) => {
            if (response.error)
                console.log(response.error)
            else
                setActiveStep(2)
        })
    }
  return (
    <div className = 'w-full min-h-[80vh] overflow-x-hidden mt-[150px] mb-[50px]'>
        <Header />
        <InterviewContext.Provider value = {{data , setData, numOfQuestions , setNumOfQuestions}}>
            <div className='bg-transparent border-borderColor border-[1px] rounded-[10px] w-[40%] m-auto p-[3%]'>
                <Stepper
                    className='w-[100%]'
                    activeStep={activeStep}
                    isLastStep={(value) => setIsLastStep(value)}
                    isFirstStep={(value) => setIsFirstStep(value)} activeLineClassName='bg-green-500' lineClassName="bg-white/50">
                    <Step onClick={() => setActiveStep(0)} activeClassName='bg-white' completedClassName='bg-green-500'>
                        <div className="absolute -bottom-[2rem] ml-2 w-max text-center">
                            <Typography variant="h6" className='text-gray-400'>
                                Scheduiling
                            </Typography>
                        </div>
                    </Step>
                    <Step onClick={() => setActiveStep(1)} activeClassName='bg-white' completedClassName='bg-green-500'>
                        <div className="absolute -bottom-[2rem] ml-2 w-max text-center">
                            <Typography variant="h6" className='text-gray-400'>
                                Q/A
                            </Typography>
                        </div>
                    </Step>
                    <Step onClick={() => setActiveStep(2)} activeClassName='bg-green-500'>
                        <div className="absolute -bottom-[2rem] ml-2 w-max text-center">
                            <Typography variant="h6" className='text-gray-400'>
                                Completed
                            </Typography>
                        </div>
                    </Step>
                </Stepper>
                {CurrentContent()}
                {activeStep !== 2 &&
                    <div className="mt-16 flex justify-between">
                        <Button className='bg-transparent font-bold text-white border-[1px] rounded-[20px] border-borderColor text-[13px]'
                            onClick={handlePrev} disabled={isFirstStep}>
                            Prev
                        </Button>
                        {
                            activeStep === 1 ? <Button className='bg-transparent font-bold text-white border-[1px] rounded-[20px] border-borderColor text-[13px]'
                                  onClick={handleSubmit} disabled = {hasEmptyValues}>Confirm</Button> :
                                <Button className='bg-transparent font-bold text-white border-[1px] rounded-[20px] border-borderColor text-[13px]'
                                    onClick={handleNext} disabled={isLastStep}>
                                    Next
                                </Button>
                        }
                    </div>
                }
            </div>
        </InterviewContext.Provider>

    </div>
  )
}
export default CreateInterview